"""
Compatibility Agent — Part 2, Step 2.

Calls CatalogAgent in-process (A2A) to resolve full SKU metadata, then
checks that every selected module's dependency chain is satisfied and that
no conflicting modules are co-selected.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.agents import mock_rag
from app.models.cot import CoTOutput

# Pairs of SKUs that cannot be deployed together (mock rule set)
_CONFLICT_PAIRS: list[tuple[str, str]] = [
    # Example: 3PL portal conflicts with single-tenant analytics in this demo
    # ("WMS-3PL", "WMS-ANALYTICS"),
]


class CompatibilityInput(BaseModel):
    catalog_output: dict


class CompatibilityAgent(BaseAgent):
    name = "CompatibilityAgent"

    async def _execute(self, input: CompatibilityInput) -> CoTOutput:  # type: ignore[override]
        selected_skus: list[str] = input.catalog_output.get("recommended_skus", [])

        conflicts: list[dict] = []
        missing_deps: list[dict] = []
        resolved: list[dict] = []

        for sku in selected_skus:
            item = mock_rag.get_by_sku(sku)
            if not item:
                continue

            # Check required dependencies are also selected
            for dep in item.get("requires", []):
                if dep not in selected_skus:
                    missing_deps.append({"sku": sku, "missing_dependency": dep})

            # Check hard compatibility list
            for other in selected_skus:
                if other == sku:
                    continue
                other_item = mock_rag.get_by_sku(other)
                if other_item and sku not in other_item.get("compatibility", []):
                    conflicts.append({"sku_a": sku, "sku_b": other, "reason": "Not listed in compatibility matrix."})

            # Check explicit conflict pairs
            for a, b in _CONFLICT_PAIRS:
                if {a, b} == {sku, other if "other" in dir() else ""}:
                    conflicts.append({"sku_a": a, "sku_b": b, "reason": "Known incompatible pair."})

            resolved.append(
                {
                    "sku": sku,
                    "name": item["name"],
                    "compatible": True,
                    "dependencies_met": len([d for d in item.get("requires", []) if d not in selected_skus]) == 0,
                }
            )

        # Auto-add missing dependencies
        auto_added: list[str] = []
        for issue in missing_deps:
            dep = issue["missing_dependency"]
            if dep not in selected_skus and dep not in auto_added:
                auto_added.append(dep)

        final_skus = selected_skus + auto_added
        overall_ok = len(conflicts) == 0

        result = {
            "final_skus": final_skus,
            "auto_added_dependencies": auto_added,
            "conflicts": conflicts,
            "missing_deps_resolved": missing_deps,
            "compatibility_ok": overall_ok,
            "compatibility_score": 1.0 if overall_ok else max(0.4, 1.0 - len(conflicts) * 0.2),
            "resolved_modules": resolved,
        }

        reasoning = (
            f"Checked compatibility matrix for {len(selected_skus)} selected SKUs. "
            f"{len(conflicts)} conflict(s) detected. "
            f"{len(missing_deps)} missing dependenc(ies) — auto-resolved by adding: {auto_added or 'none'}. "
            f"Final SKU list: {final_skus}. "
            f"Overall compatibility: {'PASS' if overall_ok else 'FAIL — manual review required'}."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=result,
            confidence=result["compatibility_score"],
            agent_name=self.name,
        )
