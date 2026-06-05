"""
B5 — Stage 2 Persistence Agent
================================
Saves the final Stage 2 pipeline state to MongoDB.
Only runs after HITL acceptance — never before.
"""

import logging

from app.agents.stage_1.base import BaseAgent

logger = logging.getLogger(__name__)


class Stage2Persistence(BaseAgent):
    agent_name = "b5_stage2_persistence"

    async def run(self, state: dict) -> dict:
        from app.db.repositories.stage2_repo import save_stage2_session

        success = await save_stage2_session(state)
        level = logger.info if success else logger.error
        level(
            f"[b5] Stage 2 session {state.get('session_id')} "
            f"{'saved' if success else 'FAILED to save'} to MongoDB"
        )

        return {
            "stage2_saved": success,
            "cot_traces": [{
                "agent_name":  self.agent_name,
                "reasoning":   "Persisted accepted Stage 2 results to MongoDB.",
                "steps":       [],
                "output":      {"saved": success},
                "confidence":  1.0,
                "duration_ms": 0,
            }],
        }
