from store.product_seed import PRODUCT_SEED

class ProductSeedLoader:
    @staticmethod
    def get_all_products():
        return PRODUCT_SEED
    
    @staticmethod
    def get_product_by_id(product_id:str):
        return next(
            (p for p in PRODUCT_SEED if p["_id"]["$oid"] == product_id),
            None  #Dictionary key chaining
        )