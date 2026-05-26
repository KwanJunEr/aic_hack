from fastapi import APIRouter, HTTPException

from app.services.sales_service import (
    get_all_cases,
    get_case_by_id
)

router = APIRouter(prefix="/sales", tags=["Sales Intelligence"])


@router.get("/")
def list_cases():
    return get_all_cases()


@router.get("/id/{case_id}")
def case_by_id(case_id: str):
    case = get_case_by_id(case_id)
    if case is None:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return case


