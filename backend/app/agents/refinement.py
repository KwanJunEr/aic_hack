"""
Refinement Agent — Feedback Loop.

Triggered when the TSC rejects proposals at HITL checkpoint-2.
Accepts the rejection reason + optional TSC overrides, re-optimises
the proposal set, and re-routes back to ReviewAgent for another HITL cycle.

In production this forms a LangGraph loop edge: review → refinement → review.
Max iterations are capped to prevent infinite loops.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.agents import mock_rag
from app.models.cot import CoTOutput

_MAX_ITERATIONS = 3


class RefinementInput(BaseModel):
    previous_proposals: dict
    rejection_reason: str
    tsc_overrides: dict = {}   # e.g. {"budget_max": 420000, "drop_skus": ["WMS-MOBILE"]}
    iteration: int = 1


class RefinementAgent(BaseAgent):
    name = "RefinementAgent"

    async def _execute(self, input: RefinementInput) -> CoTOutput:  # type: ignore[override]
        if input.iteration > _MAX_ITERATIONS:
            return CoTOutput(
                reasoning=(
                    f"Max refinement iterations ({_MAX_ITERATIONS}) reached. "
                    "Escalating to senior sales manager for manual intervention."
                ),
                output={
                    "status": "escalated",
                    "reason": "max_iterations_exceeded",
                    "iteration": input.iteration,
                },
                confidence=0.50,
                agent_name=self.name,
            )

        prev_proposals: dict = input.previous_proposals.get("proposals", {})
        overrides = input.tsc_overrides
        drop_skus: list[str] = overrides.get("drop_skus", [])
        new_budget: float | None = overrides.get("budget_max")
        adjust_discount: float = overrides.get("extra_discount", 0.03)

        adjustments_made: list[str] = []
        refined_proposals: dict = {}

        for tier_name, tier_data in prev_proposals.items():
            modules: list[str] = [s for s in tier_data.get("modules", []) if s not in drop_skus]
            if drop_skus:
                adjustments_made.append(f"Removed {drop_skus} from {tier_name} tier.")

            # Recalculate with adjusted discount
            new_discount = min(tier_data.get("discount_rate", 0.08) + adjust_discount, 0.25)
            gross = sum(
                (mock_rag.get_by_sku(s) or {}).get("price_annual", 0) for s in modules
            )
            impl = tier_data.get("implementation_myr", 55_000)
            training = tier_data.get("training_myr", 20_000)
            total = (gross * (1 - new_discount)) + impl + training

            effective_budget = new_budget or tier_data.get("total_annual_myr", total) * 1.1

            refined_proposals[tier_name] = {
                **tier_data,
                "modules": modules,
                "gross_license_myr": gross,
                "discount_rate": new_discount,
                "total_annual_myr": round(total, 2),
                "within_budget": total <= effective_budget,
                "refinement_iteration": input.iteration,
            }

            adjustments_made.append(
                f"{tier_name}: discount raised to {new_discount:.0%}, new total MYR {total:,.0f}."
            )

        result = {
            "status": "refined",
            "iteration": input.iteration,
            "rejection_reason": input.rejection_reason,
            "adjustments_made": adjustments_made,
            "refined_proposals": refined_proposals,
            "next_step": "review" if input.iteration < _MAX_ITERATIONS else "escalate",
        }

        reasoning = (
            f"Refinement iteration {input.iteration}/{_MAX_ITERATIONS}. "
            f"TSC rejection reason: '{input.rejection_reason}'. "
            f"Applied overrides: drop_skus={drop_skus}, extra_discount={adjust_discount:.0%}, "
            f"new_budget={new_budget}. "
            f"{len(adjustments_made)} adjustments made. "
            "Re-routing to ReviewAgent for next HITL cycle."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=result,
            confidence=0.82,
            agent_name=self.name,
        )
