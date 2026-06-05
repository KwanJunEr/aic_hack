from __future__ import annotations
 
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
 
from app.db.repositories.stage1_summary_repo import Stage1SessionRepository
from app.schema.stage1_summary_schema import (
    Stage1SessionListResponse,
    Stage1SessionResponse,
)

 
 
class Stage1SessionService:
    """Orchestrates business logic between the router and the repository."""
 
    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self._repo = Stage1SessionRepository(db)
 
    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
 
    @staticmethod
    def _to_response(doc: dict) -> Stage1SessionResponse:
        """Convert a raw MongoDB document to the response schema."""
        return Stage1SessionResponse.model_validate(doc)
 
    # ------------------------------------------------------------------
    # Public service methods
    # ------------------------------------------------------------------
 
 
    async def get_all_sessions(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> Stage1SessionListResponse:
        docs = await self._repo.find_all(skip=skip, limit=limit)
        total = await self._repo.count_all()
        return Stage1SessionListResponse(
            items=[self._to_response(doc) for doc in docs],
            total=total,
            skip=skip,
            limit=limit,
        )

    async def get_session_by_id(self, doc_id: str) -> Stage1SessionResponse:
        try:
            doc = await self._repo.find_by_id(doc_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"'{doc_id}' is not a valid document ID",
            )
        if doc is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session with id '{doc_id}' not found",
            )
        return self._to_response(doc)
 
    async def get_session_by_transcript_id(self, transcript_id: str) -> Stage1SessionResponse:
        doc = await self._repo.find_by_transcript_id(transcript_id)
        if doc is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session with transcript_id '{transcript_id}' not found",
            )
        return self._to_response(doc)

    async def get_latest_session(self) -> Stage1SessionResponse:
        doc = await self._repo.find_latest()
        if doc is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No sessions found",
            )
        return self._to_response(doc)

    async def get_session_by_session_id(self, session_id: str) -> Stage1SessionResponse:
        doc = await self._repo.find_by_session_id(session_id)
        if doc is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session with session_id '{session_id}' not found",
            )
        return self._to_response(doc)
 
   