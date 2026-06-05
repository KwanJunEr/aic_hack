from __future__ import annotations

from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase

COLLECTION_NAME = "stage1_sessions"


class Stage1SessionRepository:
    """Handles all direct MongoDB operations for the stage1_sessions collection."""

    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self._col: AsyncIOMotorCollection = db[COLLECTION_NAME]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _build_id_filter(doc_id: str) -> dict[str, Any]:
        if not ObjectId.is_valid(doc_id):
            raise ValueError(f"'{doc_id}' is not a valid ObjectId")
        return {"_id": ObjectId(doc_id)}

    # ------------------------------------------------------------------
    # Read operations
    # ------------------------------------------------------------------

    async def find_all(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        """Return a paginated list of all documents."""
        cursor = self._col.find({}).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def count_all(self) -> int:
        return await self._col.count_documents({})

    async def find_by_id(self, doc_id: str) -> dict[str, Any] | None:
        """Fetch a single document by its MongoDB _id."""
        return await self._col.find_one(self._build_id_filter(doc_id))

    async def find_by_session_id(self, session_id: str) -> dict[str, Any] | None:
        """Fetch a document by its UUID session_id field."""
        return await self._col.find_one({"session_id": session_id})

    async def find_by_user_id(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        """Return all sessions that belong to a specific user."""
        cursor = self._col.find({"user_id": user_id}).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def count_by_user_id(self, user_id: str) -> int:
        return await self._col.count_documents({"user_id": user_id})

    async def find_by_transcript_id(self, transcript_id: str) -> dict[str, Any] | None:
        """Fetch a document by its transcript_id string field."""
        return await self._col.find_one({"transcript_id": transcript_id})

    async def find_latest(self) -> dict[str, Any] | None:
        """Fetch the most recently created document, sorted by _id descending."""
        cursor = self._col.find({}).sort("_id", -1).limit(1)
        docs = await cursor.to_list(length=1)
        return docs[0] if docs else None