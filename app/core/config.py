from pydantic import  Extra
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "xclinic-server-backend"
    admin_email: str = "admin@example.com"
    items_per_user: int = 50
    JWT_SECRET: str
    JWT_EXPIRATION: int
    JWT_REFRESH_SECRET: str
    JWT_REFRESH_EXPIRATION: int
    DATABASE_URL: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    class Config:
        env_file = "./config/.env"
        extra = Extra.ignore

settings = Settings()

