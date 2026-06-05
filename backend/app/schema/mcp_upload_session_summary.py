from datetime import datetime
from typing import Any
 
from pydantic import BaseModel, Field
 
 
class FileResult(BaseModel):
    filename: str
    status: str          # "success" | "failed"
    error: str | None = None
    extracted_text: str | None = None
 
 
class UploadSessionSummary(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    session_name: str
    total_files: int = 0
    successful: int = 0
    failed: int = 0
    created_at: datetime | None = None
    updated_at: datetime | None = None
 
    model_config = {"populate_by_name": True}
 
 
class UploadSession(UploadSessionSummary):
    combined_text: str | None = None
    results: list[FileResult] = []
 