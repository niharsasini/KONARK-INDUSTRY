"""
gallery.py - Gallery / Media Document Model
Photos and videos shown on the public /gallery page and the homepage preview.
Admin-managed via /api/v1/gallery.
"""

from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"


class MediaCategory(str, Enum):
    PRODUCTS = "products"
    EVENTS = "events"
    FACTORY = "factory"
    TEAM = "team"
    AWARDS = "awards"
    CUSTOMERS = "customers"


class GalleryItem(Document):
    """Gallery item in the 'gallery' MongoDB collection."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    media_type: MediaType = MediaType.IMAGE
    category: MediaCategory = MediaCategory.PRODUCTS
    url: str  # image URL, or video URL (YouTube / direct file)
    thumbnail_url: Optional[str] = None  # poster image for videos
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0
    tags: List[str] = []
    album_id: Optional[str] = None  # Album._id as str; None = not in any album
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "gallery"
        indexes = ["is_active", "is_featured", "category", "sort_order", "album_id"]


class GalleryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    media_type: MediaType = MediaType.IMAGE
    category: MediaCategory = MediaCategory.PRODUCTS
    url: str = Field(..., min_length=1)
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0
    tags: List[str] = []
    album_id: Optional[str] = None


class GalleryUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    media_type: Optional[MediaType] = None
    category: Optional[MediaCategory] = None
    url: Optional[str] = Field(default=None, min_length=1)
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    tags: Optional[List[str]] = None
    album_id: Optional[str] = None
