"""
seed_testimonials.py - Seed default homepage testimonials into MongoDB.
Run once: python scripts/seed_testimonials.py
Safe to re-run — skips if any testimonials already exist.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.testimonial import Testimonial


DEFAULT_TESTIMONIALS = [
    {
        "name": "Rajesh Kumar Panda",
        "location": "Bhubaneswar, Odisha",
        "rating": 5,
        "comment": "Bought the Electric Scooter 6 months ago. Saving ₹3,000 per month on fuel. The after-sales service is excellent — technician came to my home when I had a battery query.",
        "product_used": "Electric Scooter",
        "avatar_initials": "RKP",
        "display_order": 1,
    },
    {
        "name": "Sunita Mishra",
        "location": "Cuttack, Odisha",
        "rating": 5,
        "comment": "The LFP Battery system they installed for our solar setup has been running for 8 months without any issue. Great product, better support.",
        "product_used": "LFP Battery System",
        "avatar_initials": "SM",
        "display_order": 2,
    },
    {
        "name": "Pradeep Sahoo",
        "location": "Puri, Odisha",
        "rating": 5,
        "comment": "AC repair was done within 2 hours of calling. The BLDC Fan they recommended cut our electricity bill by 60%. Highly recommend Konark Industry.",
        "product_used": "AC Service + BLDC Fan",
        "avatar_initials": "PS",
        "display_order": 3,
    },
]


async def main():
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(database=client[settings.mongodb_db_name], document_models=[Testimonial])

    existing = await Testimonial.find_all().count()
    if existing > 0:
        print(f"Skipped: {existing} testimonial(s) already exist.")
        return

    for data in DEFAULT_TESTIMONIALS:
        await Testimonial(**data).insert()
    print(f"Seeded {len(DEFAULT_TESTIMONIALS)} testimonials.")


if __name__ == "__main__":
    asyncio.run(main())
