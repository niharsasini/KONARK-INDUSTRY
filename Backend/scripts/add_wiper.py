"""
add_wiper.py - One-time script to add/update the Konark Industry Wiper Machine.
Run once: python scripts/add_wiper.py
Safe to re-run — updates the existing document if the slug already exists.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.product import Product

SLUG = "konark-wiper-machine"

PRODUCT_DATA = {
    "name": "KONARK INDUSTRY WIPER MACHINE",
    "category": "Industrial Equipment",
    "type": "vehicle",
    "price": 1440000,
    "short_description": "Industrial electric wiper machine for factory floors and warehouses.",
    "description": (
        "The Konark Industry Wiper Machine is a heavy-duty industrial cleaning "
        "solution. Battery operated, zero emissions. For factories, warehouses, "
        "hospitals and municipal operations."
    ),
    "images": ["/konark/Konark-wiper-machine.png"],
    "rating": 4.8,
    "review_count": 0,
    "specs": {
        "Type": "Industrial Floor Wiper/Sweeper",
        "Power": "Battery Operated",
        "Price": "14,40,000 + GST",
        "Application": "Factories, Warehouses, Hospitals, Municipal",
        "Brand": "Konark Industry",
    },
    "in_stock": True,
    "is_new": True,
    "is_featured": True,
}


async def add_wiper():
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(database=client[settings.mongodb_db_name], document_models=[Product])

    existing = await Product.find_one(Product.slug == SLUG)
    if existing:
        for key, value in PRODUCT_DATA.items():
            setattr(existing, key, value)
        await existing.save()
        print("Updated: KONARK INDUSTRY WIPER MACHINE")
    else:
        product = Product(slug=SLUG, **PRODUCT_DATA)
        await product.insert()
        print("Added: KONARK INDUSTRY WIPER MACHINE")

    client.close()


if __name__ == "__main__":
    asyncio.run(add_wiper())
