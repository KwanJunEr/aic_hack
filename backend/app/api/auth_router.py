from fastapi import APIRouter, HTTPException
from app.schema.auth_schema import (
    UserRegisterSchema, 
    UserLoginSchema
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

service = AuthService()

@router.post("/register")
async def register_user(
    payload: UserRegisterSchema
):
    try:
        return await service.register(
            payload.dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/login")
async def login_user(
    payload: UserLoginSchema
):
    try:
        return await service.login(
            payload.dict()
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=str(e)
        )