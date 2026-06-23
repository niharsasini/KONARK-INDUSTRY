"""
remove_sweeper.py - One-time script to remove the Industrial Floor Sweeper VOL-2300
and mark the Konark Wiper Machine as upcoming.
Run once: python scripts/remove_sweeper.py
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


async def remove_sweeper():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
    await init_beanie(
        database=client[os.getenv("MONGODB_DB_NAME", "konark_industry")],
        document_models=[Product],
    )

    product = await Product.find_one(Product.slug == "industrial-floor-sweeper-vol-2300")
    if product:
        await product.delete()
        print("Removed: Industrial Floor Sweeper VOL-2300")
    else:
        print("Not found - already removed")

    wiper = await Product.find_one(Product.slug == "konark-wiper-machine")
    if wiper:
        wiper.in_stock = False
        wiper.price = 0
        wiper.short_description = (
            "Coming soon — Industrial electric wiper machine for factory floors and warehouses."
        )
        await wiper.save()
        print("Updated: Wiper Machine -> upcoming")
    else:
        print("Wiper not found in DB")

    client.close()


if __name__ == "__main__":
    asyncio.run(remove_sweeper())
