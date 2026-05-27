"""
config.py - Application Configuration
Loads all settings from environment variables using pydantic-settings.
Uses lru_cache so settings are loaded only once per process lifetime.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- App ---
    # Application name shown in API docs
    app_name: str = "Konark Industry API"
    app_version: str = "1.0.0"
    debug: bool = False

    # --- Security ---
    # JWT secret key — must be long random string in production
    secret_key: str
    algorithm: str = "HS256"
    # How long access tokens last (minutes)
    access_token_expire_minutes: int = 60
    # How long refresh tokens last (days)
    refresh_token_expire_days: int = 30

    # --- MongoDB ---
    # Connection string for MongoDB
    mongodb_url: str
    # Database name inside MongoDB
    mongodb_db_name: str = "konark_industry"

    # --- Email ---
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    email_from: str
    email_from_name: str = "Konark Industry"

    # --- Company ---
    company_name: str = "Konark Industry"
    company_phone: str = "+919437611129"
    company_email: str = "konarkindustrie@gmail.com"
    company_address: str = "Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002"

    # --- Admin ---
    admin_email: str
    admin_password: str

    # --- CORS ---
    frontend_url: str = "http://localhost:3000"
    admin_url: str = "http://localhost:3001"
    local_url: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "case_sensitive": False}


@lru_cache()
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    lru_cache ensures .env is read only once across all requests.
    """
    return Settings()
