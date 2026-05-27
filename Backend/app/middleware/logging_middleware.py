"""
logging_middleware.py - Request/Response Logging
Logs method, path, status code, and processing time for every request.
"""

import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("konark.requests")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Starlette middleware that logs each incoming request.
    Skips health-check and docs paths to keep logs clean.
    """

    async def dispatch(self, request: Request, call_next):
        """
        Called for every HTTP request.
        Measures processing time and logs the result after the response is sent.
        """
        # Skip logging for docs and health endpoints to reduce noise
        skip_paths = {"/", "/api/health", "/docs", "/redoc", "/openapi.json"}
        if request.url.path in skip_paths:
            return await call_next(request)

        start_time = time.time()
        response = await call_next(request)
        process_time = round((time.time() - start_time) * 1000, 2)

        logger.info(
            f"{request.method} {request.url.path} "
            f"→ {response.status_code} [{process_time}ms]"
        )
        return response
