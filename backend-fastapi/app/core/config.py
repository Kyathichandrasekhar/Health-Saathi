"""Core configuration"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "Health Saathi AI"
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    FIREBASE_SERVICE_ACCOUNT_PATH: str = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "")
    NODE_BACKEND_URL: str = os.getenv("NODE_BACKEND_URL", "http://localhost:8000")


settings = Settings()
