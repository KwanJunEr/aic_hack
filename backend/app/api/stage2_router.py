import logging
from fastapi import APIRouter, HTTPException, Depends

from app.schema.stage2_schema import (
    Stage2RunRequest,
    Stage2AcceptRequest,
    Stage2RejectRequest,
    Stage2EditRequest,
    Stage2Response,
)
from app.services.stage2_service import (
    start_stage2,
    accept_stage2,
    reject_stage2,
    edit_stage2,
    load_stage2_session,
)
from app.core.security import get_current_user

router = APIRouter(prefix="/pipeline/stage2", tags=["Stage 2 — Product Matching"])
logger = logging.getLogger(__name__)


# ── Start pipeline ────────────────────────────────────────────────────────

@router.post("/run", response_model=Stage2Response, summary="Start Stage 2 pipeline")
async def run_stage2_endpoint(
    body: Stage2RunRequest,
    _: dict = Depends(get_current_user),
):
    """
    Kick off Stage 2 Multi-Agent Product Matching.

    Preferred: pass stage1_session_id to load Stage 1 results from MongoDB.
    Fallback:  pass stage1_result dict directly (for testing) or omit both
               to use the seed fixture.

    Runs B1 (Catalog RAG) → B2 (Resource Matching) → B3 (Architecture)
    → B4 (Integration Planning), then pauses at HITL.
    B5 (MongoDB persistence) does NOT run until human confirms.
    Returns status="awaiting_review".
    """
    try:
        state = await start_stage2(
            user_id=body.user_id,
            stage1_session_id=body.stage1_session_id or "",
            stage1_result=body.stage1_result,
            combined_text=body.combined_text or "",
            session_id=body.session_id,
        )
    except Exception as exc:
        logger.error(f"Stage 2 run failed: {exc}")
        raise HTTPException(status_code=500, detail="Pipeline failed to start.")

    return Stage2Response(
        session_id=state["session_id"],
        status="awaiting_review",
        data=state,
        message="Stage 2 pipeline complete. Review the output below before accepting.",
    )


# ── Accept ────────────────────────────────────────────────────────────────

@router.post("/accept", response_model=Stage2Response, summary="Accept Stage 2 output")
async def accept_stage2_endpoint(
    body: Stage2AcceptRequest,
    _: dict = Depends(get_current_user),
):
    """
    Human accepts the pipeline output.
    Triggers B5: persists full Stage 2 state to MongoDB.
    Returns status="accepted".
    """
    try:
        state = await accept_stage2(session_id=body.session_id)
    except Exception as exc:
        logger.error(f"Stage 2 accept failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="Acceptance failed.")

    return Stage2Response(
        session_id=state["session_id"],
        status="accepted",
        data=state,
        message="Stage 2 results accepted and saved to MongoDB.",
    )


# ── Reject ────────────────────────────────────────────────────────────────

@router.post("/reject", response_model=Stage2Response, summary="Reject Stage 2 output")
async def reject_stage2_endpoint(
    body: Stage2RejectRequest,
    _: dict = Depends(get_current_user),
):
    """
    Human rejects the pipeline output.
    Nothing is persisted to MongoDB.
    Returns status="rejected" with improvement_suggestions.
    """
    try:
        state = await reject_stage2(
            session_id=body.session_id,
            rejection_reason=body.rejection_reason,
        )
    except Exception as exc:
        logger.error(f"Stage 2 reject failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="Rejection failed.")

    return Stage2Response(
        session_id=state["session_id"],
        status="rejected",
        data=state,
        message="Stage 2 output rejected.",
        improvement_suggestions=state.get("improvement_suggestions", []),
    )


# ── Edit (corrections + full re-run) ─────────────────────────────────────

@router.post("/edit", response_model=Stage2Response, summary="Submit edits and re-run Stage 2")
async def edit_stage2_endpoint(
    body: Stage2EditRequest,
    _: dict = Depends(get_current_user),
):
    """
    Human submits corrections or free-text feedback.

    - user_edits: field-level patches for individual agent outputs.
    - feedback_text: appended to the transcript so all agents re-process
      the enriched context on the next pass.

    Re-triggers the full B1-B4 pipeline, then pauses at HITL again.
    Returns status="awaiting_review".
    """
    try:
        state = await edit_stage2(
            session_id=body.session_id,
            user_edits=body.user_edits or {},
            feedback_text=body.feedback_text,
        )
    except Exception as exc:
        logger.error(f"Stage 2 edit failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="Edit failed.")

    return Stage2Response(
        session_id=state["session_id"],
        status="awaiting_review",
        data=state,
        message="Pipeline re-ran with your feedback. Please review the updated output.",
    )


# ── Session state poll ────────────────────────────────────────────────────

@router.get(
    "/session/{session_id}",
    response_model=Stage2Response,
    summary="Get Stage 2 session state",
)
async def get_stage2_session(
    session_id: str,
    _: dict = Depends(get_current_user),
):
    """Poll a persisted Stage 2 session (available after /accept completes)."""
    doc = await load_stage2_session(session_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found.")

    return Stage2Response(
        session_id=session_id,
        status=doc.get("status", "unknown"),
        data=doc,
    )
