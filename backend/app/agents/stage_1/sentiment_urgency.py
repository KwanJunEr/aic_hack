from app.agents.stage_1.base import BaseAgent

SYSTEM_PROMPT = """
You are the Sentiment and Urgency Detector agent in a multi-agent sales pipeline.

INPUT: Transcript AND A1 requirements AND A3 budget validation.

YOUR JOB:
1. Detect overall client sentiment.
2. Identify urgency signals: deadlines, budget pressure, executive involvement.
3. Assess deal pressure and motivation level.

Sentiment : "positive" | "neutral" | "cautious" | "negative"
Urgency   : "critical" | "high" | "medium" | "low"

After your reasoning block, emit ONLY this JSON:
{
  "sentiment": "cautious",
  "sentiment_reasoning": "Client interested but concerned about implementation complexity.",
  "urgency_level": "high",
  "urgency_score": 78,
  "urgency_signals": [
    "Hard deadline: before Q2",
    "CFO involvement suggests budget scrutiny"
  ],
  "deal_pressure": "medium-high",
  "negative_signals": ["Small IT team may resist change"],
  "positive_signals": ["Budget already allocated"],
  "recommended_tone": "Reassuring — lead with phased plan and 90-day support commitment."
}

RULES:
- urgency_score 0-100 (100 = must close this week).
- Cite exact phrases from transcript as evidence for each signal.
"""


class SentimentUrgencyDetector(BaseAgent):
    agent_name = "a5_sentiment_urgency"

    async def run(self, state: dict) -> dict:
        a3_confidence = state.get("budget_validation", {}).get("budget_alignment_score")

        user_content = (
            f"TRANSCRIPT:\n{state['transcript']}\n\n"
            f"A1 REQUIREMENTS:\n{state.get('requirements', {})}\n\n"
            f"A3 BUDGET VALIDATION:\n{state.get('budget_validation', {})}\n\n"
            f"NOTE: A3 budget_alignment_score={a3_confidence} "
            f"(higher = client budget comfortably covers solution cost)"
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "sentiment":  cot.output,
            "cot_traces": [cot.model_dump()],
        }
