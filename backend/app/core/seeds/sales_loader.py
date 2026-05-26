from store.sales_seed import SALES_SEED


class SalesSeedLoader:

    @staticmethod
    def get_all_cases():
        return SALES_SEED

    @staticmethod
    def get_case_by_id(case_id: str):
        return next(
            (c for c in SALES_SEED if c["id"] == case_id),
            None
        )

    @staticmethod
    def get_case_by_code(case_code: str):
        return next(
            (c for c in SALES_SEED if c["caseCode"] == case_code),
            None
        )