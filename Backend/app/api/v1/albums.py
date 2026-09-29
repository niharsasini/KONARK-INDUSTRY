"""
albums.py - Gallery Album Endpoints
GET    /albums                       — public: published albums (?category=&limit=) with photo_count
GET    /albums/admin                 — admin: every album incl. unpublished, with photo_count
GET    /albums/{slug}                — public: one published album + its active photos
POST   /albums                       — admin: create
PATCH  /albums/{id}                  — admin: update (incl. cover_image)
DELETE /albums/{id}                  — admin: delete (?delete_photos=true also removes its photos)
POST   /albums/{id}/reorder          — admin: set photo order from a list of photo ids

Every list/create route is also registered with a trailing slash so
/albums/ answers directly instead of 307-redirecting.
"""

import re
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo import UpdateOne

from app.models.album import Album, AlbumCreate, AlbumUpdate, ReorderRequest
from app.models.gallery import GalleryItem, MediaCategory
from app.core.dependencies import get_admin_user
from app.models.user import User

router = APIRouter(prefix="/albums", tags=["Albums"])

_PHOTO_SORT = [("sort_order", 1), ("created_at", 1)]
_ALBUM_SORT = [("order", 1), ("event_date", -1), ("created_at", -1)]


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "album"


async def _unique_slug(base: str, exclude_id=None) -> str:
    slug, n = base, 2
    while True:
        existing = await Album.find_one(Album.slug == slug)
        if not existing or (exclude_id is not None and existing.id == exclude_id):
            return slug
        slug = f"{base}-{n}"
        n += 1


async def _get_or_404(album_id: str) -> Album:
    try:
        album = await Album.get(album_id)
    except Exception:
        album = None
    if not album:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Album not found")
    return album


async def _counts(album_ids: list[str], only_active: bool) -> dict[str, int]:
    if not album_ids:
        return {}
    match: dict = {"album_id": {"$in": album_ids}}
    if only_active:
        match["is_active"] = True
    rows = await GalleryItem.get_motor_collection().aggregate(
        [{"$match": match}, {"$group": {"_id": "$album_id", "n": {"$sum": 1}}}]
    ).to_list(None)
    return {r["_id"]: r["n"] for r in rows}


async def _first_photo_url(album_id: str, only_active: bool) -> Optional[str]:
    q = GalleryItem.find(GalleryItem.album_id == album_id)
    if only_active:
        q = q.find(GalleryItem.is_active == True)
    item = await q.sort(_PHOTO_SORT).first_or_none()
    if not item:
        return None
    return item.thumbnail_url or item.url


async def _serialize(albums: list[Album], only_active: bool) -> list[dict]:
    ids = [str(a.id) for a in albums]
    counts = await _counts(ids, only_active)
    out = []
    for a in albums:
        d = a.model_dump(mode="json")
        d["id"] = str(a.id)
        d.pop("revision_id", None)
        d["photo_count"] = counts.get(d["id"], 0)
        # Fall back to the first photo when no cover has been chosen.
        if not d.get("cover_image") and d["photo_count"]:
            d["cover_image"] = await _first_photo_url(d["id"], only_active)
        out.append(d)
    return out


# ─── Public ───────────────────────────────────────────────────────────────────

@router.get("")
@router.get("/", include_in_schema=False)
async def list_albums(
    category: Optional[MediaCategory] = None,
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    """Public: published albums that contain at least one photo."""
    q = Album.find(Album.is_published == True)
    if category:
        q = q.find(Album.category == category)
    albums = await q.sort(_ALBUM_SORT).skip(skip).limit(limit).to_list()
    data = await _serialize(albums, only_active=True)
    return [a for a in data if a["photo_count"] > 0]


@router.get("/admin")
async def list_albums_admin(admin: User = Depends(get_admin_user)):
    albums = await Album.find_all().sort(_ALBUM_SORT).to_list()
    return await _serialize(albums, only_active=False)


@router.get("/{slug}")
async def get_album(slug: str):
    album = await Album.find_one(Album.slug == slug, Album.is_published == True)
    if not album:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Album not found")
    photos = await GalleryItem.find(
        GalleryItem.album_id == str(album.id), GalleryItem.is_active == True
    ).sort(_PHOTO_SORT).to_list()
    data = (await _serialize([album], only_active=True))[0]
    data["photos"] = [
        {**p.model_dump(mode="json"), "id": str(p.id)} for p in photos
    ]
    for p in data["photos"]:
        p.pop("revision_id", None)
    return data


# ─── Admin ────────────────────────────────────────────────────────────────────

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_album(data: AlbumCreate, admin: User = Depends(get_admin_user)):
    fields = data.model_dump()
    fields["slug"] = await _unique_slug(_slugify(fields["slug"] or fields["title"]))
    album = Album(**fields)
    await album.insert()
    return (await _serialize([album], only_active=False))[0]


@router.post("/{album_id}/reorder")
async def reorder_photos(album_id: str, data: ReorderRequest, admin: User = Depends(get_admin_user)):
    album = await _get_or_404(album_id)
    from bson import ObjectId
    try:
        ops = [
            UpdateOne({"_id": ObjectId(pid), "album_id": str(album.id)}, {"$set": {"sort_order": i}})
            for i, pid in enumerate(data.ids)
        ]
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid photo id")
    if ops:
        await GalleryItem.get_motor_collection().bulk_write(ops)
    return {"message": "Reordered", "count": len(ops)}


@router.patch("/{album_id}")
async def update_album(album_id: str, data: AlbumUpdate, admin: User = Depends(get_admin_user)):
    album = await _get_or_404(album_id)
    changes = data.model_dump(exclude_unset=True)
    if changes.get("slug"):
        changes["slug"] = await _unique_slug(_slugify(changes["slug"]), exclude_id=album.id)
    else:
        changes.pop("slug", None)
    for key, value in changes.items():
        setattr(album, key, value)
    album.updated_at = datetime.utcnow()
    await album.save()
    return (await _serialize([album], only_active=False))[0]


@router.delete("/{album_id}")
async def delete_album(
    album_id: str,
    delete_photos: bool = False,
    admin: User = Depends(get_admin_user),
):
    album = await _get_or_404(album_id)
    coll = GalleryItem.get_motor_collection()
    if delete_photos:
        await coll.delete_many({"album_id": str(album.id)})
    else:
        await coll.update_many({"album_id": str(album.id)}, {"$set": {"album_id": None}})
    await album.delete()
    return {"message": "Deleted"}
