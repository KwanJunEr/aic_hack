from app.core.seeds.sales_loader import SalesSeedLoader

def get_all_cases():
   return SalesSeedLoader.get_all_cases()


def get_case_by_id(case_id: str):
    return SalesSeedLoader.get_case_by_id(case_id)


def get_case_by_code(case_code: str):
    return SalesSeedLoader.get_case_by_code(case_code)