"""
Stage 2 MongoDB repository.
Writes/reads the final Stage2PipelineState after HITL acceptance.
"""

from datetime import datetime, timezone
from app.db.client import db

stage2_collection = db["stage2_sessions"]


async def save_stage2_session(state: dict) -> bool:
    """
    Upsert full pipeline state into MongoDB.
    Called only by B5 — never before HITL acceptance.
    """
    now = datetime.now(timezone.utc)
    doc = {k: v for k, v in state.items()}
    doc["status"]     = "completed"
    doc["updated_at"] = now

    result = await stage2_collection.update_one(
        {"session_id": doc.get("session_id", "")},
        {
            "$set":         doc,
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )
    return result.acknowledged


async def get_stage2_session(session_id: str) -> dict | None:
    doc = await stage2_collection.find_one({"session_id": session_id})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc
