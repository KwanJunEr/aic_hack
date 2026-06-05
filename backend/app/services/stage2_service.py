"""
Stage 2 service
===============
Business logic layer between the FastAPI router and the LangGraph runner.
Mirrors the Stage 1 service structure exactly.
"""

import logging
from app.agents.stage_2.runner import run_stage2, resume_stage2

logger = logging.getLogger(__name__)


# ── Pipeline start ────────────────────────────────────────────────────────

async def start_stage2(
    user_id:           str,
    stage1_session_id: str = "",
    stage1_result:     dict = None,
    combined_text:     str = "",
    session_id:        str = None,
) -> dict:
    """
    Start Stage 2. Loads Stage 1 results from MongoDB when stage1_session_id
    is provided; falls back to the seed data if nothing is found.
    Returns state paused at HITL (status: awaiting_review).
    """
    # Load Stage 1 results from MongoDB if only the session ID is given
    if stage1_session_id and not stage1_result:
        try:
            from app.db.repositories.stage1_repo import get_stage1_session
            doc = await get_stage1_session(stage1_session_id)
            if doc:
                stage1_result = doc
                combined_text = combined_text or doc.get("transcript", "")
                logger.info(f"[stage2_service] loaded Stage 1 doc {stage1_session_id}")
        except Exception as exc:
            logger.warning(f"[stage2_service] could not load Stage 1 doc: {exc}")

    # Final fallback — use the seed fixture so the pipeline is never empty
    if not stage1_result:
        from store.stage1_result_seed import STAGE1_SEED
        stage1_result = STAGE1_SEED
        logger.warning("[stage2_service] No Stage 1 result found — using seed data")

    return await run_stage2(
        session_id=session_id,
        user_id=user_id,
        stage1_session_id=stage1_session_id,
        stage1_result=stage1_result,
        combined_text=combined_text,
    )


# ── HITL decisions ────────────────────────────────────────────────────────

async def accept_stage2(session_id: str) -> dict:
    """
    Human accepted. B5 persists state to MongoDB.
    Returns status: accepted.
    """
    return await resume_stage2(session_id=session_id, decision="accepted")


async def reject_stage2(session_id: str, rejection_reason: str = None) -> dict:
    """
    Human rejected. Returns improvement suggestions; nothing is persisted.
    """
    user_edits = {}
    if rejection_reason:
        user_edits["rejection_reason"] = rejection_reason
        logger.info(f"[stage2] session {session_id} rejected — reason: {rejection_reason}")

    return await resume_stage2(
        session_id=session_id,
        decision="rejected",
        user_edits=user_edits,
    )


async def edit_stage2(
    session_id:    str,
    user_edits:    dict = None,
    feedback_text: str = None,
) -> dict:
    """
    Human submitted corrections. Merges edits + feedback_text into state,
    then re-triggers the full B1-B4 pipeline so agents re-run with new context.
    Returns state paused at HITL again (status: awaiting_review).
    """
    return await resume_stage2(
        session_id=session_id,
        decision="edited",
        user_edits=user_edits or {},
        feedback_text=feedback_text,
    )


# ── Session load ──────────────────────────────────────────────────────────

async def load_stage2_session(session_id: str) -> dict | None:
    """Load a persisted Stage 2 session from MongoDB."""
    from app.db.repositories.stage2_repo import get_stage2_session
    return await get_stage2_session(session_id)
