from fastapi import APIRouter

from app.api.auth_router import router as auth_router
from app.api.product_router import router as product_router
from app.api.employee_router import router as employee_router
from app.api.sales_router import router as sales_router
from app.api.upload_router import router as upload_router
from app.api.stage1_router import router as stage1_router


api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(product_router)
api_router.include_router(employee_router)
api_router.include_router(sales_router)
api_router.include_router(upload_router)
api_router.include_router(stage1_router)