from datetime import datetime
from typing import Optional, Dict, Any, List

from pydantic import BaseModel, Field


# ── API request / response schemas ───────────────────────────────────────


class Stage1RunRequest(BaseModel):
    transcript_id: Optional[str] = Field(
        None,
        description="Upload session ID — A1 fetches combined_text via MCP (preferred)",
    )
    transcript: Optional[str] = Field(
        None,
        description="Raw transcript text (fallback for testing / direct input)",
    )
    session_id: Optional[str] = Field(
        None,
        description="Reuse an existing session ID; generated automatically if omitted",
    )
    user_id: str = Field(
        ...,
        description="Required for MCP upload-session fetch",
    )

    def validate_input(self) -> None:
        if not self.transcript_id and not self.transcript:
            raise ValueError("Provide either transcript_id or transcript text.")


class HITLConfirmRequest(BaseModel):
    """Generic HITL decision endpoint (legacy / convenience)."""
    session_id: str
    decision: str = Field(..., description="accepted | edited | rejected")
    user_edits: Optional[Dict[str, Any]] = None
    rejection_reason: Optional[str] = None


class Stage1ConfirmRequest(BaseModel):
    """Explicit confirm — accepts current output and triggers A7 persistence."""
    session_id: str


class Stage1EditRequest(BaseModel):
    """
    Submit corrections and re-trigger the full pipeline.
    user_edits can patch individual agent-output fields.
    additional_text is appended to the transcript so all agents re-process it.
    """
    session_id: str
    user_edits: Optional[Dict[str, Any]] = Field(default_factory=dict)
    additional_text: Optional[str] = Field(
        None,
        description="Extra context appended to the transcript before re-running agents",
    )


class Stage1RejectRequest(BaseModel):
    """Reject current output, log reason, and re-trigger the full pipeline."""
    session_id: str
    rejection_reason: Optional[str] = None


class Stage1Response(BaseModel):
    session_id: str
    status: str = Field(
        ...,
        description="awaiting_review | ready_for_stage2 | failed",
    )
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    obstruction_detected: bool = False
    obstruction_reason: Optional[str] = None


# ── Transcript helper schemas ─────────────────────────────────────────────


class TranscriptCreateRequest(BaseModel):
    title: str
    content: str
    client_name: str
    metadata: Optional[Dict[str, Any]] = None


class TranscriptListResponse(BaseModel):
    transcripts: List[Dict[str, Any]]
    total: int


# ── DB-layer schemas (used by stage1_repo) ────────────────────────────────


class Stage1ResultBase(BaseModel):
    session_id: str = Field(..., description="Groups all Stage 1 agent outputs")
    transcript_content: str = Field(..., description="Raw transcript sent to agents")
    result: Dict[str, Any] = Field(default_factory=dict)
    status: str = Field(default="completed", description="pending | completed | failed")
    execution_time: Optional[float] = None


class Stage1ResultCreate(Stage1ResultBase):
    pass


class Stage1ResultUpdate(BaseModel):
    result: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    execution_time: Optional[float] = None


class Stage1ResultResponse(Stage1ResultBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
