from app.core.seeds.product_loader import ProductSeedLoader

class ProductService:
    @staticmethod
    def get_all_products():
        return ProductSeedLoader.get_all_products()

    @staticmethod
    def get_product_by_id(product_id: str):
        return ProductSeedLoader.get_product_by_id(product_id)