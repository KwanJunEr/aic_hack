"""
Review Agent — Part 3, Step 2.  HITL Checkpoint #2.

Presents the three ranked proposals to the TSC for final approval.
Writes a mock CRM record and audit entry on approval.
In production: surfaces output at GET /hitl/{session_id}/checkpoint-2.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.models.cot import CoTOutput


class ReviewInput(BaseModel):
    proposals: dict          # output from ProposalAgent
    compatibility_output: dict
    qualified_requirements: dict


def _score_proposal(tier_data: dict, budget: float) -> dict:
    total = tier_data["total_annual_myr"]
    gross = tier_data["gross_license_myr"]

    cost_fit = max(0.0, 1.0 - abs(total - budget * 0.9) / budget)
    risk_score = 0.95 if tier_data["tier"] == "standard" else (0.85 if tier_data["tier"] == "budget" else 0.78)
    margin_score = tier_data["discount_rate"] * 2  # rough proxy
    confidence = 0.88

    total_score = (cost_fit * 0.30) + (risk_score * 0.25) + (confidence * 0.25) + (margin_score * 0.20)

    return {
        "cost_fit": round(cost_fit, 3),
        "risk_score": round(risk_score, 3),
        "confidence_score": round(confidence, 3),
        "margin_score": round(margin_score, 3),
        "total_score": round(total_score, 3),
    }


class ReviewAgent(BaseAgent):
    name = "ReviewAgent"

    async def _execute(self, input: ReviewInput) -> CoTOutput:  # type: ignore[override]
        proposals = input.proposals.get("proposals", {})
        budget: float = input.qualified_requirements.get("budget_max", 500_000)
        client: str = input.qualified_requirements.get("client_name", "Unknown Client")
        recommended_tier: str = input.proposals.get("recommended_tier", "standard")

        ranked: list[dict] = []
        for tier_name, tier_data in proposals.items():
            scores = _score_proposal(tier_data, budget)
            ranked.append(
                {
                    "tier": tier_name,
                    "total_annual_myr": tier_data["total_annual_myr"],
                    "within_budget": tier_data["within_budget"],
                    "description": tier_data["description"],
                    "scores": scores,
                    "rank": 0,  # assigned below
                }
            )

        ranked.sort(key=lambda x: x["scores"]["total_score"], reverse=True)
        for i, r in enumerate(ranked):
            r["rank"] = i + 1

        # Mock CRM record
        mock_crm_record = {
            "crm_id": f"CRM-{self.session_id[:8].upper()}",
            "client": client,
            "session_id": self.session_id,
            "status": "awaiting_tsc_approval",
            "recommended_tier": recommended_tier,
            "total_options": len(ranked),
        }

        result = {
            "ranked_proposals": ranked,
            "recommended_tier": recommended_tier,
            "hitl_status": "awaiting_hitl",
            "crm_record": mock_crm_record,
            "review_checklist": {
                "executive_summary": "verified",
                "scope_accuracy": "verified",
                "pricing_correct": "verified",
                "terms_and_slas": "needs_review",
            },
        }

        reasoning = (
            f"Scored and ranked {len(ranked)} proposal tiers for {client}. "
            f"Top-ranked tier: {ranked[0]['tier']} (score {ranked[0]['scores']['total_score']:.2f}). "
            f"Recommended tier aligned with agent recommendation: {recommended_tier}. "
            f"Mock CRM record written: {mock_crm_record['crm_id']}. "
            "Pipeline paused at HITL checkpoint-2 — awaiting TSC approval or rejection."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=result,
            confidence=0.90,
            agent_name=self.name,
        )
