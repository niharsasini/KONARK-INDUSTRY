"""
security.py - Authentication and Security Utilities
Handles password hashing with bcrypt and JWT token operations with Jose.
"""

from datetime import datetime, timedelta
from typing import Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.config import get_settings

# bcrypt hashing context — bcrypt automatically generates and stores the salt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain-text password with bcrypt.
    The result includes the salt and is safe to store in the database.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check whether a plain-text password matches a stored bcrypt hash.
    Returns True if correct, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any]) -> str:
    """
    Create a short-lived JWT used to authenticate API requests.
    Expires after ACCESS_TOKEN_EXPIRE_MINUTES (default 60 minutes).
    """
    settings = get_settings()
    to_encode = data.copy()

    # Embed expiry timestamp in the token payload
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire, "type": "access"})

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Create a long-lived JWT used to obtain new access tokens without re-login.
    Expires after REFRESH_TOKEN_EXPIRE_DAYS (default 30 days).
    """
    settings = get_settings()
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        days=settings.refresh_token_expire_days
    )
    to_encode.update({"exp": expire, "type": "refresh"})

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and cryptographically verify a JWT.
    Raises HTTP 401 if the token is malformed, expired, or has a bad signature.
    Returns the decoded payload dict on success.
    """
    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or has expired. Please login again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
