"""
Proposal Agent — Part 3, Step 1.

Generates three proposal tiers (Premium / Standard / Budget) from the
compatibility-verified SKU list and validated requirements.
Each tier selects a different subset of modules and applies a different
discount strategy to hit the right price/value point.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.agents import mock_rag
from app.models.cot import CoTOutput


class ProposalInput(BaseModel):
    compatibility_output: dict
    qualified_requirements: dict


def _line_items(skus: list[str]) -> list[dict]:
    items = []
    for sku in skus:
        item = mock_rag.get_by_sku(sku)
        if item:
            items.append(
                {
                    "sku": sku,
                    "name": item["name"],
                    "qty": 1,
                    "unit_price_annual": item["price_annual"],
                    "currency": item["currency"],
                    "included_in_base": item["included_in_base"],
                }
            )
    return items


def _total(items: list[dict]) -> float:
    return sum(i["unit_price_annual"] for i in items)


class ProposalAgent(BaseAgent):
    name = "ProposalAgent"

    async def _execute(self, input: ProposalInput) -> CoTOutput:  # type: ignore[override]
        all_skus: list[str] = input.compatibility_output.get("final_skus", [])
        budget: float = input.qualified_requirements.get("budget_max", 500_000)

        # --- Premium: everything compatible ---
        premium_skus = all_skus
        premium_items = _line_items(premium_skus)
        premium_gross = _total(premium_items)
        premium_discount = 0.10
        premium_impl = 65_000
        premium_training = 25_000
        premium_total = (premium_gross * (1 - premium_discount)) + premium_impl + premium_training

        # --- Standard: drop optional/low-priority modules ---
        std_drop = {"WMS-MOBILE"}
        standard_skus = [s for s in all_skus if s not in std_drop]
        standard_items = _line_items(standard_skus)
        standard_gross = _total(standard_items)
        standard_discount = 0.08
        standard_impl = 55_000
        standard_training = 20_000
        standard_total = (standard_gross * (1 - standard_discount)) + standard_impl + standard_training

        # --- Budget: core only + mandatory integrations ---
        budget_keep = {"WMS-CORE", "WMS-SAP"}
        budget_skus = [s for s in all_skus if s in budget_keep]
        budget_items = _line_items(budget_skus)
        budget_gross = _total(budget_items)
        budget_discount = 0.05
        budget_impl = 40_000
        budget_training = 12_000
        budget_total = (budget_gross * (1 - budget_discount)) + budget_impl + budget_training

        proposals = {
            "premium": {
                "tier": "premium",
                "modules": premium_skus,
                "line_items": premium_items,
                "gross_license_myr": premium_gross,
                "discount_rate": premium_discount,
                "implementation_myr": premium_impl,
                "training_myr": premium_training,
                "total_annual_myr": round(premium_total, 2),
                "within_budget": premium_total <= budget,
                "description": "Full suite — all recommended modules, maximum automation and visibility.",
            },
            "standard": {
                "tier": "standard",
                "modules": standard_skus,
                "line_items": standard_items,
                "gross_license_myr": standard_gross,
                "discount_rate": standard_discount,
                "implementation_myr": standard_impl,
                "training_myr": standard_training,
                "total_annual_myr": round(standard_total, 2),
                "within_budget": standard_total <= budget,
                "description": "Recommended balance — core operations, analytics, and ERP integration.",
            },
            "budget": {
                "tier": "budget",
                "modules": budget_skus,
                "line_items": budget_items,
                "gross_license_myr": budget_gross,
                "discount_rate": budget_discount,
                "implementation_myr": budget_impl,
                "training_myr": budget_training,
                "total_annual_myr": round(budget_total, 2),
                "within_budget": budget_total <= budget,
                "description": "Minimum viable — core WMS and SAP connector only. Expandable post go-live.",
            },
        }

        result = {
            "proposals": proposals,
            "client_budget_myr": budget,
            "recommended_tier": "standard" if standard_total <= budget else "budget",
        }

        reasoning = (
            f"Generated 3 proposal tiers from {len(all_skus)} compatible SKUs. "
            f"Client budget: MYR {budget:,.0f}. "
            f"Premium: MYR {premium_total:,.0f} ({'within' if premium_total <= budget else 'over'} budget). "
            f"Standard: MYR {standard_total:,.0f} ({'within' if standard_total <= budget else 'over'} budget). "
            f"Budget: MYR {budget_total:,.0f} ({'within' if budget_total <= budget else 'over'} budget). "
            f"Recommended tier: {result['recommended_tier']}."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=result,
            confidence=0.92,
            agent_name=self.name,
        )
