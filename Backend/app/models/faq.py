"""
faq.py - FAQ Document Model
Admin-managed question/answer entries shown on the About page FAQ section.
"""

from beanie import Document
from pydantic import Field
from datetime import datetime


class FAQ(Document):
    """FAQ document in the 'faqs' MongoDB collection."""

    question: str = Field(..., min_length=3, max_length=300)
    answer: str = Field(..., min_length=3, max_length=2000)
    category: str = "general"
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "faqs"
        indexes = ["is_active", "display_order"]
