"""
migrate_gallery_to_albums.py - Group existing ungrouped gallery items into albums.

Items with no album_id are grouped by (title, category), case-insensitive.
Each group becomes one Album; its first image becomes the cover.

DRY RUN by default (prints the plan, writes nothing):
    python scripts/migrate_gallery_to_albums.py
Apply:
    python scripts/migrate_gallery_to_albums.py --apply

Safe to re-run: items that already have an album_id are skipped.
"""

import asyncio
import re
import sys
import os
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.gallery import GalleryItem
from app.models.album import Album


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "album"


async def main(apply: bool):
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(database=client[settings.mongodb_db_name], document_models=[GalleryItem, Album])
    print(f"Database: {settings.mongodb_db_name}  |  mode: {'APPLY' if apply else 'DRY RUN'}\n")

    items = await GalleryItem.find(GalleryItem.album_id == None).sort(  # noqa: E711
        [("sort_order", 1), ("created_at", 1)]
    ).to_list()
    if not items:
        print("Nothing to migrate (no items without an album).")
        return

    groups = defaultdict(list)
    for it in items:
        groups[(it.title.strip().lower(), it.category.value)].append(it)

    taken = {a.slug for a in await Album.find_all().to_list()}
    plan = []
    for (_, cat), members in groups.items():
        base = slugify(members[0].title)
        slug, n = base, 2
        while slug in taken:
            slug, n = f"{base}-{n}", n + 1
        taken.add(slug)
        cover_item = next((m for m in members if m.media_type.value == "image"), members[0])
        plan.append((members[0].title.strip(), cat, slug, cover_item.thumbnail_url or cover_item.url, members))

    print(f"{len(items)} item(s) -> {len(plan)} album(s)\n")
    for title, cat, slug, cover, members in plan:
        print(f"  [{cat:9}] {title!r}  slug={slug}  photos={len(members)}")
        print(f"             cover: {cover}")

    if not apply:
        print("\nDry run only - nothing written. Re-run with --apply to migrate.")
        return

    for title, cat, slug, cover, members in plan:
        album = Album(
            title=title, slug=slug, category=cat, cover_image=cover,
            description=next((m.description for m in members if m.description), None),
            is_published=any(m.is_active for m in members),
            event_date=min(m.created_at for m in members),
        )
        await album.insert()
        for m in members:
            m.album_id = str(album.id)
            await m.save()
    print(f"\nDone: created {len(plan)} album(s).")


if __name__ == "__main__":
    asyncio.run(main("--apply" in sys.argv))
