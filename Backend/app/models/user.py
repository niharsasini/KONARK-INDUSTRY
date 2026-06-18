"""
user.py - User Document Model
Defines the User collection structure in MongoDB.
Beanie Document maps directly to a MongoDB collection.
"""

from beanie import Document, Indexed
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    # Regular customer who can browse and buy products
    CUSTOMER = "customer"
    # Admin who can manage products, orders, and enquiries
    ADMIN = "admin"


class User(Document):
    """
    User document stored in the 'users' MongoDB collection.
    Represents both customers and admin users.
    """

    # Full name of the user
    name: str = Field(..., min_length=2, max_length=100)

    # Email — unique index for fast lookup during login
    email: Indexed(EmailStr, unique=True)

    # Indian phone number — 10 digits, unique per account
    phone: Indexed(str, unique=True)

    # bcrypt-hashed password — never store plain text
    password_hash: str

    # City in Odisha — helps with service area checks
    city: Optional[str] = None

    # Role controls which endpoints the user can access
    role: UserRole = UserRole.CUSTOMER

    # False means the account was soft-deleted
    is_active: bool = True

    # True after email OTP or admin verification
    is_verified: bool = False

    # When the account was created
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Updated on any profile change
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Recorded after each successful login
    last_login: Optional[datetime] = None

    # Set when a password reset is requested; cleared after use or expiry
    reset_token: Optional[str] = None
    reset_token_expires: Optional[datetime] = None

    class Settings:
        # MongoDB collection name
        name = "users"
        indexes = ["email", "phone", "role"]
