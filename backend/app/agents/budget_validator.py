"""
Budget & Constraint Validator Agent — Part 1, Step 3.

Checks whether the client budget is feasible given:
  - Delivery timeline vs scope complexity
  - Geographic / location surcharges
  - Minimum viable product cost from the catalog
  - Margin floor enforcement

No LLM call in production — pure rule-based logic + lightweight scoring.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.models.cot import CoTOutput

# Minimum cost thresholds per scope indicator (MYR)
_MIN_COST_PER_SITE = 35_000
_IMPLEMENTATION_BASE = 60_000
_TRAINING_PER_SITE = 5_000
_LOCATION_SURCHARGE = {"international": 0.15, "east_malaysia": 0.08, "peninsular": 0.0}
_MARGIN_FLOOR = 0.18  # 18 % minimum gross margin


class BudgetValidatorInput(BaseModel):
    qualified_requirements: dict


class BudgetValidatorAgent(BaseAgent):
    name = "BudgetValidatorAgent"

    async def _execute(self, input: BudgetValidatorInput) -> CoTOutput:  # type: ignore[override]
        req = input.qualified_requirements
        budget: float = req.get("budget_max", 0)
        timeline: int = req.get("timeline_days", 90)
        location: str = req.get("location", "")
        sites: int = next(
            (s["value"] for s in req.get("technical_specs", []) if s["spec_key"] == "warehouse_sites"),
            1,
        )

        # Location surcharge
        loc_key = "east_malaysia" if "sabah" in location.lower() or "sarawak" in location.lower() else "peninsular"
        surcharge_rate = _LOCATION_SURCHARGE.get(loc_key, 0.0)

        # Minimum viable cost estimation
        min_software = sites * _MIN_COST_PER_SITE
        min_impl = _IMPLEMENTATION_BASE + (sites - 1) * 10_000
        min_training = sites * _TRAINING_PER_SITE
        min_total = (min_software + min_impl + min_training) * (1 + surcharge_rate)

        # Margin-adjusted target (what we need to cover margin floor)
        target_with_margin = min_total / (1 - _MARGIN_FLOOR)

        budget_feasible = budget >= min_total
        margin_ok = budget >= target_with_margin

        # Timeline feasibility (rough: 2 weeks per site + 3 weeks integration)
        min_timeline = sites * 14 + 21
        timeline_feasible = timeline >= min_timeline

        flags: list[str] = []
        if not budget_feasible:
            flags.append(f"CRITICAL: Budget MYR {budget:,.0f} is below minimum viable cost MYR {min_total:,.0f}.")
        if not margin_ok:
            flags.append(f"WARN: Margin floor {_MARGIN_FLOOR:.0%} not achievable — target MYR {target_with_margin:,.0f}.")
        if not timeline_feasible:
            flags.append(f"WARN: {timeline} days is below estimated minimum {min_timeline} days for {sites} sites.")
        if surcharge_rate > 0:
            flags.append(f"INFO: Location surcharge {surcharge_rate:.0%} applied for {loc_key}.")

        result = {
            "budget_feasible": budget_feasible,
            "timeline_feasible": timeline_feasible,
            "margin_achievable": margin_ok,
            "estimated_min_cost_myr": round(min_total, 2),
            "target_with_margin_myr": round(target_with_margin, 2),
            "location_surcharge_rate": surcharge_rate,
            "min_timeline_days": min_timeline,
            "flags": flags,
            "risk_level": "HIGH" if not budget_feasible or not timeline_feasible else ("MEDIUM" if not margin_ok else "LOW"),
        }

        reasoning = (
            f"Evaluated {sites}-site deployment in '{location}'. "
            f"Minimum viable cost estimated at MYR {min_total:,.0f} "
            f"(software MYR {min_software:,.0f} + implementation MYR {min_impl:,.0f} + training MYR {min_training:,.0f}). "
            f"Client budget MYR {budget:,.0f} is {'sufficient' if budget_feasible else 'INSUFFICIENT'}. "
            f"Timeline {timeline} days vs minimum {min_timeline} days: {'OK' if timeline_feasible else 'TIGHT'}. "
            f"Risk level: {result['risk_level']}. {len(flags)} flags raised."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=result,
            confidence=0.94,
            agent_name=self.name,
        )
