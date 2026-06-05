from app.agents.stage_1.base import BaseAgent

SYSTEM_PROMPT = """
You are the Past Deal Comparator agent in a multi-agent B2B sales pipeline operating in Malaysia.

INPUT: Transcript, A1 requirements, A2 gaps, A3 budget validation.

YOUR JOB:
Score this deal's readiness by comparing it against typical past deals:
1. Compute an overall deal_readiness_score (0-100).
2. Assign a label based on the score.
3. Provide sub-scores for each dimension.
4. Flag the primary risk and give a concise explanation.

Label thresholds:
  >= 80  → "Ready to proceed"
  60-79  → "Proceed with caution"
  40-59  → "Needs clarification"
  < 40   → "High risk — do not proceed"

After your reasoning block, emit ONLY this JSON:
{
  "deal_readiness_score": 72,
  "label": "Proceed with caution",
  "sub_scores": {
    "requirements_clarity": 80,
    "stakeholder_clarity": 55,
    "budget_alignment": 85,
    "technical_feasibility": 78,
    "timeline_realism": 70
  },
  "risk_level": "MEDIUM",
  "risk_explanation": "Stakeholder clarity is low — decision maker not confirmed.",
  "confidence": 75,
  "completeness": 68,
  "comparable_deals": [
    {
      "deal_type": "ERP integration, Malaysian SME",
      "outcome": "Won",
      "similarity": "high",
      "key_lesson": "Phased delivery closed the deal when budget was tight."
    }
  ],
  "recommended_next_action": "Request a stakeholder mapping session before the next call."
}

RULES:
- Use A2 stakeholder_clarity directly as the stakeholder_clarity sub-score.
- Use A3 budget_alignment_score directly as the budget_alignment sub-score.
- comparable_deals: 1-3 entries drawn from general B2B SaaS/ERP Malaysia context.
- All numeric scores are integers 0-100.
"""


class PastDealComparator(BaseAgent):
    agent_name = "a4_past_deal_comparator"

    async def run(self, state: dict) -> dict:
        gaps            = state.get("gaps", {})
        budget          = state.get("budget_validation", {})

        # A2A READ: pull clarity scores produced by upstream agents
        stakeholder_clarity    = gaps.get("stakeholder_clarity", "unknown")
        budget_alignment_score = budget.get("budget_alignment_score", "unknown")

        user_content = (
            f"TRANSCRIPT:\n{state['transcript']}\n\n"
            f"A1 REQUIREMENTS:\n{state.get('requirements', {})}\n\n"
            f"A2 GAPS:\n{gaps}\n"
            f"  stakeholder_clarity={stakeholder_clarity}\n\n"
            f"A3 BUDGET VALIDATION:\n{budget}\n"
            f"  budget_alignment_score={budget_alignment_score}"
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "past_deals": cot.output,
            "cot_traces": [cot.model_dump()],
        }
