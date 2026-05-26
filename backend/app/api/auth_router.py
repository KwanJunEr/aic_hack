from fastapi import APIRouter, HTTPException, Response, Depends
from app.schema.auth_schema import (
    UserRegisterSchema, 
    UserLoginSchema,
    UserResponseSchema
)
from app.services.auth_service import AuthService
from app.core.security import get_current_user

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
        samesite="none",
    )

    return {"message": "Logged out successfully"}

@router.get(
    "/me", 
    response_model=UserResponseSchema
)
async def get_me(
    current_user: UserResponseSchema = Depends(get_current_user)
):
    return current_user