"""
cors_middleware.py - CORS Configuration Helper
Returns the list of allowed origins from settings.
Called in main.py when mounting the CORSMiddleware.
"""

import os

from app.config import get_settings


def get_allowed_origins() -> list:
    """
    Build the CORS allowed origins list from environment config.
    Includes the deployed frontend, admin panel, production domains,
    and local dev URLs. Extra origins can be added via the
    ALLOWED_ORIGINS env var (comma-separated) without touching main.py.
    """
    settings = get_settings()
    origins = [
        settings.frontend_url,
        settings.admin_url,
        settings.local_url,
        # Production domains
        "https://konarkindustry.com",
        "https://www.konarkindustry.com",
        "https://api.konarkindustry.com",
        "https://admin.konarkindustry.net",
        # Always allow localhost variants for local development
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    # Extra origins from env (comma-separated)
    extra = os.getenv("ALLOWED_ORIGINS", "")
    if extra:
        origins.extend(o.strip() for o in extra.split(",") if o.strip())

    # Deduplicate while preserving order
    seen = set()
    return [o for o in origins if not (o in seen or seen.add(o))]
