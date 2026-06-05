"""
Supplementary Missing Info Agent
=================================
Produces a severity-rated list of missing-information items by cross-referencing
the transcript against A1 requirements and A2 gaps.

This is more granular than A2 (GapDetector): it uses CRITICAL / HIGH / MEDIUM / LOW
severity labels and provides an explicit "reason" per gap explaining why the missing
data threatens the deal.

Output key: "missing_info" (dict)
Not wired into the main A1-A6 pipeline by default; can be added after A2 if needed.
"""

from app.agents.stage_1.base import BaseAgent

SYSTEM_PROMPT = """
You are a senior sales consultant specialising in identifying critical information
gaps in B2B sales deals. You will review an extracted requirements set alongside
already-detected gaps and produce a final, severity-rated missing-information report.

After your reasoning block, emit ONLY this JSON — no prose, no markdown fences:
{
  "missing_information": [
    {
      "order": 1,
      "question": "<exact question the sales rep should ask, verbatim>",
      "severity": "CRITICAL",
      "reason": "<one sentence explaining why this gap threatens the deal>",
      "category": "stakeholder | budget | technical | timeline | procurement | other"
    },
    {
      "order": 2,
      "question": "<question>",
      "severity": "HIGH",
      "reason": "<reason>",
      "category": "budget"
    }
  ],
  "total_gaps": 2,
  "critical_count": 1,
  "highest_severity": "CRITICAL"
}

Severity guide:
  CRITICAL — deal cannot progress without this (e.g. no decision maker identified)
  HIGH     — significant risk if unknown (e.g. procurement process, budget approval)
  MEDIUM   — important but a workaround exists (e.g. exact user count, deployment region)
  LOW      — nice to have, will not block the deal (e.g. preferred vendor portal)

RULES:
- Order items by severity descending (CRITICAL first).
- Return 3-6 gaps maximum — focus on what truly matters.
- Write questions as natural conversational phrases the rep can use verbatim.
- Do not duplicate questions already in A2 gaps unless you are elevating their severity.
- If A1 budget.confidence < 60, the budget question must be CRITICAL or HIGH.
"""


class MissingInfoAgent(BaseAgent):
    agent_name = "supplementary_missing_info"

    async def run(self, state: dict) -> dict:
        requirements = state.get("requirements", {})
        gaps         = state.get("gaps", {})

        # A2A READ: pull A1 confidence map and A2 already-detected questions
        a1_confidence = {
            k: v.get("confidence")
            for k, v in requirements.items()
            if isinstance(v, dict) and "confidence" in v
        }
        a2_questions = [
            q.get("question", "")
            for q in gaps.get("missing_questions", [])
            if isinstance(q, dict)
        ]

        user_content = (
            f"TRANSCRIPT:\n{state.get('transcript', '')}\n\n"
            f"A1 EXTRACTED REQUIREMENTS:\n{requirements}\n"
            f"A1 CONFIDENCE SCORES: {a1_confidence}\n\n"
            f"A2 ALREADY-DETECTED QUESTIONS (avoid duplicating):\n"
            + "\n".join(f"- {q}" for q in a2_questions)
            + f"\n\nA2 CLARITY SCORES: "
            f"requirements_clarity={gaps.get('requirements_clarity')}, "
            f"stakeholder_clarity={gaps.get('stakeholder_clarity')}"
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        return {
            "missing_info": cot.output,
            "cot_traces":   [cot.model_dump()],
        }
