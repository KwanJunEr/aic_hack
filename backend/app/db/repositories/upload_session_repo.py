from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
 
from app.db.client import db

COLLECTION = "upload_sessions"
 
 
def _col():
    return db[COLLECTION]



# ---------------------------------------------------------------------------
# Write
# ---------------------------------------------------------------------------
 
async def create_session(
    user_id: str,
    session_name: str,
    results: list,          # list of FileExtractionResult dicts
    combined_text: Optional[str],
) -> dict:
    """Insert a new session document and return it with its generated _id."""
    now = datetime.now(timezone.utc)
 
    successful = sum(1 for r in results if r.get("success"))
    doc = {
        "user_id":       user_id,
        "session_name":  session_name,
        "total_files":   len(results),
        "successful":    successful,
        "failed":        len(results) - successful,
        "results":       results,
        "combined_text": combined_text,
        "created_at":    now,
        "updated_at":    now,
    }
 
    insert_result = await _col().insert_one(doc)
    doc["_id"] = insert_result.inserted_id
    return doc
 
 
# ---------------------------------------------------------------------------
# Read
# ---------------------------------------------------------------------------
 
async def get_session(session_id: str, user_id: str) -> Optional[dict]:
    """Fetch one session — scoped to the requesting user."""
    return await _col().find_one({
        "_id":     ObjectId(session_id),
        "user_id": user_id,
    })
 
 
async def list_sessions(user_id: str, limit: int = 20, skip: int = 0) -> List[dict]:
    """Return lightweight session summaries for a user, newest first."""
    cursor = (
        _col()
        .find(
            {"user_id": user_id},
            # Projection — exclude the heavy fields for list view
            {"results": 0, "combined_text": 0},
        )
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    return await cursor.to_list(length=limit)
 
 
# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------
 
async def delete_session(session_id: str, user_id: str) -> bool:
    """Delete a session. Returns True if a document was actually deleted."""
    result = await _col().delete_one({
        "_id":     ObjectId(session_id),
        "user_id": user_id,
    })
    return result.deleted_count == 1