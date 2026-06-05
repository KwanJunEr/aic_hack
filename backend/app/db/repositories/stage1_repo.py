"""
Stage 1 session persistence repository.
Writes/reads the final PipelineState to/from MongoDB after HITL confirmation.
"""

from datetime import datetime, timezone
from app.db.client import db

stage1_collection = db["stage1_sessions"]


async def save_stage1_session(state: dict) -> bool:
    """
    Upsert the full pipeline state into MongoDB.
    Called only by A7 — never before HITL acceptance.
    Saves the complete state so no agent output is lost.
    """
    now = datetime.now(timezone.utc)

    # Persist every field in the pipeline state — nothing cherry-picked
    doc = {k: v for k, v in state.items()}
    doc["status"] = "completed"
    doc["updated_at"] = now

    result = await stage1_collection.update_one(
        {"session_id": doc.get("session_id", "")},
        {
            "$set":         doc,
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )
    return result.acknowledged


async def get_stage1_session(session_id: str) -> dict | None:
    doc = await stage1_collection.find_one({"session_id": session_id})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc
