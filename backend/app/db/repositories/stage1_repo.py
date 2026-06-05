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
    """
    now = datetime.now(timezone.utc)

    doc = {
        "session_id":            state.get("session_id", ""),
        "user_id":               state.get("user_id", ""),
        "transcript_id":         state.get("transcript_id", ""),
        "transcript":            state.get("transcript", ""),
        "requirements":          state.get("requirements", {}),
        "gaps":                  state.get("gaps", {}),
        "budget_validation":     state.get("budget_validation", {}),
        "past_deals":            state.get("past_deals", {}),
        "sentiment":             state.get("sentiment", {}),
        "objections":            state.get("objections", {}),
        "missing_info":          state.get("missing_info", {}),
        "cot_traces":            state.get("cot_traces", []),
        "a2a_messages":          state.get("a2a_messages", []),
        "hitl_stage1_decision":  state.get("hitl_stage1_decision", ""),
        "status":                "completed",
        "updated_at":            now,
    }

    result = await stage1_collection.update_one(
        {"session_id": doc["session_id"]},
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
