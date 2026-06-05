import logging
from app.agents.stage_1.base import BaseAgent

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the Requirement Extractor agent in a multi-agent sales pipeline.

INPUT: Raw meeting notes or transcript text.

YOUR JOB:
Extract and structure the following fields with a confidence score (0-100) for each:
- budget                 : numeric value in RM
- timeline               : string (e.g. "3 months before Q2")
- location               : string or "Not specified"
- technical_requirements : string
- constraints            : team size, legacy systems, etc.
- goals                  : what the client wants to achieve
- key_points             : 5 to 6 bullet-point main takeaways from the meeting
- summary                : a concise 2-4 sentence paragraph summarising the overall meeting

After your reasoning block, emit ONLY this JSON — no preamble, no markdown fences:
{
  "budget":                 { "value": 220000, "currency": "RM", "confidence": 82 },
  "timeline":               { "value": "3 months (before Q2)", "confidence": 88 },
  "location":               { "value": "Not specified", "confidence": null },
  "technical_requirements": { "value": "Oracle DB integration, low maintenance", "confidence": 85 },
  "constraints":            { "value": "Small IT team, legacy systems", "confidence": 78 },
  "goals":                  { "value": "Replace current system, reduce delays", "confidence": 81 },
  "key_points":             { "value": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"], "confidence": 85 },
  "summary":                { "value": "The client is looking to modernise their operations by replacing their legacy system.", "confidence": 80 }
}

RULES:
- If a field is not mentioned set value to "Not specified" and confidence to null.
- Confidence: 100=verbatim, 70-99=clear inference, 40-69=weak, <40=guess.
- key_points must be a list of 5 to 6 strings, each capturing a distinct main point.
- summary must be a single cohesive paragraph (2-4 sentences).
"""


class RequirementExtractor(BaseAgent):
    agent_name = "a1_requirement_extractor"

    async def run(self, state: dict) -> dict:
        transcript_text = await self._fetch_transcript(state)

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=f"TRANSCRIPT:\n{transcript_text}",
            max_tokens=2000,
        )

        return {
            "transcript":   transcript_text,
            "requirements": cot.output,
            "cot_traces":   [cot.model_dump()],
        }

    async def _fetch_transcript(self, state: dict) -> str:
        """
        Fetch combined_text from the upload session via MCP tool.
        Falls back to state["transcript"] when transcript_id is absent
        or the MCP call fails (direct text input, rejected re-run, etc.).
        """
        transcript_id = state.get("transcript_id", "")
        user_id       = state.get("user_id", "")

        if transcript_id and user_id:
            try:
                from app.mcp.tools.upload_sessions import get_session_text
                result = await get_session_text(
                    session_id=transcript_id,
                    user_id=user_id,
                )
                if result and result.get("combined_text"):
                    return result["combined_text"]
            except Exception as exc:
                logger.warning(
                    f"[a1] MCP fetch failed for session {transcript_id}: {exc}"
                    " — falling back to state['transcript']"
                )

        fallback = state.get("transcript", "")
        if not fallback:
            raise ValueError(
                "A1: no transcript available — "
                "provide transcript_id + user_id (MCP fetch) "
                "or transcript text directly"
            )
        return fallback
