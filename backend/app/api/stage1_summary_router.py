from fastapi import APIRouter, Depends, Query

from app.db.client import db
from app.schema.stage1_summary_schema import Stage1SessionListResponse, Stage1SessionResponse
from app.services.stage1_summary_service import Stage1SessionService

router = APIRouter(
    prefix="/stage1-sessions",
    tags=["Stage1 Sessions"],
)


def get_service() -> Stage1SessionService:
    return Stage1SessionService(db)


@router.get(
    "/",
    response_model=Stage1SessionListResponse,
    summary="List all stage1 sessions",
    description="Returns a paginated list of all documents in the stage1_sessions collection.",
)
async def get_all_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: Stage1SessionService = Depends(get_service),
) -> Stage1SessionListResponse:
    return await service.get_all_sessions(skip=skip, limit=limit)


@router.get(
    "/by-transcript/{transcript_id}",
    response_model=Stage1SessionResponse,
    summary="Get session by transcript_id",
    description="Fetches a single session document by its transcript_id field.",
)
async def get_by_transcript_id(
    transcript_id: str,
    service: Stage1SessionService = Depends(get_service),
) -> Stage1SessionResponse:
    return await service.get_session_by_transcript_id(transcript_id)


@router.get(
    "/latest",
    response_model=Stage1SessionResponse,
    summary="Get the most recently created session",
    description="Returns the latest document in stage1_sessions sorted by creation time.",
)
async def get_latest(
    service: Stage1SessionService = Depends(get_service),
) -> Stage1SessionResponse:
    return await service.get_latest_session()


@router.get(
    "/{doc_id}",
    response_model=Stage1SessionResponse,
    summary="Get session by MongoDB _id",
    description="Fetches a single document by its MongoDB ObjectId.",
)
async def get_by_id(
    doc_id: str,
    service: Stage1SessionService = Depends(get_service),
) -> Stage1SessionResponse:
    return await service.get_session_by_id(doc_id)
