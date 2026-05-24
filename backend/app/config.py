import os

class Settings:
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
    # Simple in-memory storage for jobs since we don't have a DB
    
settings = Settings()
