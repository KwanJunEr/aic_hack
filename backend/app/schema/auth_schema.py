from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    phone_number: str

    organization: str
    position: str

    department: Optional[str] = "Sales"
    region: Optional[str] = None
    territory: Optional[str] = None


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponseSchema(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone_number: str

    organization: str
    position: str
    department: Optional[str]
    region: Optional[str]
    territory: Optional[str]

    is_active: bool
    created_at: str