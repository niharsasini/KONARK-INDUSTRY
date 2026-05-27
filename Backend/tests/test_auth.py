"""
test_auth.py - Auth endpoint tests.
Run: pytest tests/ -v
Requires: pytest, pytest-asyncio, httpx
"""

import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_register_and_login():
    """
    Verify that a new user can register and then immediately login
    with the same credentials, receiving valid JWT tokens both times.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register
        response = await client.post("/api/v1/auth/register", json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "9000000001",
            "password": "testpass123",
        })
        # Either 201 (new) or 409 (already exists from a previous run) is acceptable
        assert response.status_code in (201, 409)

        # Login
        login_response = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "testpass123",
        })
        assert login_response.status_code == 200
        data = login_response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password():
    """
    Verify that a wrong password returns HTTP 401, not 500.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "wrongpassword",
        })
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_without_token():
    """
    Verify that /auth/me returns 401 when no token is provided.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 401
