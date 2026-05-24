from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserModel(BaseModel):
    email: EmailStr
    password: str
    phone_number: str
    full_name: str
    is_active: bool = True
    organization: str
    position: str
    department: Optional[str] = "Sales"
    employee_id: Optional[str] = None

    region: Optional[str] = None         # e.g. "APAC", "Malaysia"
    territory: Optional[str] = None

       # ------------------------
    # Performance tracking
    # ------------------------
    total_sales: float = 0.0
    total_deals_closed: int = 0
    rating: Optional[float] = None  

    created_at: datetime = datetime.utcnow()
    updated_at: Optional[datetime] = None