from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
 
 
# ---------------------------------------------------------------------------
# Shared result shape — same structure whether extracted client or server side
# ---------------------------------------------------------------------------
 
class FileExtractionResult(BaseModel):
    filename: str
    file_type: str              # "pdf" | "docx" | "txt" | "audio"
    extracted_text: str
    char_count: int
    success: bool
    error: Optional[str] = None
 
 
# ---------------------------------------------------------------------------
# Backend response — audio transcription only
# ---------------------------------------------------------------------------
 
class AudioTranscribeResponse(BaseModel):
    total_files: int
    successful: int
    failed: int
    results: List[FileExtractionResult]
 
 
# ---------------------------------------------------------------------------
# MongoDB session — what gets persisted
# ---------------------------------------------------------------------------
 
class FileSessionCreate(BaseModel):
    """Sent by frontend to save a completed extraction session."""
    session_name: Optional[str] = None         # e.g. "Q3 Review" or auto-generated
    results: List[FileExtractionResult]         # all files — local + audio merged
    combined_text: Optional[str] = None         # optional merged blob
 
 
class FileSessionResponse(BaseModel):
    """Returned after saving. Includes the generated MongoDB _id."""
    session_id: str
    user_id: str
    session_name: str
    total_files: int
    successful: int
    failed: int
    results: List[FileExtractionResult]
    combined_text: Optional[str] = None
    created_at: datetime
 
 
class FileSessionSummary(BaseModel):
    """Lightweight row used in list views."""
    session_id: str
    session_name: str
    total_files: int
    successful: int
    created_at: datetime
 