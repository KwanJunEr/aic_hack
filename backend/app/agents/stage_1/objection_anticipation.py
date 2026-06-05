from app.agents.stage_1.base import BaseAgent

SYSTEM_PROMPT = """
You are the Objection Anticipator agent in a multi-agent sales pipeline.

INPUT: Transcript AND outputs from A1 (requirements), A3 (budget), A5 (sentiment).
The evidence field in each objection MUST cite which agent's data supports it.

YOUR JOB:
Pre-generate the 4 most likely objections with counter-responses for the sales rep.

Objection categories: "budget" | "technical" | "resource" | "timeline" | "trust" | "procurement"

After your reasoning block, emit ONLY this JSON:
{
  "objections": [
    {
      "category": "resource",
      "objection": "Our IT team is too small to handle implementation.",
      "likelihood": "high",
      "counter_response": "We deploy with teams as small as 2 people. 90-day dedicated support included.",
      "evidence": "A1 constraints=small IT team; A5 negative_signals=IT resistance"
    },
    {
      "category": "technical",
      "objection": "We are worried about Oracle DB compatibility.",
      "likelihood": "high",
      "counter_response": "Certified Oracle integration layer — 12 live deployments.",
      "evidence": "A1 technical_requirements=Oracle DB integration"
    },
    {
      "category": "budget",
      "objection": "The full cost might exceed our allocation.",
      "likelihood": "medium",
      "counter_response": "Phased rollout — Phase 1 within RM220k, Phase 2 scoped after Johor budget is confirmed.",
      "evidence": "A3 potential_gap=RM30k; risk_level=medium"
    },
    {
      "category": "procurement",
      "objection": "We need CFO sign-off before committing.",
      "likelihood": "medium",
      "counter_response": "I can prepare a one-page CFO executive summary with ROI projections.",
      "evidence": "A5 urgency_signals=CFO involvement"
    }
  ],
  "total_objections": 4,
  "highest_risk_objection": "Our IT team is too small to handle implementation."
}

RULES:
- Likelihood: "high" | "medium" | "low". Maximum 5 objections.
- Counter-responses must reference specific details from prior agent outputs.
"""


class ObjectionAnticipator(BaseAgent):
    agent_name = "a6_objection_anticipator"

    async def run(self, state: dict) -> dict:
        cot_summary = self._summarise_upstream_cot(state.get("cot_traces", []))

        user_content = (
            f"TRANSCRIPT:\n{state['transcript']}\n\n"
            f"A1 REQUIREMENTS:\n{state.get('requirements', {})}\n\n"
            f"A3 BUDGET VALIDATION:\n{state.get('budget_validation', {})}\n\n"
            f"A5 SENTIMENT:\n{state.get('sentiment', {})}\n\n"
            f"UPSTREAM AGENT CONFIDENCE SUMMARY:\n{cot_summary}"
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "objections": cot.output,
            "cot_traces": [cot.model_dump()],
        }

    def _summarise_upstream_cot(self, cot_traces: list) -> dict:
        return {
            t["agent_name"]: t.get("confidence")
            for t in cot_traces
            if isinstance(t, dict) and "agent_name" in t
        }
