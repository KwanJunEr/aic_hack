from fastapi import APIRouter, Query
from typing import Optional

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
    return get_case_by_id(case_id)


