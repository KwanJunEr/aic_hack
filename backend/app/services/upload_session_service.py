from datetime import timezone
from typing import List, Optional
 
from app.db.repositories.upload_session_repo import (
    create_session,
    delete_session,
    get_session,
    get_latest_session,
    list_sessions,
    search_by_text,
)
from app.schema.upload_schema import (
    FileSessionCreate,
    FileSessionResponse,
    FileSessionSummary,
)
 
 
def _doc_to_response(doc: dict) -> FileSessionResponse:
    return FileSessionResponse(
        session_id=str(doc["_id"]),
        user_id=doc["user_id"],
        session_name=doc["session_name"],
        total_files=doc["total_files"],
        successful=doc["successful"],
        failed=doc["failed"],
        results=doc.get("results", []),
        combined_text=doc.get("combined_text"),
        created_at=doc["created_at"].replace(tzinfo=timezone.utc),
    )
 
 
def _doc_to_summary(doc: dict) -> FileSessionSummary:
    return FileSessionSummary(
        session_id=str(doc["_id"]),
        session_name=doc["session_name"],
        total_files=doc["total_files"],
        successful=doc["successful"],
        created_at=doc["created_at"].replace(tzinfo=timezone.utc),
    )
 
 
def _auto_name(results: list) -> str:
    """Generate a session name from the first filename if none supplied."""
    if results:
        first = results[0].filename if hasattr(results[0], "filename") else results[0].get("filename", "file")
        base = first.rsplit(".", 1)[0]
        suffix = f" + {len(results) - 1} more" if len(results) > 1 else ""
        return f"{base}{suffix}"
    return "Untitled session"
 
 
async def save_session(
    user_id: str,
    payload: FileSessionCreate,
) -> FileSessionResponse:
    """Persist a completed extraction session for the given user."""
    session_name = payload.session_name or _auto_name(payload.results)
 
    # Dump Pydantic models to plain dicts for MongoDB
    results_dicts = [r.model_dump() for r in payload.results]
 
    # Build optional combined_text if not provided by client
    combined = payload.combined_text
    if combined is None and results_dicts:
        parts = [
            f"[{r['filename']}]\n{r['extracted_text']}"
            for r in results_dicts
            if r.get("success") and r.get("extracted_text")
        ]
        combined = "\n\n---\n\n".join(parts) if parts else None
 
    doc = await create_session(
        user_id=user_id,
        session_name=session_name,
        results=results_dicts,
        combined_text=combined,
    )
    return _doc_to_response(doc)
 
 
async def fetch_session(session_id: str, user_id: str) -> Optional[FileSessionResponse]:
    doc = await get_session(session_id, user_id)
    return _doc_to_response(doc) if doc else None
 
 
async def fetch_sessions(
    user_id: str, limit: int = 20, skip: int = 0
) -> List[FileSessionSummary]:
    docs = await list_sessions(user_id, limit=limit, skip=skip)
    return [_doc_to_summary(d) for d in docs]
 
 
async def remove_session(session_id: str, user_id: str) -> bool:
    return await delete_session(session_id, user_id)


# ── Phase 4 — search (new) ────────────────────────────────────────────────────
 
async def fetch_latest_session(user_id: str) -> Optional[FileSessionResponse]:
    """Return the most recently created session for a user, including combined_text."""
    doc = await get_latest_session(user_id)
    return _doc_to_response(doc) if doc else None


async def search_sessions_by_text(user_id: str, query: str) -> list[dict]:
    """Search sessions whose combined_text matches the query string."""
    docs = await search_by_text(user_id, query)
    return [_doc_to_response(d).model_dump() for d in docs]