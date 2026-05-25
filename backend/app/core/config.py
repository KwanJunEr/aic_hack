from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    mongo_url: str
    db_name: str


    class Config:
       env_file = ".env"

settings = Settings()
    
