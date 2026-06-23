"""
update_wiper_price.py - One-time script to set the Konark Wiper Machine's
final price and mark it back in stock (no longer upcoming).
Run once: python scripts/update_wiper_price.py
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.product import Product
from dotenv import load_dotenv

load_dotenv()


async def update_wiper():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
    await init_beanie(
        database=client[os.getenv("MONGODB_DB_NAME", "konark_industry")],
        document_models=[Product],
    )
    wiper = await Product.find_one(Product.slug == "konark-wiper-machine")
    if wiper:
        wiper.price = 1440000
        wiper.in_stock = True
        wiper.short_description = (
            "Heavy-duty industrial electric wiper machine "
            "for factory floors, warehouses and municipal areas."
        )
        await wiper.save()
        print(f"Updated: {wiper.name} -> Rs {wiper.price:,}")
    else:
        print("Wiper machine not found in DB")
    client.close()


if __name__ == "__main__":
    asyncio.run(update_wiper())
