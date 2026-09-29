"""
gallery.py - Gallery / Media Endpoints
GET    /gallery                        — public: active items (filter by category/type/featured)
GET    /gallery/featured               — public: featured items for the homepage preview
GET    /gallery/categories             — public: category keys
GET    /gallery/admin                  — admin: every item incl. inactive
GET    /gallery/{id}                   — public: one active item
POST   /gallery                        — admin: create
PATCH  /gallery/{id}                   — admin: update
DELETE /gallery/{id}                   — admin: delete
PATCH  /gallery/{id}/toggle-featured   — admin: toggle featured
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from datetime import datetime

from app.models.gallery import (
    GalleryItem, GalleryCreate, GalleryUpdate, MediaType, MediaCategory,
)
from app.core.dependencies import get_admin_user
from app.models.user import User

router = APIRouter(prefix="/gallery", tags=["Gallery"])

_SORT = [("sort_order", 1), ("created_at", -1)]


def _out(item: GalleryItem) -> dict:
    """JSON shape for clients: plain `id` (Beanie would otherwise emit `_id`)."""
    d = item.model_dump(mode="json")
    d.pop("revision_id", None)
    return d


async def _get_or_404(item_id: str) -> GalleryItem:
    """Fetch by id; a malformed id is treated the same as a missing one."""
    try:
        item = await GalleryItem.get(item_id)
    except Exception:
        item = None
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Gallery item not found")
    return item


# ─── Public ───────────────────────────────────────────────────────────────────

@router.get("")
@router.get("/", include_in_schema=False)  # no 307 redirect on trailing slash
async def get_gallery(
    category: Optional[MediaCategory] = None,
    media_type: Optional[MediaType] = None,
    featured: Optional[bool] = None,
    album_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    """Public: active gallery items, optionally filtered."""
    query = GalleryItem.find(GalleryItem.is_active == True)
    if category:
        query = query.find(GalleryItem.category == category)
    if media_type:
        query = query.find(GalleryItem.media_type == media_type)
    if featured is not None:
        query = query.find(GalleryItem.is_featured == featured)
    if album_id:
        query = query.find(GalleryItem.album_id == album_id)
    return [_out(i) for i in await query.sort(_SORT).skip(skip).limit(limit).to_list()]


@router.get("/featured")
async def get_featured_gallery(limit: int = Query(12, ge=1, le=50)):
    """Public: featured items for the homepage preview."""
    items = await GalleryItem.find(
        GalleryItem.is_active == True,
        GalleryItem.is_featured == True,
    ).sort(_SORT).limit(limit).to_list()
    return [_out(i) for i in items]


@router.get("/categories")
async def get_categories():
    return [c.value for c in MediaCategory]


@router.get("/admin")
async def get_gallery_admin(album_id: Optional[str] = None, admin: User = Depends(get_admin_user)):
    """Admin: every item, active or not (optionally only one album's)."""
    query = GalleryItem.find(GalleryItem.album_id == album_id) if album_id else GalleryItem.find_all()
    return [_out(i) for i in await query.sort(_SORT).to_list()]


@router.get("/{item_id}")
async def get_gallery_item(item_id: str):
    item = await _get_or_404(item_id)
    if not item.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Gallery item not found")
    return _out(item)


# ─── Admin ────────────────────────────────────────────────────────────────────

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_gallery_item(data: GalleryCreate, admin: User = Depends(get_admin_user)):
    item = GalleryItem(**data.model_dump())
    await item.insert()
    return _out(item)


@router.patch("/{item_id}/toggle-featured")
async def toggle_featured(item_id: str, admin: User = Depends(get_admin_user)):
    item = await _get_or_404(item_id)
    item.is_featured = not item.is_featured
    item.updated_at = datetime.utcnow()
    await item.save()
    return {"is_featured": item.is_featured}


@router.patch("/{item_id}")
async def update_gallery_item(
    item_id: str, data: GalleryUpdate, admin: User = Depends(get_admin_user)
):
    item = await _get_or_404(item_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    item.updated_at = datetime.utcnow()
    await item.save()
    return _out(item)


@router.delete("/{item_id}")
async def delete_gallery_item(item_id: str, admin: User = Depends(get_admin_user)):
    item = await _get_or_404(item_id)
    await item.delete()
    return {"message": "Deleted"}
