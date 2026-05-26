from store.employee_seed import EMPLOYEE_SEED

class EmployeeSeedLoader: 
    @staticmethod
    def get_all_members() -> list[dict]:
        """Return the full list of engineering members."""
        return EMPLOYEE_SEED["departments"]["engineering"]["members"]
 
    @staticmethod
    def get_member_names() -> list[str]:
        """Return just the names of all engineering members."""
        return [e["name"] for e in EmployeeSeedLoader.get_all_members()]
 
    @staticmethod
    def get_member_by_id(employee_id: str) -> dict | None:
        """Return a single member by ID, or None if not found."""
        return next(
            (e for e in EmployeeSeedLoader.get_all_members() if e["id"] == employee_id),
            None,
        )
 
    # ── Filters ───────────────────────────────────────────────────────────────
 
    @staticmethod
    def get_available_members() -> list[dict]:
        """Return only members whose status is 'available'."""
        return [
            e for e in EmployeeSeedLoader.get_all_members()
            if e["status"] == "available"
        ]
 
    @staticmethod
    def get_members_by_seniority(seniority: str) -> list[dict]:
        """Filter members by seniority level: 'junior', 'mid', or 'senior'."""
        return [
            e for e in EmployeeSeedLoader.get_all_members()
            if e["seniority"] == seniority.lower()
        ]
 
    @staticmethod
    def get_members_by_module(module: str) -> list[dict]:
        """Find members who can work on a given WMS module (case-insensitive partial match)."""
        module_lower = module.lower()
        return [
            e for e in EmployeeSeedLoader.get_all_members()
            if any(module_lower in m.lower() for m in e["wms_modules"])
        ]
 
    @staticmethod
    def get_members_by_specialisation(keyword: str) -> list[dict]:
        """Find members whose specialisation contains the keyword (case-insensitive)."""
        keyword_lower = keyword.lower()
        return [
            e for e in EmployeeSeedLoader.get_all_members()
            if any(keyword_lower in s.lower() for s in e["specialisation"])
        ]
 
    # ── Cost estimation ───────────────────────────────────────────────────────
 
    @staticmethod
    def estimate_team_cost(employee_ids: list[str], days: int) -> dict:
        """
        Given a list of employee IDs and a project duration in days,
        return total and per-member cost breakdown.
        """
        members_map = {e["id"]: e for e in EmployeeSeedLoader.get_all_members()}
        breakdown = []
        total = 0
 
        for eid in employee_ids:
            if eid not in members_map:
                continue
            eng = members_map[eid]
            cost = eng["daily_rate_myr"] * days
            total += cost
            breakdown.append({
                "id": eid,
                "name": eng["name"],
                "role": eng["role"],
                "daily_rate_myr": eng["daily_rate_myr"],
                "days": days,
                "total_cost_myr": cost,
            })
 
        return {
            "project_duration_days": days,
            "engineers_assigned": len(breakdown),
            "total_labour_cost_myr": total,
            "breakdown": breakdown,
        }
 
    # ── Summary ───────────────────────────────────────────────────────────────
 
    @staticmethod
    def get_summary() -> dict:
        """Return the top-level headcount summary."""
        return EMPLOYEE_SEED["summary"]