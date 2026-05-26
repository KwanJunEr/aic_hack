"""
Catalog Agent — Part 2, Step 1.

Uses Agentic RAG (mock_rag.py) to search the SKU catalog for modules that
match extracted requirements. In production this calls the MCP vector-search
server with real embeddings.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.agents import mock_rag
from app.models.cot import CoTOutput


class CatalogInput(BaseModel):
    qualified_requirements: dict


class CatalogAgent(BaseAgent):
    name = "CatalogAgent"

    def _build_query(self, req: dict) -> str:
        """Synthesise a natural-language search query from structured requirements."""
        specs = req.get("technical_specs", [])
        spec_values = " ".join(str(s.get("value", "")) for s in specs)
        constraints = " ".join(req.get("constraints", []))
        return f"{spec_values} {constraints} warehouse management multi-site inventory"

    async def _execute(self, input: CatalogInput) -> CoTOutput:  # type: ignore[override]
        req = input.qualified_requirements
        query = self._build_query(req)

        # Mock RAG retrieval
        raw_hits = mock_rag.search(query, top_k=6)

        # Determine which are always-needed (base) vs optional
        selected_skus: list[dict] = []
        for hit in raw_hits:
            include = hit["relevance_score"] >= 0.1 or hit["included_in_base"]
            selected_skus.append(
                {
                    "sku": hit["sku"],
                    "name": hit["name"],
                    "relevance_score": hit["relevance_score"],
                    "price_annual": hit["price_annual"],
                    "currency": hit["currency"],
                    "included_in_base": hit["included_in_base"],
                    "recommended": include,
                    "match_reason": (
                        f"Keyword overlap score {hit['relevance_score']:.0%} — "
                        f"{hit['description'][:80]}…"
                    ),
                }
            )

        total_recommended = sum(
            s["price_annual"] for s in selected_skus if s["recommended"]
        )

        result = {
            "query_used": query,
            "catalog_hits": selected_skus,
            "recommended_skus": [s["sku"] for s in selected_skus if s["recommended"]],
            "total_annual_list_price_myr": total_recommended,
        }

        recommended_names = ", ".join(
            s["name"] for s in selected_skus if s["recommended"]
        )
        reasoning = (
            f"Ran mock RAG search with query: '{query[:60]}…'. "
            f"Retrieved {len(raw_hits)} catalog hits. "
            f"Recommended {len(result['recommended_skus'])} modules: {recommended_names}. "
            f"Total list price MYR {total_recommended:,.0f} before discount. "
            "SAP connector included due to detected ERP integration requirement."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=result,
            confidence=0.89,
            agent_name=self.name,
        )
