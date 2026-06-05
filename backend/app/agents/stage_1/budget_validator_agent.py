from app.agents.stage_1.base import BaseAgent

SYSTEM_PROMPT = """
You are the Budget Validator agent in a multi-agent sales pipeline operating in Malaysia.

INPUT: Raw transcript AND A1 requirements.

YOUR JOB:
1. Extract the client's stated budget from transcript.
2. Estimate realistic solution cost range in RM based on technical scope.
3. Compare to Malaysia/SEA industry benchmarks.
4. Assign risk_level: "low" | "medium" | "high"

After your reasoning block, emit ONLY this JSON:
{
  "client_budget": 220000,
  "currency": "RM",
  "estimated_cost_min": 195000,
  "estimated_cost_max": 250000,
  "billing_period": "annual",
  "potential_gap": 30000,
  "risk_level": "medium",
  "budget_alignment_score": 85,
  "insight": "Budget close but may fall short — confirm CFO approval headroom.",
  "notes": "Client hinted budget may increase due to new Johor site.",
  "industry_benchmark": {
    "segment": "ERP integration, SME, Malaysia",
    "typical_range_min": 180000,
    "typical_range_max": 280000,
    "currency": "RM",
    "source": "SEA enterprise software market 2024",
    "client_vs_benchmark": "within range"
  }
}

RULES:
- Use RM currency throughout.
- If budget not stated set client_budget to null and risk_level to "unknown".
"""


class BudgetValidator(BaseAgent):
    agent_name = "a3_budget_validator"

    async def run(self, state: dict) -> dict:
        requirements = state.get("requirements", {})

        user_content = (
            f"TRANSCRIPT:\n{state['transcript']}\n\n"
            f"A1 EXTRACTED REQUIREMENTS:\n{requirements}"
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "budget_validation": cot.output,
            "cot_traces":        [cot.model_dump()],
        }
