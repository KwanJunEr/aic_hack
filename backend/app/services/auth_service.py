from app.db.repositories.user_repo import UserRepository
from app.core.security import(
    hash_password, 
    verify_password
)
from app.core.auth import create_access_token

class AuthService:

    def __init__(self):
        self.repo = UserRepository()
    
    async def register(self, data:dict):
        existing_user = await self.repo.find_by_email(
            data["email"]
        )
        if existing_user:
            raise Exception("Email already registered")
        
        data["password"] = hash_password(
            data["password"]
        )

        await self.repo.create_user(data)

        return{
            "message": "User registered successfully"
        }
    
    async def login(self, data:dict):
        user = await self.repo.find_by_email(
            data["email"]
        )
        if not user:
            raise Exception("Invalid credentials")
        
        valid_password = verify_password(
            data["password"],
            user["password"]
        )

        if not valid_password:
            raise Exception("Invalid credentials")
        
        token = create_access_token({
            "user_id": str(user["_id"]),
            "email": user["email"]
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }

