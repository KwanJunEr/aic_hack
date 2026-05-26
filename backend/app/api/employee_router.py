from fastapi import APIRouter, HTTPException, Query
from app.services.employee_service import EmployeeService
from app.schema.employee_schema import (
    EngineerSchema,
    TeamCostEstimateSchema,
    HeadcountSummarySchema,
)


router = APIRouter(prefix="/employees", tags=["Employees"])


# ── Summary ───────────────────────────────────────────────────────────────────

@router.get("/summary", response_model=HeadcountSummarySchema)
def get_headcount_summary():
    """Return the top-level headcount summary."""
    return EmployeeService.get_summary()


# ── Listings ──────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[EngineerSchema])
def list_all_engineers():
    """Return all engineering team members."""
    return EmployeeService.list_all()


@router.get("/names", response_model=list[str])
def list_engineer_names():
    """Return just the names of all engineering members."""
    return EmployeeService.list_names()


@router.get("/available", response_model=list[EngineerSchema])
def list_available_engineers():
    """Return only engineers whose status is 'available'."""
    return EmployeeService.list_available()


# ── Filters ───────────────────────────────────────────────────────────────────

@router.get("/filter/seniority", response_model=list[EngineerSchema])
def filter_by_seniority(
    level: str = Query(..., description="junior | mid | senior")
):
    """Filter engineers by seniority level."""
    results = EmployeeService.filter_by_seniority(level)
    if not results:
        raise HTTPException(status_code=404, detail=f"No engineers found with seniority '{level}'")
    return results


@router.get("/filter/module", response_model=list[EngineerSchema])
def filter_by_wms_module(
    module: str = Query(..., description="WMS module keyword, e.g. 'ERP connector', 'picking'")
):
    """Find engineers who can work on a given WMS module."""
    results = EmployeeService.filter_by_module(module)
    if not results:
        raise HTTPException(status_code=404, detail=f"No engineers found for module '{module}'")
    return results


@router.get("/filter/specialisation", response_model=list[EngineerSchema])
def filter_by_specialisation(
    keyword: str = Query(..., description="Specialisation keyword, e.g. 'RF scanner', 'data migration'")
):
    """Find engineers whose specialisation matches the keyword."""
    results = EmployeeService.filter_by_specialisation(keyword)
    if not results:
        raise HTTPException(status_code=404, detail=f"No engineers found for specialisation '{keyword}'")
    return results


# ── Cost estimation ───────────────────────────────────────────────────────────

@router.post("/estimate-cost", response_model=TeamCostEstimateSchema)
def estimate_team_cost(
    employee_ids: list[str],
    days: int = Query(..., gt=0, description="Project duration in working days")
):
    """
    Given a list of employee IDs and a number of days,
    return a full labour cost breakdown for the team.
    """
    return EmployeeService.estimate_cost(employee_ids, days)


# ── Single member ─────────────────────────────────────────────────────────────

@router.get("/{employee_id}", response_model=EngineerSchema)
def get_engineer_by_id(employee_id: str):
    """Return a single engineer by their ID (e.g. ENG-001)."""
    member = EmployeeService.get_by_id(employee_id)
    if not member:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found")
    return member