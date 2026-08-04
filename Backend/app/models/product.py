"""
product.py - Product Document Model
MongoDB is ideal here because specs differ completely between categories:
EV specs (range, motor, brake) vs Fan specs (power, warranty).
A flexible Dict[str, Any] avoids a rigid relational schema.
"""

from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ProductType(str, Enum):
    # EV Scooters and E-Rickshaws — triggers test-ride booking flow
    VEHICLE = "vehicle"
    # Fans, ACs, Batteries — direct add-to-cart purchase flow
    PRODUCT = "product"
    # PCB soldering and repair — service enquiry flow
    SERVICE = "service"


class ProductCategory(str, Enum):
    EV_SCOOTER = "EV Scooter"
    E_RICKSHAW = "E-Rickshaw"
    BATTERY = "Battery"
    FAN = "Fan"
    AC = "Air Conditioner"
    SOLAR = "Solar"
    INDUSTRIAL = "Industrial"
    HOME_APPLIANCE = "Home Appliance"
    ELECTRONICS = "Electronics"
    COMPONENTS = "Components"
    SERVICE = "Service"


class Product(Document):
    """
    Product document in the 'products' MongoDB collection.
    The flexible `specs` field stores category-specific attributes.
    """

    # URL-friendly identifier, e.g. "electric-scooter"
    slug: Indexed(str, unique=True)

    # Display name shown on product cards and detail pages
    name: str = Field(..., min_length=2, max_length=200)

    # Category for filter sidebar
    category: str

    # Determines which UI flow and purchase button to show
    type: ProductType

    # Price in INR — 0 means "Price on Request"
    price: float = 0

    # One-line description shown on product cards
    short_description: str = ""

    # Full description shown on product detail page
    description: str = ""

    # Relative paths to product images, e.g. ["/productimg/BLDC Fan.png"]
    images: List[str] = []

    # Average star rating out of 5
    rating: float = Field(default=0, ge=0, le=5)

    # Total number of customer reviews
    review_count: int = 0

    # Category-specific technical specifications as key-value pairs
    specs: Dict[str, Any] = {}

    # Admin-curated bullet points shown as "Key Features" and trust badges on the detail page
    features: List[str] = []

    # False means show "Out of Stock" on product page
    in_stock: bool = True

    # True shows the "NEW" badge on the product card
    is_new: bool = False

    # True means the product appears in the homepage featured section
    is_featured: bool = False

    # False means soft-deleted — excluded from all public queries
    is_active: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "products"
        indexes = ["slug", "category", "type", "is_featured", "is_active"]
