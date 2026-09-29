"""
album.py - Gallery Album Document Model
An album groups gallery photos (GalleryItem.album_id) under one title/event.
Shown as cards on the homepage and /gallery, with photos on /gallery/[slug].
"""

from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.models.gallery import MediaCategory


class Album(Document):
    """Album in the 'albums' MongoDB collection."""

    title: str = Field(..., min_length=1, max_length=200)
    slug: str
    description: Optional[str] = None
    category: MediaCategory = MediaCategory.EVENTS
    cover_image: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    is_published: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "albums"
        indexes = ["slug", "category", "is_published", "order"]


class AlbumCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    slug: Optional[str] = None  # generated from title when omitted
    description: Optional[str] = None
    category: MediaCategory = MediaCategory.EVENTS
    cover_image: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    is_published: bool = True
    order: int = 0


class AlbumUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    slug: Optional[str] = None
    description: Optional[str] = None
    category: Optional[MediaCategory] = None
    cover_image: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    is_published: Optional[bool] = None
    order: Optional[int] = None


class ReorderRequest(BaseModel):
    ids: list[str]
