import logging
from fastapi import APIRouter, HTTPException, Depends

from app.schema.stage1_schema import (
    Stage1RunRequest,
    HITLConfirmRequest,
    Stage1ConfirmRequest,
    Stage1EditRequest,
    Stage1RejectRequest,
    Stage1Response,
)
from app.services.stage1_service import (
    start_pipeline,
    confirm_pipeline,
    edit_pipeline,
    reject_pipeline,
    confirm_hitl,
    load_session,
)
from app.core.security import get_current_user

router = APIRouter(prefix="/pipeline/stage1", tags=["Stage 1 — Extraction"])
logger = logging.getLogger(__name__)


# ── Obstruction detection ─────────────────────────────────────────────────

def _detect_obstruction(state: dict) -> tuple[bool, str | None]:
    """
    Inspect pipeline state for critical gaps or inconsistencies.
    Returns (obstruction_detected, obstruction_reason).
    """
    requirements = state.get("requirements", {})

    # No requirements extracted at all
    if not requirements:
        return True, "AI could not extract any requirements from the transcript."

    # Count fields stuck at "Not specified"
    not_specified = [
        f for f in ("budget", "timeline", "goals")
        if not requirements.get(f)
        or str(requirements.get(f, {}).get("value", "")).strip().lower()
        in ("not specified", "", "none", "null")
    ]
    if len(not_specified) >= 2:
        return True, f"Critical fields missing: {', '.join(not_specified)}."

    # Budget validation: CRITICAL risk level
    budget = state.get("budget_validation", {})
    if isinstance(budget.get("risk_level"), str) and budget["risk_level"].upper() == "CRITICAL":
        reason = budget.get("risk_explanation") or "Critical budget risk detected."
        return True, reason

    # Gaps: 4+ high-urgency missing questions
    gaps = state.get("gaps", {})
    high_urgency = [
        q for q in (gaps.get("missing_questions") or [])
        if isinstance(q, dict) and q.get("urgency") == "high"
    ]
    if len(high_urgency) >= 4:
        return True, (
            f"{len(high_urgency)} high-urgency information gaps detected — "
            "additional context required before proceeding."
        )

    return False, None


# ── Start pipeline ────────────────────────────────────────────────────────

@router.post("/run", response_model=Stage1Response, summary="Start Stage 1 pipeline")
async def start_stage1(
    body: Stage1RunRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Kick off Stage 1.

    Preferred: pass transcript_id (upload session ID) — A1 fetches combined_text via MCP.
    Fallback:  pass transcript text directly (for testing).

    Runs A1 -> A2 -> A3 -> A4 -> A5 -> A6, then pauses at HITL.
    A7 (MongoDB persistence) does NOT run until human confirms.
    Returns status="awaiting_review".
    """
    try:
        body.validate_input()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    try:
        state = await start_pipeline(
            user_id=body.user_id,
            transcript_id=body.transcript_id,
            transcript=body.transcript,
            session_id=body.session_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.error(f"Stage 1 run failed: {exc}")
        raise HTTPException(status_code=500, detail="Pipeline failed to start.")

    obstruction_detected, obstruction_reason = _detect_obstruction(state)
    return Stage1Response(
        session_id=state["session_id"],
        status="awaiting_review",
        data=state,
        obstruction_detected=obstruction_detected,
        obstruction_reason=obstruction_reason,
    )


# ── Confirm (accept) ──────────────────────────────────────────────────────

@router.post("/confirm", response_model=Stage1Response, summary="Confirm Stage 1 output")
async def confirm_stage1(
    body: Stage1ConfirmRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Human accepts the pipeline output.
    Triggers A7: persists full state to MongoDB.
    Returns status="ready_for_stage2".
    """
    try:
        state = await confirm_pipeline(session_id=body.session_id)
    except Exception as exc:
        logger.error(f"Stage 1 confirm failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="Confirmation failed.")

    return Stage1Response(
        session_id=state["session_id"],
        status="ready_for_stage2",
        data=state,
    )


# ── Edit (corrections + full re-run) ─────────────────────────────────────

@router.post("/edit", response_model=Stage1Response, summary="Submit edits and re-run Stage 1")
async def edit_stage1(
    body: Stage1EditRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Human submits corrections or additional context.

    - user_edits: field-level patches merged into existing agent outputs.
    - additional_text: appended to the transcript before agents re-run.

    Merges updates into state, then re-triggers the full A1-A6 pipeline so
    agents incorporate the new context. Returns status="awaiting_review"
    once agents finish and the graph pauses at HITL again.
    """
    try:
        state = await edit_pipeline(
            session_id=body.session_id,
            user_edits=body.user_edits or {},
            additional_text=body.additional_text,
        )
    except Exception as exc:
        logger.error(f"Stage 1 edit failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="Edit failed.")

    obstruction_detected, obstruction_reason = _detect_obstruction(state)
    return Stage1Response(
        session_id=state["session_id"],
        status="awaiting_review",
        data=state,
        obstruction_detected=obstruction_detected,
        obstruction_reason=obstruction_reason,
        message="Pipeline re-ran with your corrections. Please review the updated output.",
    )


# ── Reject (full re-run from scratch) ────────────────────────────────────

@router.post("/reject", response_model=Stage1Response, summary="Reject and re-run Stage 1")
async def reject_stage1(
    body: Stage1RejectRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Human rejects the pipeline output.

    Logs the rejection reason and re-triggers the full Stage 1 pipeline
    from the MCP fetch step (A1). Nothing is persisted to MongoDB.
    Returns status="awaiting_review" once the pipeline re-runs.
    """
    try:
        state = await reject_pipeline(
            session_id=body.session_id,
            rejection_reason=body.rejection_reason,
        )
    except Exception as exc:
        logger.error(f"Stage 1 reject failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="Rejection failed.")

    obstruction_detected, obstruction_reason = _detect_obstruction(state)
    return Stage1Response(
        session_id=state["session_id"],
        status="awaiting_review",
        data=state,
        obstruction_detected=obstruction_detected,
        obstruction_reason=obstruction_reason,
        message="Output rejected. Pipeline has been re-run from the beginning.",
    )


# ── Legacy combined HITL endpoint ─────────────────────────────────────────

@router.post("/hitl/confirm", response_model=Stage1Response, summary="Submit HITL decision (legacy)")
async def hitl_confirm_endpoint(
    body: HITLConfirmRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Legacy single endpoint that accepts decision in the request body.
    Prefer /confirm, /edit, or /reject for new integrations.

    decision="accepted" -> A7 persists -> ready_for_stage2
    decision="edited"   -> re-run with user_edits -> awaiting_review
    decision="rejected" -> re-run from scratch -> awaiting_review
    """
    try:
        state = await confirm_hitl(
            session_id=body.session_id,
            decision=body.decision,
            user_edits=body.user_edits or {},
        )
    except Exception as exc:
        logger.error(f"HITL confirm failed for {body.session_id}: {exc}")
        raise HTTPException(status_code=500, detail="HITL confirmation failed.")

    status = "ready_for_stage2" if body.decision == "accepted" else "awaiting_review"
    return Stage1Response(
        session_id=state["session_id"],
        status=status,
        data=state,
    )


# ── Session state poll ─────────────────────────────────────────────────────

@router.get("/session/{session_id}", response_model=Stage1Response, summary="Get Stage 1 session state")
async def get_session(
    session_id: str,
    _: dict = Depends(get_current_user),
):
    """Poll persisted session state (available after /confirm completes)."""
    doc = await load_session(session_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found.")

    return Stage1Response(
        session_id=session_id,
        status=doc.get("status", "unknown"),
        data=doc,
    )
