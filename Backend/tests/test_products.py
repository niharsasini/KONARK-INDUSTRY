"""
test_products.py - Product endpoint tests.
"""

import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_list_products_is_public():
    """
    Verify that the product list endpoint works without authentication.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/products")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_product_requires_admin():
    """
    Verify that creating a product without an admin token returns 401.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/products", json={
            "slug": "test-product",
            "name": "Test Product",
            "category": "Test",
            "type": "product",
        })
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_nonexistent_product():
    """
    Verify that requesting a non-existent slug returns 404.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/products/this-slug-does-not-exist")
        assert response.status_code == 404
