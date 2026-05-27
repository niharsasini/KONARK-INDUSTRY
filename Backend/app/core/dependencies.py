"""
dependencies.py - FastAPI Dependency Injection
Reusable dependencies injected into route handlers via Depends().
These handle authentication verification and role-based authorization.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token
from app.models.user import User, UserRole
from typing import Optional

# Extracts the Bearer token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Same scheme but does not error if the header is absent — for optional auth
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False,
)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Dependency: Resolve the currently authenticated user from the JWT.
    Raises HTTP 401 if the token is missing, invalid, or the user is inactive.
    """
    # Verify the token signature and expiry
    payload = decode_token(token)

    # The "sub" claim holds the MongoDB document ID string
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing subject claim",
        )

    # Fetch the user from MongoDB
    user = await User.get(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or has been deactivated",
        )

    return user


async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency: Ensure the current user holds the ADMIN role.
    Use on every admin-only endpoint.
    Raises HTTP 403 if the user is a regular customer.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: admin privileges required",
        )
    return current_user


async def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme_optional),
) -> Optional[User]:
    """
    Dependency: Return the authenticated user if a valid token is provided,
    or None if the request is unauthenticated.
    Used on endpoints that serve both guests and logged-in users.
    """
    if not token:
        return None
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if user_id:
            user = await User.get(user_id)
            return user if user and user.is_active else None
    except Exception:
        pass
    return None
