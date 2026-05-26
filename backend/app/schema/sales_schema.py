from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class Client(BaseModel):
    name: str
    industry: str
    segment: str
    country: str


class DealValue(BaseModel):
    totalFirstYear: float


class SalesCase(BaseModel):
    id: str
    caseCode: str
    title: str
    client: Dict[str, Any]
    dealSummary: Dict[str, Any]
    outcomes: Dict[str, Any]


class CaseSummary(BaseModel):
    caseId: str
    title: str
    client: str
    industry: str
    segment: str
    dealValue: float
    modules: List[str]
    paybackMonths: Optional[int]


class SummaryStats(BaseModel):
    total_cases: int
    total_deal_value_myr: float
    average_payback_months: float