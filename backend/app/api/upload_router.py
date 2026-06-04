import logging
from typing import List, Optional
 
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
 
from app.core.security import get_current_user
from app.models.user_model import UserModel
from app.schema.upload_schema import (
    AudioTranscribeResponse,
    FileSessionCreate,
    FileSessionResponse,
    FileSessionSummary,
)
from app.services.extraction_service import transcribe_batch
from app.services.upload_session_service import (
   fetch_session,
    fetch_sessions,
    remove_session,
    save_session,
)
 
logger = logging.getLogger(__name__)
 
router = APIRouter(prefix="/upload", tags=["Upload & Extraction"])
 
 
# ---------------------------------------------------------------------------
# POST /upload/transcribe  — audio only, handled by Whisper on the server
# ---------------------------------------------------------------------------
 
@router.post(
    "/transcribe",
    response_model=AudioTranscribeResponse,
    summary="Transcribe audio files to text",
    description=(
        "Upload 1–10 audio files (mp3, wav, ogg, flac, m4a, mp4). "
        "Each file is transcribed concurrently via Whisper. "
        "PDF / DOCX / TXT extraction is handled entirely client-side."
    ),
)
async def transcribe_audio(
    files: List[UploadFile] = File(..., description="1–10 audio files"),
):
    try:
        return await transcribe_batch(files)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
 
 
# ---------------------------------------------------------------------------
# POST /upload/sessions  — save a completed extraction session to MongoDB
# ---------------------------------------------------------------------------
 
@router.post(
    "/sessions",
    response_model=FileSessionResponse,
    status_code=201,
    summary="Save an extraction session",
    description=(
        "Called by the frontend after all files have been processed "
        "(local PDF/DOCX/TXT extraction + backend audio transcription). "
        "Persists the full merged results to MongoDB for later retrieval."
    ),
)
async def save_extraction_session(
    payload: FileSessionCreate,
    current_user: UserModel = Depends(get_current_user),
):
    return await save_session(user_id=str(current_user.id), payload=payload)
 
 
# ---------------------------------------------------------------------------
# GET /upload/sessions  — list sessions for the logged-in user
# ---------------------------------------------------------------------------
 
@router.get(
    "/sessions",
    response_model=List[FileSessionSummary],
    summary="List extraction sessions",
)
async def list_extraction_sessions(
    limit: int = Query(default=20, ge=1, le=100),
    skip: int = Query(default=0, ge=0),
    current_user: UserModel = Depends(get_current_user),
):
    return await fetch_sessions(
        user_id=str(current_user.id), limit=limit, skip=skip
    )
 
 
# ---------------------------------------------------------------------------
# GET /upload/sessions/{session_id}  — full session detail
# ---------------------------------------------------------------------------
 
@router.get(
    "/sessions/{session_id}",
    response_model=FileSessionResponse,
    summary="Get one extraction session",
)
async def get_extraction_session(
    session_id: str,
    current_user: UserModel = Depends(get_current_user),
):
    session = await fetch_session(session_id, str(current_user.id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session
 
 
# ---------------------------------------------------------------------------
# DELETE /upload/sessions/{session_id}
# ---------------------------------------------------------------------------
 
@router.delete(
    "/sessions/{session_id}",
    status_code=204,
    summary="Delete an extraction session",
)
async def delete_extraction_session(
    session_id: str,
    current_user: UserModel = Depends(get_current_user),
):
    deleted = await remove_session(session_id, str(current_user.id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found.")