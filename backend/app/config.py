from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmogShield AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Gemini API key (optional - fallback to deterministic rule engine if unset)
    GEMINI_API_KEY: Optional[str] = None
    
    # Google Air Quality API key (optional - simulated high-res feed if unset)
    GOOGLE_AQI_API_KEY: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    
    # Cache settings
    CACHE_TTL_MINUTES: int = 15

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
