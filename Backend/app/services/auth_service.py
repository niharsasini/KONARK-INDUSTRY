"""
auth_service.py - Authentication Business Logic
Helpers that sit between the auth router and the database layer.
Keeps the router thin and business logic testable.
"""

from typing import Optional
from app.models.user import User
from app.core.security import verify_password, hash_password
import logging

logger = logging.getLogger(__name__)


async def authenticate_user(email: str, password: str) -> Optional[User]:
    """
    Look up a user by email and verify their password.
    Returns the User document if credentials are valid, None otherwise.
    Same error path for "not found" and "wrong password" prevents enumeration.
    """
    user = await User.find_one(User.email == email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


async def change_password(user: User, current_password: str, new_password: str) -> bool:
    """
    Change a user's password after verifying the current password.
    Returns True on success, False if current password is wrong.
    """
    if not verify_password(current_password, user.password_hash):
        return False

    user.password_hash = hash_password(new_password)
    await user.save()
    logger.info(f"Password changed for user {user.email}")
    return True


async def get_user_by_email(email: str) -> Optional[User]:
    """
    Look up a user by email address.
    Returns None if not found.
    """
    return await User.find_one(User.email == email)


async def get_user_by_phone(phone: str) -> Optional[User]:
    """
    Look up a user by phone number.
    Returns None if not found.
    """
    return await User.find_one(User.phone == phone)
