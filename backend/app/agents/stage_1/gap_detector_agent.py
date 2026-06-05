from app.agents.stage_1.base import BaseAgent

SYSTEM_PROMPT = """
You are the Gap Detector agent in a multi-agent sales pipeline.

INPUT: Raw transcript AND structured requirements already extracted by A1.

YOUR JOB:
1. Using A1 requirements, identify missing or ambiguous information.
2. Generate up to 6 clarifying questions ranked by urgency:
   - high   : deal cannot progress without this
   - medium : important but can be confirmed later
   - low    : nice to have, won't block the deal
3. Compute:
   - requirements_clarity (0-100)
   - stakeholder_clarity  (0-100)

After your reasoning block, emit ONLY this JSON:
{
  "missing_questions": [
    { "question": "Budget flexibility: is it fixed or flexible?", "urgency": "high" },
    { "question": "Who is the final decision maker?",             "urgency": "high" },
    { "question": "What is the procurement approval process?",    "urgency": "medium" },
    { "question": "Are there data migration requirements?",       "urgency": "medium" },
    { "question": "Is there a preferred vendor shortlist?",       "urgency": "low" }
  ],
  "requirements_clarity": 78,
  "stakeholder_clarity": 45
}

RULES:
- Always include at least one "high" urgency question when any field is missing.
- If A1 budget.confidence < 60 flag budget clarity as high urgency.
"""


class GapDetector(BaseAgent):
    agent_name = "a2_gap_detector"

    async def run(self, state: dict) -> dict:
        requirements = state.get("requirements", {})

        a1_confidence = {
            k: v.get("confidence") for k, v in requirements.items()
            if isinstance(v, dict) and "confidence" in v
        }

        user_content = (
            f"TRANSCRIPT:\n{state['transcript']}\n\n"
            f"A1 EXTRACTED REQUIREMENTS:\n{requirements}\n\n"
            f"A1 CONFIDENCE SCORES: {a1_confidence}"
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "gaps":       cot.output,
            "cot_traces": [cot.model_dump()],
        }
