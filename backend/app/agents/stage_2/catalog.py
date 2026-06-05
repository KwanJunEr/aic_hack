"""
B1 — Product Catalog RAG Agent
================================
Queries a ChromaDB collection of Nexus WMS modules, ranks them
against the Stage 1 requirements, and returns ONLY the modules
that fit the client — WMS-CORE is always included.

Embedding strategy:
  - OpenAI text-embedding-3-small called async, embeddings passed
    directly to chromadb (avoids chromadb embedding-function API churn).
  - Persistent collection lives at <project_root>/chroma_db — seeded
    once, reused on every subsequent restart.
"""

import os
import sys
import json
import logging
from typing import Optional

import chromadb

from app.agents.stage_1.base import BaseAgent

logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────
_HERE        = os.path.dirname(os.path.abspath(__file__))
CHROMA_PATH  = os.path.normpath(os.path.join(_HERE, "../../../../chroma_db"))
_BACKEND_DIR = os.path.normpath(os.path.join(_HERE, "../../.."))

COLLECTION_NAME = "nexus_wms_modules"

# ── Lazy singleton ───────────────────────────────────────────────────────
_chroma_client: Optional[chromadb.PersistentClient] = None


def _client() -> chromadb.PersistentClient:
    global _chroma_client
    if _chroma_client is None:
        os.makedirs(CHROMA_PATH, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    return _chroma_client


def _raw_collection() -> chromadb.Collection:
    """Return the collection WITHOUT an embedding function (we pass embeddings manually)."""
    return _client().get_or_create_collection(name=COLLECTION_NAME)


# ── Seed helpers ──────────────────────────────────────────────────────────

def _build_module_docs() -> tuple[list, list, list]:
    """Return (documents, metadatas, ids) for all Nexus WMS modules."""
    if _BACKEND_DIR not in sys.path:
        sys.path.insert(0, _BACKEND_DIR)
    from store.product_seed import PRODUCT_SEED  # noqa: PLC0415

    wms = next((p for p in PRODUCT_SEED if p["productCode"] == "NEXUS-WMS"), None)
    if not wms:
        raise RuntimeError("NEXUS-WMS not found in product_seed.py")

    docs, metas, ids = [], [], []
    for mod in wms["modules"]:
        text = (
            f"Module: {mod['moduleName']}\n"
            f"Code: {mod['moduleCode']}\n"
            f"Description: {mod['description']}\n"
            f"Features: {', '.join(mod.get('features', []))}\n"
            f"Tags: {', '.join(mod.get('tags', []))}"
        )
        pricing = mod.get("pricing", {})
        meta = {
            "module_code":   mod["moduleCode"],
            "module_name":   mod["moduleName"],
            "included":      "true" if mod.get("included") else "false",
            "monthly_price": int(pricing.get("monthly", 0)),
            "annual_price":  int(pricing.get("annual", 0)),
        }
        docs.append(text)
        metas.append(meta)
        ids.append(mod["moduleCode"])

    return docs, metas, ids


# ── LLM system prompt ─────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are the Product Catalog RAG Agent for Nexus Supply Chain Solutions.

You receive:
1. Stage 1 client requirements (goals, technical requirements, constraints, budget)
2. The most relevant Nexus WMS module documents retrieved by semantic search

YOUR TASK:
Recommend ONLY the Nexus WMS (Warehouse Management System) modules that match
the client's specific needs.

CRITICAL RULES:
- ALWAYS include WMS-CORE — it is mandatory with every Nexus WMS license
- Recommend additional modules ONLY when there is clear evidence in the client's
  requirements (e.g. yard management = WMS-YARD, robotics = WMS-ROBOT, 3PL = WMS-3PL,
  analytics/reporting = WMS-ANALYTICS)
- Do NOT recommend Nexus TMS or Nexus OMS modules
- Use the EXACT pricing values from the retrieved module documents
- Base license (WMS-CORE): monthly=37000, annual=396000 MYR
- Confidence: 90-100 = strong fit, 70-89 = moderate fit, 50-69 = possible fit

After your reasoning, emit ONLY this JSON (no markdown fences):
{
  "recommended_modules": [
    {
      "module_code": "WMS-CORE",
      "module_name": "Core Warehouse Operations",
      "business_impact": "...",
      "monthly_price": 0,
      "annual_price": 0,
      "confidence": 95,
      "reasoning": "..."
    }
  ],
  "base_license_monthly": 37000,
  "base_license_annual": 396000,
  "addon_monthly_total": 0,
  "addon_annual_total": 0,
  "total_monthly_estimate": 37000,
  "total_annual_estimate": 396000,
  "recommendation_summary": "..."
}
"""


class CatalogRAGAgent(BaseAgent):
    agent_name = "b1_catalog_rag"

    # ── Async embedding via OpenAI ─────────────────────────────────────────
    async def _embed(self, texts: list[str]) -> list[list[float]]:
        from openai import AsyncOpenAI
        client = AsyncOpenAI()
        resp = await client.embeddings.create(
            input=texts,
            model="text-embedding-3-small",
        )
        return [item.embedding for item in resp.data]

    # ── One-time collection seeding ────────────────────────────────────────
    async def _ensure_seeded(self, col: chromadb.Collection) -> None:
        if col.count() > 0:
            return
        docs, metas, ids = _build_module_docs()
        embeddings = await self._embed(docs)
        col.add(documents=docs, embeddings=embeddings, metadatas=metas, ids=ids)
        logger.info(f"[b1_catalog] Seeded {len(docs)} WMS modules into ChromaDB")

    async def run(self, state: dict) -> dict:
        stage1   = state.get("stage1_result", {})
        reqs     = stage1.get("requirements", stage1.get("output", {}))
        combined = state.get("combined_text", "")

        # ── Build query from Stage 1 requirements ─────────────────────────
        parts = []
        for field in ("goals", "technical_requirements", "constraints"):
            val = reqs.get(field, {})
            if isinstance(val, dict):
                val = val.get("value", "")
            if val and str(val).lower() not in ("not specified", "none", "null", ""):
                parts.append(str(val))
        if combined:
            parts.append(combined[:400])
        query = " ".join(parts) or "warehouse management system modules picking receiving"

        # ── RAG: retrieve all WMS modules (top-5 = all of them) ───────────
        col = _raw_collection()
        await self._ensure_seeded(col)

        [q_emb] = await self._embed([query])
        n = min(5, col.count())
        results = col.query(
            query_embeddings=[q_emb],
            n_results=n,
            include=["documents", "metadatas"],
        )
        docs_ret  = results["documents"][0]  if results["documents"]  else []
        metas_ret = results["metadatas"][0]  if results["metadatas"]  else []

        context = "\n\n".join(
            f"--- MODULE [{m['module_code']}] "
            f"(monthly: MYR {m['monthly_price']}, annual: MYR {m['annual_price']}) ---\n{d}"
            for d, m in zip(docs_ret, metas_ret)
        )

        stage1_summary = json.dumps({
            "requirements":      reqs,
            "gaps":              stage1.get("gaps", {}),
            "budget_validation": stage1.get("budget_validation", {}),
            "sentiment":         stage1.get("sentiment", {}),
            "objections":        stage1.get("objections", []),
        }, default=str, indent=2)

        user_content = (
            f"STAGE 1 CLIENT ANALYSIS:\n{stage1_summary}\n\n"
            f"RETRIEVED WMS MODULE CATALOG (ranked by semantic relevance):\n{context}\n\n"
            f"Recommend the appropriate Nexus WMS modules for this client."
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2500,
        )

        return {
            "product_recommendations": cot.output,
            "cot_traces":              [cot.model_dump()],
        }
