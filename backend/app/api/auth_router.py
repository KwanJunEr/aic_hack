from fastapi import APIRouter, HTTPException, Response
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
    payload: UserLoginSchema,
    response: Response
):
    try:
        token = await service.login(payload.dict())

        response.set_cookie(
            key="access_token",
            value=token, 
            httponly=True, 
            secure=False, 
            samesite="lax",
            max_age=60 * 60 * 24  # 1 day
        )

        return {"message": "Login Successful!"}
    
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=str(e)
        )

@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True, 
        samesite="lax"
    )

    return {"message": "Logged out successfully"}