from pydantic import BaseModel


class EngineerSchema(BaseModel):
    id: str
    name: str
    role: str
    seniority: str
    status: str
    specialisation: list[str]
    wms_modules: list[str]
    daily_rate_myr: int
    certifications: list[str]


class CostBreakdownItemSchema(BaseModel):
    id: str
    name: str
    role: str
    daily_rate_myr: int
    days: int
    total_cost_myr: int


class TeamCostEstimateSchema(BaseModel):
    project_duration_days: int
    engineers_assigned: int
    total_labour_cost_myr: int
    breakdown: list[CostBreakdownItemSchema]


class HeadcountSummarySchema(BaseModel):
    total_employees: int
    available: int
    occupied: int
    on_leave: int
    unavailable: int