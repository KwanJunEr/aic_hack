import logging
from app.agents.stage_1.base import BaseAgent

logger = logging.getLogger(__name__)


class SessionPersistence(BaseAgent):
    agent_name = "a7_session_persistence"

    async def run(self, state: dict) -> dict:
        """
        Persists the full merged pipeline state to MongoDB.
        Only runs after HITL accepts or edits — never on rejection.
        """
        saved = await self._write_to_db(state)

        return {
            "session_saved": saved,
            "cot_traces": [{
                "agent_name":  self.agent_name,
                "reasoning":   "Session persistence — no inference required.",
                "steps":       [],
                "output":      {"session_saved": saved},
                "confidence":  1.0 if saved else 0.0,
                "duration_ms": None,
            }],
        }

    async def _write_to_db(self, state: dict) -> bool:
        try:
            from app.db.repositories.stage1_repo import save_stage1_session
            await save_stage1_session(dict(state))
            return True
        except Exception as exc:
            logger.error(f"[a7] DB write failed: {exc}")
            return False
