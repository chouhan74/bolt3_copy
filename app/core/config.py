import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Application settings
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./mercer_hr.db"
    
    # Redis settings
    REDIS_URL: str = "redis://red-d2oo9oqdbo4c73brj9pg:6379"
    
    # Admin settings
    ADMIN_EMAIL: str = "admin@mercer.com"
    ADMIN_PASSWORD: str = "admin123"
    
    # Code execution settings
    CODE_EXECUTION_TIMEOUT: int = 10  # seconds
    CODE_EXECUTION_MEMORY_LIMIT: int = 128  # MB
    

    # Java settings
    JAVA_HOME: str = "/usr/lib/jvm/java-17-openjdk-amd64"
    # Google Drive settings (optional)
    GOOGLE_DRIVE_FOLDER_ID: str = ""
    GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON: str = ""
    
    # File upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {'.csv', '.txt'}
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
