"""
cors_middleware.py - CORS Configuration Helper
Returns the list of allowed origins from settings.
Called in main.py when mounting the CORSMiddleware.
"""

from app.config import get_settings


def get_allowed_origins() -> list:
    """
    Build the CORS allowed origins list from environment config.
    Includes the deployed frontend, admin panel, and local dev URL.
    Add additional origins here without touching main.py.
    """
    settings = get_settings()
    origins = [
        settings.frontend_url,
        settings.admin_url,
        settings.local_url,
        # Always allow localhost variants for local development
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
    ]
    # Deduplicate while preserving order
    seen = set()
    return [o for o in origins if not (o in seen or seen.add(o))]
