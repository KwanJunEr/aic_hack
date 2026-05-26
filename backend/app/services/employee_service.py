from app.core.seeds.employee_loader import EmployeeSeedLoader
from app.schema.employee_schema import (
    EngineerSchema,
    TeamCostEstimateSchema,
    HeadcountSummarySchema,
)


class EmployeeService:

    # ── Listings ──────────────────────────────────────────────────────────────

    @staticmethod
    def list_all() -> list[EngineerSchema]:
        return [EngineerSchema(**e) for e in EmployeeSeedLoader.get_all_members()]

    @staticmethod
    def list_names() -> list[str]:
        return EmployeeSeedLoader.get_member_names()

    @staticmethod
    def get_by_id(employee_id: str) -> EngineerSchema | None:
        member = EmployeeSeedLoader.get_member_by_id(employee_id)
        return EngineerSchema(**member) if member else None

    # ── Filters ───────────────────────────────────────────────────────────────

    @staticmethod
    def list_available() -> list[EngineerSchema]:
        return [EngineerSchema(**e) for e in EmployeeSeedLoader.get_available_members()]

    @staticmethod
    def filter_by_seniority(seniority: str) -> list[EngineerSchema]:
        return [
            EngineerSchema(**e)
            for e in EmployeeSeedLoader.get_members_by_seniority(seniority)
        ]

    @staticmethod
    def filter_by_module(module: str) -> list[EngineerSchema]:
        return [
            EngineerSchema(**e)
            for e in EmployeeSeedLoader.get_members_by_module(module)
        ]

    @staticmethod
    def filter_by_specialisation(keyword: str) -> list[EngineerSchema]:
        return [
            EngineerSchema(**e)
            for e in EmployeeSeedLoader.get_members_by_specialisation(keyword)
        ]

    # ── Cost estimation ───────────────────────────────────────────────────────

    @staticmethod
    def estimate_cost(employee_ids: list[str], days: int) -> TeamCostEstimateSchema:
        result = EmployeeSeedLoader.estimate_team_cost(employee_ids, days)
        return TeamCostEstimateSchema(**result)

    # ── Summary ───────────────────────────────────────────────────────────────

    @staticmethod
    def get_summary() -> HeadcountSummarySchema:
        return HeadcountSummarySchema(**EmployeeSeedLoader.get_summary())