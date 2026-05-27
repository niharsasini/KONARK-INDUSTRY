"""
review.py - Product Review Document Model
Stores customer reviews for products.
Reviews require admin approval before appearing publicly.
"""

from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime


class Review(Document):
    """
    Review document in the 'reviews' MongoDB collection.
    Linked to a product by slug (not ObjectId) so reviews survive
    product document re-seeding without losing references.
    """

    # Product this review is for
    product_slug: Indexed(str)
    product_name: str

    # User who wrote the review — None if submitted without account
    user_id: Optional[str] = None

    # Reviewer display name
    name: str = Field(..., min_length=2, max_length=100)

    # Star rating 1-5
    rating: int = Field(..., ge=1, le=5)

    # Written review text
    comment: str = Field(..., min_length=10, max_length=2000)

    # Admin must approve before review appears publicly
    is_approved: bool = False

    # Soft delete — admin can hide without deleting
    is_active: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reviews"
        indexes = ["product_slug", "user_id", "is_approved", "is_active", "created_at"]
