"""
database.py - MongoDB Database Connection
Uses Motor (async MongoDB driver) with Beanie ODM.
All Document models must be registered here in init_beanie.
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
    Called from the FastAPI lifespan event handler.
    Every Beanie Document model must be listed in document_models.
    """
    global client
    settings = get_settings()

    # Import all models so Beanie registers their collections and indexes
    from app.models.user import User
    from app.models.product import Product
    from app.models.enquiry import Enquiry
    from app.models.order import Order
    from app.models.service_booking import ServiceBooking
    from app.models.review import Review
    from app.models.notification import Notification
    from app.models.site_settings import SiteSettings
    from app.models.battery_swap import BatterySwap
    from app.models.testimonial import Testimonial
    from app.models.faq import FAQ

    logger.info(f"Connecting to MongoDB at {settings.mongodb_url}")

    client = AsyncIOMotorClient(settings.mongodb_url)

    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[
            User,
            Product,
            Enquiry,
            Order,
            ServiceBooking,
            Review,
            Notification,
            SiteSettings,
            BatterySwap,
            Testimonial,
            FAQ,
        ],
    )

    logger.info(f"Connected to MongoDB: {settings.mongodb_db_name} (11 collections registered)")


async def close_mongo_connection():
    """
    Closes MongoDB connection on app shutdown.
    Prevents connection leaks when the process exits.
    """
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")
