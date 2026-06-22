"""
seed_faqs.py - Seed default FAQs into MongoDB.
Run once: python scripts/seed_faqs.py
Safe to re-run — skips if any FAQs already exist.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.faq import FAQ


DEFAULT_FAQS = [
    {
        "question": "What areas do you service?",
        "answer": "We service Bhubaneswar, Cuttack, Puri, Rourkela, Berhampur and surrounding areas.",
        "category": "service",
        "display_order": 1,
    },
    {
        "question": "How long does EV Scooter delivery take?",
        "answer": "Delivery within Bhubaneswar takes 2-3 working days. Other Odisha locations take 5-7 days.",
        "category": "delivery",
        "display_order": 2,
    },
    {
        "question": "Do you offer warranty on EV vehicles?",
        "answer": "Yes. All EV vehicles come with 1 year comprehensive warranty and 3 year battery warranty.",
        "category": "warranty",
        "display_order": 3,
    },
    {
        "question": "Can I return a product?",
        "answer": "Products can be returned within 7 days of delivery if unused and in original packaging.",
        "category": "returns",
        "display_order": 4,
    },
    {
        "question": "How does battery swap work?",
        "answer": "Submit a swap request online with your battery details. Our technician collects the discharged battery and delivers a fully charged one within the same day.",
        "category": "battery_swap",
        "display_order": 5,
    },
]


async def main():
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(database=client[settings.mongodb_db_name], document_models=[FAQ])

    existing = await FAQ.find_all().count()
    if existing > 0:
        print(f"Skipped: {existing} FAQ(s) already exist.")
        return

    for data in DEFAULT_FAQS:
        await FAQ(**data).insert()
    print(f"Seeded {len(DEFAULT_FAQS)} FAQs.")


if __name__ == "__main__":
    asyncio.run(main())
