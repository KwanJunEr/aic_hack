from app.mcp.mcp_server import mcp
from app.services.upload_session_service import (
    fetch_latest_session,
    fetch_session,
    fetch_sessions,
    remove_session,
    search_sessions_by_text,
)
 
 
@mcp.tool()
async def list_sessions(user_id: str, limit: int = 20, skip: int = 0) -> list[dict]:
    """List all upload sessions for a user (summary view, no combined_text)."""
    summaries = await fetch_sessions(user_id, limit=limit, skip=skip)
    return [s.model_dump() for s in summaries]
 
 
@mcp.tool()
async def get_session(session_id: str, user_id: str) -> dict | None:
    """Get full session detail including combined_text and per-file results."""
    session = await fetch_session(session_id, user_id)
    return session.model_dump() if session else None
 
 
@mcp.tool()
async def delete_session(session_id: str, user_id: str) -> dict:
    """Delete an upload session. Returns success/failure status."""
    deleted = await remove_session(session_id, user_id)
    return {"deleted": deleted, "session_id": session_id}
 
 
@mcp.tool()
async def search_sessions(user_id: str, query: str) -> list[dict]:
    """Full-text search across combined_text of all sessions for a user."""
    return await search_sessions_by_text(user_id, query)


@mcp.tool()
async def get_session_text(session_id: str, user_id: str) -> dict | None:
    """Get only the combined_text from a specific upload session by ID."""
    session = await fetch_session(session_id, user_id)
    if not session:
        return None
    return {
        "session_id": session.session_id,
        "session_name": session.session_name,
        "combined_text": session.combined_text,
        "created_at": session.created_at.isoformat(),
    }


@mcp.tool()
async def get_latest_session_text(user_id: str) -> dict | None:
    """Get the combined_text from the user's most recently created upload session."""
    session = await fetch_latest_session(user_id)
    if not session:
        return None
    return {
        "session_id": session.session_id,
        "session_name": session.session_name,
        "combined_text": session.combined_text,
        "created_at": session.created_at.isoformat(),
    }
 