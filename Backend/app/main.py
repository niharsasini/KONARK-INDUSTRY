"""
main.py - FastAPI Application Entry Point
Configures the app, mounts middleware, includes all routers,
and defines startup/shutdown lifecycle via lifespan.
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.database import connect_to_mongo, close_mongo_connection
from app.api.v1.router import api_router
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.cors_middleware import get_allowed_origins

# Configure root logger — outputs to stdout for Docker / cloud log collectors
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("konark")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager.
    Code before `yield` runs on startup; code after runs on shutdown.
    Replaces the deprecated @app.on_event("startup") pattern.
    """
    # Startup: open MongoDB connection and initialise Beanie ODM
    logger.info("Starting Konark Industry API...")
    await connect_to_mongo()
    logger.info("Startup complete. API is ready.")

    yield  # Application runs here

    # Shutdown: close the MongoDB connection cleanly
    logger.info("Shutting down Konark Industry API...")
    await close_mongo_connection()
    logger.info("Shutdown complete.")


def create_application() -> FastAPI:
    """
    Factory function that builds and configures the FastAPI application.
    Separated from module-level code so it can be imported in tests cleanly.
    """
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Production API for Konark Industry — "
            "EV vehicles, home appliances, industrial equipment, "
            "service bookings, and order management."
        ),
        docs_url="/api/docs",          # Swagger UI
        redoc_url="/api/redoc",        # ReDoc UI
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # CORS — allow frontend and admin panel origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request/response logging — runs after CORS
    app.add_middleware(LoggingMiddleware)

    # All versioned API routes under /api/v1
    app.include_router(api_router)

    # Serve uploaded files (battery photos, etc.) under /uploads
    uploads_dir = os.getenv("UPLOADS_DIR", "/var/www/konark/uploads")
    if os.path.isdir(uploads_dir):
        app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

    # ---------- Root endpoints ----------

    @app.get("/", tags=["Root"])
    async def root():
        """
        API welcome endpoint.
        Returns API name, version, and links to documentation.
        """
        return {
            "api": settings.app_name,
            "version": settings.app_version,
            "docs": "/api/docs",
            "redoc": "/api/redoc",
            "health": "/api/health",
        }

    @app.get("/api/health", tags=["Root"])
    async def health():
        """
        Health check endpoint used by load balancers and uptime monitors.
        Returns status "ok" and the current MongoDB connection state.
        """
        from app.database import client
        db_connected = False
        try:
            # Ping MongoDB with a 2-second timeout
            if client:
                await client.admin.command("ping")
                db_connected = True
        except Exception:
            db_connected = False

        return {
            "status": "ok",
            "database": "connected" if db_connected else "disconnected",
            "version": settings.app_version,
        }

    # ---------- Global error handlers ----------

    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        """
        Return a JSON 404 instead of FastAPI's default HTML page.
        Makes error responses consistent for frontend API clients.
        """
        return JSONResponse(
            status_code=404,
            content={
                "error": "Not found",
                "path": str(request.url.path),
                "message": "The requested endpoint does not exist",
            },
        )

    @app.exception_handler(500)
    async def server_error_handler(request: Request, exc):
        """
        Catch-all for unhandled server errors.
        Logs the exception and returns a generic error message
        so internal details are never exposed to the client.
        """
        logger.exception(f"Unhandled error on {request.method} {request.url.path}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "message": "Something went wrong. Please try again later.",
            },
        )

    return app


# Module-level app instance — picked up by uvicorn
app = create_application()
