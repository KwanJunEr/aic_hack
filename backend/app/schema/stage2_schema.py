from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


# ── API request schemas ───────────────────────────────────────────────────

class Stage2RunRequest(BaseModel):
    user_id: str = Field(..., description="Required for session ownership")
    session_id: Optional[str] = Field(
        None,
        description="Reuse an existing session ID; auto-generated if omitted",
    )
    stage1_session_id: Optional[str] = Field(
        None,
        description="Stage 1 session ID — loads Stage 1 results from MongoDB",
    )
    stage1_result: Optional[Dict[str, Any]] = Field(
        None,
        description="Direct Stage 1 result dict (fallback if session_id not provided)",
    )
    combined_text: Optional[str] = Field(
        None,
        description="Raw transcript text (override / supplement)",
    )


class Stage2AcceptRequest(BaseModel):
    """Human accepts the pipeline output — triggers B5 MongoDB persistence."""
    session_id: str


class Stage2RejectRequest(BaseModel):
    """Human rejects the output — returns improvement suggestions, no persist."""
    session_id: str
    rejection_reason: Optional[str] = None


class Stage2EditRequest(BaseModel):
    """
    Human submits corrections.
    user_edits patches individual agent-output fields.
    feedback_text is appended to combined_text before agents re-run.
    """
    session_id:    str
    user_edits:    Optional[Dict[str, Any]] = Field(default_factory=dict)
    feedback_text: Optional[str] = Field(
        None,
        description="Free-text feedback appended to the transcript for the re-run",
    )


# ── API response schema ───────────────────────────────────────────────────

class Stage2Response(BaseModel):
    session_id: str
    status: str = Field(
        ...,
        description="awaiting_review | accepted | rejected | failed",
    )
    data:    Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    improvement_suggestions: Optional[List[str]] = None


# ── DB-layer schemas (used by stage2_repo) ────────────────────────────────

class Stage2ResultBase(BaseModel):
    session_id:        str
    stage1_session_id: Optional[str] = None
    product_recommendations: Dict[str, Any] = Field(default_factory=dict)
    resource_allocation:     Dict[str, Any] = Field(default_factory=dict)
    system_architecture:     Dict[str, Any] = Field(default_factory=dict)
    integration_plan:        Dict[str, Any] = Field(default_factory=dict)
    status: str = Field(default="completed")


class Stage2ResultCreate(Stage2ResultBase):
    pass
