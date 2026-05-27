"""
database.py - MongoDB Database Connection
Uses Motor (async MongoDB driver) with Beanie ODM.
Beanie provides type-safe document models backed by Pydantic v2.
"""

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)

# Global client — reused across all requests
client: AsyncIOMotorClient = None


async def connect_to_mongo():
    """
    Creates MongoDB connection on app startup.
    Called from FastAPI lifespan event handler.
    Imports all document models so Beanie registers their collections.
    """
    global client
    settings = get_settings()

    # Import all models here so Beanie registers them
    from app.models.user import User
    from app.models.product import Product
    from app.models.enquiry import Enquiry
    from app.models.order import Order
    from app.models.service_booking import ServiceBooking

    logger.info(f"Connecting to MongoDB at {settings.mongodb_url}")

    # Create async motor client
    client = AsyncIOMotorClient(settings.mongodb_url)

    # Initialize Beanie with all document models
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[User, Product, Enquiry, Order, ServiceBooking],
    )

    logger.info(f"Connected to MongoDB database: {settings.mongodb_db_name}")


async def close_mongo_connection():
    """
    Closes MongoDB connection on app shutdown.
    Prevents connection leaks when the process exits.
    """
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")
