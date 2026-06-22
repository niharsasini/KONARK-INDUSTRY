"""
testimonial.py - Company Testimonial Document Model
Homepage "what our customers say" cards — distinct from per-product Review
documents. Admin-managed, no customer submission flow.
"""

from beanie import Document
from pydantic import Field
from datetime import datetime


class Testimonial(Document):
    """Testimonial document in the 'testimonials' MongoDB collection."""

    name: str = Field(..., min_length=2, max_length=100)
    location: str = ""
    rating: int = Field(default=5, ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=1000)
    product_used: str = ""
    avatar_initials: str = ""
    is_active: bool = True
    display_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "testimonials"
        indexes = ["is_active", "display_order"]
