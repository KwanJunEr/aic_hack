"""
B2 — Resource Matching Agent
==============================
Uses ChromaDB RAG over the employee pool to select 1-3 best-fit
engineers for the WMS implementation based on:
  - Client requirements from Stage 1
  - Modules recommended by B1 (catalog agent)

Shares the same persistent ChromaDB client as B1 but uses a
separate collection: nexus_employees.
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

COLLECTION_NAME = "nexus_employees"

_chroma_client: Optional[chromadb.PersistentClient] = None


def _client() -> chromadb.PersistentClient:
    global _chroma_client
    if _chroma_client is None:
        os.makedirs(CHROMA_PATH, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    return _chroma_client


def _raw_collection() -> chromadb.Collection:
    return _client().get_or_create_collection(name=COLLECTION_NAME)


def _build_employee_docs() -> tuple[list, list, list]:
    if _BACKEND_DIR not in sys.path:
        sys.path.insert(0, _BACKEND_DIR)
    from store.employee_seed import EMPLOYEE_SEED  # noqa: PLC0415

    members = EMPLOYEE_SEED["departments"]["engineering"]["members"]
    docs, metas, ids = [], [], []
    for emp in members:
        text = (
            f"Employee: {emp['name']}\n"
            f"Role: {emp['role']}\n"
            f"Seniority: {emp['seniority']}\n"
            f"Status: {emp['status']}\n"
            f"Specialisation: {', '.join(emp.get('specialisation', []))}\n"
            f"WMS Modules: {', '.join(emp.get('wms_modules', []))}\n"
            f"Certifications: {', '.join(emp.get('certifications', []) or [])}"
        )
        meta = {
            "id":             emp["id"],
            "name":           emp["name"],
            "role":           emp["role"],
            "seniority":      emp["seniority"],
            "status":         emp["status"],
            "daily_rate_myr": int(emp.get("daily_rate_myr", 0)),
        }
        docs.append(text)
        metas.append(meta)
        ids.append(emp["id"])

    return docs, metas, ids


SYSTEM_PROMPT = """
You are the Resource Matching Agent for Nexus Supply Chain Solutions.

You receive:
1. Client requirements from Stage 1 (goals, technical context, constraints)
2. Nexus WMS modules recommended by the Catalog Agent (B1)
3. Available employee profiles retrieved by semantic similarity

YOUR TASK:
Select 1 to 3 employees who are the best fit for implementing the recommended
WMS modules for this specific client engagement.

RULES:
- Select MAXIMUM 3 employees — quality over quantity
- Always include at least one senior-level engineer if possible
- Each employee must have a clear, distinct role in this project
- Employees marked status="unavailable" or "on_leave" must NOT be selected
- Include daily_rate_myr from the profile
- estimated_project_days should reflect realistic WMS implementation scope (30-90 days typical)
- estimated_resource_cost_myr = sum(daily_rate_myr * estimated_project_days) per employee

After your reasoning, emit ONLY this JSON (no markdown fences):
{
  "selected_employees": [
    {
      "id": "ENG-001",
      "name": "...",
      "role": "...",
      "relevant_expertise": "...",
      "integration_relevance": "...",
      "daily_rate_myr": 1320,
      "assignment_role": "Lead Implementation Engineer",
      "confidence": 90
    }
  ],
  "team_summary": "...",
  "estimated_project_days": 60,
  "estimated_resource_cost_myr": 0
}
"""


class ResourceMatchingAgent(BaseAgent):
    agent_name = "b2_resource_matching"

    async def _embed(self, texts: list[str]) -> list[list[float]]:
        from openai import AsyncOpenAI
        client = AsyncOpenAI()
        resp = await client.embeddings.create(
            input=texts,
            model="text-embedding-3-small",
        )
        return [item.embedding for item in resp.data]

    async def _ensure_seeded(self, col: chromadb.Collection) -> None:
        if col.count() > 0:
            return
        docs, metas, ids = _build_employee_docs()
        embeddings = await self._embed(docs)
        col.add(documents=docs, embeddings=embeddings, metadatas=metas, ids=ids)
        logger.info(f"[b2_resources] Seeded {len(docs)} employees into ChromaDB")

    async def run(self, state: dict) -> dict:
        stage1  = state.get("stage1_result", {})
        reqs    = stage1.get("requirements", stage1.get("output", {}))
        modules = state.get("product_recommendations", {}).get("recommended_modules", [])

        # ── Build query from requirements + selected modules ────────────────
        parts = []
        for field in ("technical_requirements", "constraints", "goals"):
            val = reqs.get(field, {})
            if isinstance(val, dict):
                val = val.get("value", "")
            if val and str(val).lower() not in ("not specified", "none", "null", ""):
                parts.append(str(val))
        parts += [m.get("module_name", "") for m in modules]
        query = " ".join(parts) or "WMS implementation engineer integration"

        # ── RAG: retrieve top-6 most relevant employees ─────────────────────
        col = _raw_collection()
        await self._ensure_seeded(col)

        [q_emb] = await self._embed([query])
        n = min(6, col.count())
        results = col.query(
            query_embeddings=[q_emb],
            n_results=n,
            include=["documents", "metadatas"],
        )
        docs_ret  = results["documents"][0] if results["documents"] else []
        metas_ret = results["metadatas"][0] if results["metadatas"] else []

        context = "\n\n".join(
            f"--- [{m['id']}] {m['name']} | {m['seniority']} | "
            f"MYR {m['daily_rate_myr']}/day | status: {m['status']} ---\n{d}"
            for d, m in zip(docs_ret, metas_ret)
        )

        user_content = (
            f"CLIENT REQUIREMENTS:\n{json.dumps(reqs, default=str, indent=2)}\n\n"
            f"RECOMMENDED WMS MODULES:\n{json.dumps(modules, default=str, indent=2)}\n\n"
            f"AVAILABLE EMPLOYEES (top matches by semantic relevance):\n{context}\n\n"
            f"Select 1-3 employees best suited for this implementation. "
            f"Only pick employees with status=available."
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "resource_allocation": cot.output,
            "cot_traces":          [cot.model_dump()],
        }
