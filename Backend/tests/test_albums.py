"""
test_albums.py - Album endpoints against a scratch database (needs MongoDB at MONGODB_URL).
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import get_settings
from app.core.dependencies import get_admin_user
from app.main import app
from app.models.album import Album
from app.models.gallery import GalleryItem


@pytest_asyncio.fixture
async def client():
    s = get_settings()
    mongo = AsyncIOMotorClient(s.mongodb_url)
    db_name = "konark_test_albums"
    await init_beanie(database=mongo[db_name], document_models=[Album, GalleryItem])
    await Album.delete_all()
    await GalleryItem.delete_all()
    app.dependency_overrides[get_admin_user] = lambda: object()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.pop(get_admin_user, None)
    await mongo.drop_database(db_name)


@pytest.mark.asyncio
async def test_album_lifecycle(client):
    r = await client.post("/api/v1/albums", json={"title": "Diwali Fest 2025", "category": "events"})
    assert r.status_code == 201
    album = r.json()
    assert album["slug"] == "diwali-fest-2025" and album["photo_count"] == 0

    # duplicate title gets a unique slug
    r = await client.post("/api/v1/albums/", json={"title": "Diwali Fest 2025"})
    assert r.status_code == 201 and r.json()["slug"] == "diwali-fest-2025-2"

    # empty albums are hidden from the public list
    assert (await client.get("/api/v1/albums")).json() == []

    ids = []
    for i in range(3):
        r = await client.post("/api/v1/gallery", json={
            "title": f"p{i}", "url": f"https://img/{i}.jpg", "category": "events", "album_id": album["id"],
        })
        assert r.status_code == 201
        ids.append(r.json()["id"])

    for url in ("/api/v1/albums", "/api/v1/albums/"):
        r = await client.get(url, params={"category": "events"})
        assert r.status_code == 200  # no 307
        data = r.json()
        assert len(data) == 1 and data[0]["photo_count"] == 3
        assert data[0]["cover_image"] == "https://img/0.jpg"  # falls back to first photo

    assert (await client.get("/api/v1/albums", params={"category": "team"})).json() == []

    # reorder + detail
    r = await client.post(f"/api/v1/albums/{album['id']}/reorder", json={"ids": ids[::-1]})
    assert r.status_code == 200
    detail = (await client.get("/api/v1/albums/diwali-fest-2025")).json()
    assert [p["title"] for p in detail["photos"]] == ["p2", "p1", "p0"]
    assert detail["photo_count"] == 3

    # explicit cover, unpublish hides it
    r = await client.patch(f"/api/v1/albums/{album['id']}", json={"cover_image": "https://img/cover.jpg"})
    assert r.json()["cover_image"] == "https://img/cover.jpg"
    await client.patch(f"/api/v1/albums/{album['id']}", json={"is_published": False})
    assert (await client.get("/api/v1/albums/diwali-fest-2025")).status_code == 404
    assert len((await client.get("/api/v1/albums/admin")).json()) == 2

    # delete keeps photos (unassigned) by default
    assert (await client.delete(f"/api/v1/albums/{album['id']}")).status_code == 200
    assert len((await client.get("/api/v1/gallery/admin")).json()) == 3
    assert len((await client.get("/api/v1/gallery/admin", params={"album_id": album["id"]})).json()) == 0


@pytest.mark.asyncio
async def test_admin_routes_require_auth():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        assert (await c.post("/api/v1/albums", json={"title": "x"})).status_code == 401
        assert (await c.get("/api/v1/albums/admin")).status_code == 401
