"""
enable_banner.py - One-time script to enable and set the announcement banner.
Run once: python scripts/enable_banner.py
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.site_settings import SiteSettings
from dotenv import load_dotenv

load_dotenv()


async def enable_banner():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
    await init_beanie(
        database=client[os.getenv("MONGODB_DB_NAME", "konark_industry")],
        document_models=[SiteSettings],
    )

    settings = await SiteSettings.get_site_settings()
    settings.announcement_banner_enabled = True
    settings.announcement_banner_text = (
        "New Products Launching — EV Cars & Industrial Machines Coming 2025-26!"
    )
    settings.announcement_banner_emoji = "🎉"
    await settings.save()
    print("Banner enabled successfully!")
    print(f"Text: {settings.announcement_banner_text}")
    client.close()


if __name__ == "__main__":
    asyncio.run(enable_banner())
