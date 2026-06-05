"""
Stage 1 service
===============
Business logic layer between the FastAPI router and the LangGraph runner.
"""

import logging
from app.agents.stage_1.runner import run_stage1, resume_stage1

logger = logging.getLogger(__name__)


# ── Pipeline start ────────────────────────────────────────────────────────

async def start_pipeline(
    user_id:       str,
    transcript_id: str = None,
    transcript:    str = None,
    session_id:    str = None,
) -> dict:
    """
    Start Stage 1. Returns state paused at HITL (status: awaiting_review).
    A7 (MongoDB persist) does NOT run until human confirms.
    """
    if not transcript_id and not transcript:
        raise ValueError("Provide either transcript_id or transcript text.")

    return await run_stage1(
        session_id=session_id,
        user_id=user_id,
        transcript_id=transcript_id,
        transcript=transcript,
    )


# ── HITL decisions ────────────────────────────────────────────────────────

async def confirm_pipeline(session_id: str) -> dict:
    """
    Human accepted the output.
    A7 persists state to MongoDB -> status: ready_for_stage2.
    """
    return await resume_stage1(
        session_id=session_id,
        decision="accepted",
        user_edits={},
    )


async def edit_pipeline(
    session_id:      str,
    user_edits:      dict = None,
    additional_text: str = None,
) -> dict:
    """
    Human submitted corrections.
    Merges edits/additional_text into state, then re-runs the full A1-A6
    pipeline so agents incorporate the new context.
    Returns state paused at HITL again (status: awaiting_review).
    """
    edits = dict(user_edits or {})
    if additional_text:
        edits["additional_text"] = additional_text

    return await resume_stage1(
        session_id=session_id,
        decision="edited",
        user_edits=edits,
    )


async def reject_pipeline(
    session_id:       str,
    rejection_reason: str = None,
) -> dict:
    """
    Human rejected the output.
    Logs rejection reason and re-triggers the full pipeline from A1 (MCP fetch).
    Nothing is persisted. Returns state paused at HITL again (status: awaiting_review).
    """
    user_edits = {}
    if rejection_reason:
        user_edits["rejection_reason"] = rejection_reason
        logger.info(f"[stage1] session {session_id} rejected — reason: {rejection_reason}")

    return await resume_stage1(
        session_id=session_id,
        decision="rejected",
        user_edits=user_edits,
    )


async def confirm_hitl(
    session_id: str,
    decision:   str,
    user_edits: dict = None,
) -> dict:
    """Legacy helper used by /hitl/confirm endpoint."""
    return await resume_stage1(
        session_id=session_id,
        decision=decision,
        user_edits=user_edits or {},
    )


# ── Session load ──────────────────────────────────────────────────────────

async def load_session(session_id: str) -> dict | None:
    """Load persisted Stage 1 session from MongoDB."""
    from app.db.repositories.stage1_repo import get_stage1_session
    return await get_stage1_session(session_id)


# ── Transcript stubs (backed by upload-session service) ───────────────────

async def get_transcripts(user_id: str, limit: int = 20, skip: int = 0) -> dict:
    from app.services.upload_session_service import fetch_sessions
    sessions = await fetch_sessions(user_id, limit=limit, skip=skip)
    docs = [s.model_dump() for s in sessions]
    return {"transcripts": docs, "total": len(docs)}


async def get_transcript(session_id: str, user_id: str) -> dict | None:
    from app.services.upload_session_service import fetch_session
    session = await fetch_session(session_id, user_id)
    return session.model_dump() if session else None


