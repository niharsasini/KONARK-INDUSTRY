"""
create_admin.py - Bootstrap the first admin user in MongoDB.
Run once after first setup: python scripts/create_admin.py
Safe to re-run — skips creation if the admin email already exists.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.user import User, UserRole
from app.core.security import hash_password


async def create_admin():
    """
    Connect to MongoDB and create the admin superuser.
    Credentials come from .env (ADMIN_EMAIL / ADMIN_PASSWORD).
    """
    settings = get_settings()

    # Standalone connection — bypasses the FastAPI lifespan
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[User],
    )

    # Do nothing if the admin account already exists
    existing = await User.find_one(User.email == settings.admin_email)
    if existing:
        print(f"Admin already exists: {settings.admin_email}")
        client.close()
        return

    # Create the admin document with a bcrypt-hashed password
    admin = User(
        name="Konark Admin",
        email=settings.admin_email,
        phone="9437611129",
        password_hash=hash_password(settings.admin_password),
        city="Bhubaneswar",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
    )
    await admin.insert()

    print(f"Admin created successfully!")
    print(f"  Email   : {settings.admin_email}")
    print(f"  Password: {settings.admin_password}")
    print(f"  Role    : {UserRole.ADMIN.value}")
    print(f"\nChange the password in .env before deploying to production.")

    client.close()


if __name__ == "__main__":
    asyncio.run(create_admin())
