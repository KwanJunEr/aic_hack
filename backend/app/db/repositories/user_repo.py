from app.db.client import users_collection
from bson import ObjectId

class UserRepository:

    async def create_user(self, user_data: dict):
        return await users_collection.insert_one(user_data)

    async def find_by_email(self, email: str):
        return await users_collection.find_one({
            "email": email
        })
    
    async def find_by_id(self, user_id:str):
        return await users_collection.find_one({
            "_id": ObjectId(user_id)
        })