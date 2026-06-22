"""
add_sweeper.py - One-time script to add/update the Industrial Floor Sweeper VOL-2300.
Run once: python scripts/add_sweeper.py
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

SLUG = "industrial-floor-sweeper-vol-2300"

PRODUCT_DATA = {
    "name": "Industrial Floor Sweeper VOL-2300",
    "category": "Industrial Equipment",
    "type": "vehicle",
    "price": 1440000,
    "short_description": "Heavy-duty electric floor sweeper for industrial and municipal cleaning. 22,000 m²/h efficiency.",
    "description": (
        "The Konark Industry VOL-2300 Industrial Floor Sweeper is a powerful "
        "battery-operated cleaning machine designed for large industrial and "
        "municipal areas. Features sweep and suction combo, HD reversing camera, "
        "industrial grade dust filtration, and water spray dust suppression system. "
        "Ideal for warehouses, factory premises, industrial parks, roads and "
        "municipal cleaning."
    ),
    "images": ["/konark/sweeper-main.png"],
    "rating": 4.8,
    "review_count": 0,
    "specs": {
        "Model": "VOL-2300",
        "ProductSize": "3200 x 2100 x 2950 mm",
        "SweepingWidth": "2000-2200 mm",
        "MainBrushWidth": "800 mm",
        "SideBrushWidth": "550 mm",
        "DustTankCapacity": "260 L",
        "WaterTankCapacity": "300 L",
        "MachineWeight": "1580 kg",
        "Battery": "48V/200Ah",
        "DriveMotor": "3000W",
        "BrushMotor": "1000W",
        "WorkingTime": "6-8 hours",
        "WorkingEfficiency": "22000 sqm/h",
        "TravelSpeed": "12-16 km/h",
        "AirFilter": "Industrial Grade Dust Filter",
    },
    "in_stock": True,
    "is_new": True,
    "is_featured": True,
}


async def add_sweeper():
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(database=client[settings.mongodb_db_name], document_models=[Product])

    existing = await Product.find_one(Product.slug == SLUG)
    if existing:
        for key, value in PRODUCT_DATA.items():
            setattr(existing, key, value)
        await existing.save()
        print("Updated: Industrial Floor Sweeper VOL-2300")
    else:
        product = Product(slug=SLUG, **PRODUCT_DATA)
        await product.insert()
        print("Added: Industrial Floor Sweeper VOL-2300")

    client.close()


if __name__ == "__main__":
    asyncio.run(add_sweeper())
