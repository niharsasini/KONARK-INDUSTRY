"""
auth.py - Authentication Endpoints
POST /auth/register  — create a new customer account
POST /auth/login     — email + password login, returns JWT pair
POST /auth/refresh   — exchange refresh token for new access token
GET  /auth/me        — return current user's profile
PUT  /auth/me        — update profile (name, phone, city)
POST /auth/logout    — client-side: just discard tokens; placeholder endpoint
"""

import uuid
from fastapi import APIRouter, HTTPException, status, Depends, Request, Body
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
from app.core.limiter import limiter

from app.models.user import User, UserRole
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.dependencies import get_current_user
from app.services.email_service import send_welcome_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------- Request / Response schemas ----------

class RegisterRequest(BaseModel):
    """Fields required to create a new customer account."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    city: Optional[str] = None


class LoginRequest(BaseModel):
    """Credentials used to authenticate."""
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    """Refresh token issued at login."""
    refresh_token: str


class UpdateProfileRequest(BaseModel):
    """Fields the user can update on their profile."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    city: Optional[str] = None


class TokenResponse(BaseModel):
    """Standard token pair returned after login or refresh."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Public user fields returned in API responses — no password hash."""
    id: str
    name: str
    email: str
    phone: str
    city: Optional[str]
    role: str
    is_verified: bool
    created_at: datetime


# ---------- Endpoints ----------

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def register(request: Request, body: RegisterRequest):
    """
    Create a new customer account.
    Checks for duplicate email and phone before saving.
    Hashes the password with bcrypt — plain text is never stored.
    Sends a welcome email (non-blocking; failure does not break registration).
    Returns a JWT token pair so the user is immediately logged in.
    """
    # Check email is not already taken
    if await User.find_one(User.email == body.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Check phone is not already taken
    if await User.find_one(User.phone == body.phone):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this phone number already exists",
        )

    # Create and persist the new user document
    user = User(
        name=body.name,
        email=body.email,
        phone=body.phone,
        password_hash=hash_password(body.password),
        city=body.city,
        role=UserRole.CUSTOMER,
    )
    await user.insert()

    # Generate JWT pair using MongoDB document ID as the subject claim
    token_data = {"sub": str(user.id)}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Fire-and-forget welcome email — do not await failure
    try:
        await send_welcome_email({"name": user.name, "email": user.email})
    except Exception:
        pass  # Email failure must not block successful registration

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, body: LoginRequest):
    """
    Authenticate with email and password.
    Updates last_login timestamp on success.
    Returns JWT access + refresh tokens.
    """
    # Look up user by email
    user = await User.find_one(User.email == body.email)

    # Deliberate: same error for "not found" and "wrong password" to prevent enumeration
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Contact support.",
        )

    # Record the login time
    user.last_login = datetime.utcnow()
    await user.save()

    token_data = {"sub": str(user.id)}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest):
    """
    Issue a new access token using a valid refresh token.
    Verifies the token type claim to prevent access tokens being used as refresh tokens.
    """
    payload = decode_token(body.refresh_token)

    # Ensure this is actually a refresh token and not an access token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type: expected refresh token",
        )

    user_id = payload.get("sub")
    user = await User.get(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated",
        )

    token_data = {"sub": str(user.id)}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """
    Return the authenticated user's profile.
    Requires a valid Bearer token in the Authorization header.
    """
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        city=current_user.city,
        role=current_user.role.value,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
    )


@router.put("/me", response_model=UserResponse)
async def update_profile(
    body: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Update the authenticated user's name, phone, or city.
    Only provided fields are updated — others remain unchanged.
    """
    if body.name:
        current_user.name = body.name
    if body.phone:
        # Verify the new phone is not already taken by another account
        existing = await User.find_one(User.phone == body.phone)
        if existing and str(existing.id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This phone number is already registered to another account",
            )
        current_user.phone = body.phone
    if body.city is not None:
        current_user.city = body.city

    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        city=current_user.city,
        role=current_user.role.value,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint — JWTs are stateless so the actual invalidation
    happens on the client by deleting the stored tokens.
    This endpoint exists so clients have a consistent place to call.
    """
    return {"message": "Logged out successfully. Please delete your tokens on the client."}


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, email: EmailStr = Body(..., embed=True)):
    """
    Request a password reset link.
    Always returns the same message whether or not the email exists,
    so attackers cannot use this endpoint to enumerate registered accounts.
    """
    user = await User.find_one(User.email == email)
    if not user:
        return {"message": "If this email exists, a reset link was sent."}

    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    await user.save()

    try:
        await send_password_reset_email({
            "email": user.email,
            "name": user.name,
            "reset_token": reset_token,
        })
    except Exception:
        pass  # Email failure must not leak whether the account exists

    return {"message": "If this email exists, a reset link was sent."}


@router.post("/reset-password")
@limiter.limit("3/hour")
async def reset_password(request: Request, token: str = Body(...), new_password: str = Body(..., min_length=6)):
    """
    Complete a password reset using the token emailed to the user.
    Token must not be expired. Clears the token after use so it cannot be replayed.
    """
    user = await User.find_one(User.reset_token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")

    if not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token expired")

    user.password_hash = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    user.updated_at = datetime.utcnow()
    await user.save()

    return {"message": "Password reset successfully"}


@router.post("/change-password")
@limiter.limit("5/hour")
async def change_password(
    request: Request,
    current_password: str = Body(...),
    new_password: str = Body(..., min_length=8),
    current_user: User = Depends(get_current_user),
):
    """
    Change the authenticated user's password.
    Requires the correct current password before allowing the change.
    """
    if not verify_password(current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    current_user.password_hash = hash_password(new_password)
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    return {"message": "Password changed successfully"}
