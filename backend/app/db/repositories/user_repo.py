from app.db.client import users_collection

class UserRepository:

    async def create_user(self, user_data: dict):
        return await users_collection.insert_one(user_data)

    async def find_by_email(self, email: str):
        return await users_collection.find_one({
            "email": email
        })