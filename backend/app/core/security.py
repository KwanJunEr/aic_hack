import bcrypt
import asyncio
from fastapi import HTTPException, Request
from jose import jwt, JWTError

from app.core.config import settings
from app.db.repositories.user_repo import UserRepository
from app.schema.auth_schema import UserResponseSchema



def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token: 
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try: 
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id: 
            raise HTTPException(
                status_code=401, 
                detail="Invalid token"
            )
    
    except JWTError:
        raise HTTPException(
            status_code=401, 
            detail="Invalid token"
        )
    
    repo = UserRepository()
    user = await repo.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return UserResponseSchema(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        phone_number=user.get("phone_number"),
        organization=user.get("organization"),
        position=user.get("position"),
        department=user.get("department"),
        region=user.get("region"),
        territory=user.get("territory"),
        is_active=user.get("is_active", True),
        created_at=user.get("created_at")
    )
