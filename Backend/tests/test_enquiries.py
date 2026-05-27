"""
test_enquiries.py - Enquiry endpoint tests.
"""

import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_submit_enquiry_is_public():
    """
    Verify that submitting an enquiry works without authentication.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/enquiries", json={
            "name": "Test Customer",
            "phone": "9000000002",
            "enquiry_type": "contact",
            "message": "This is a test enquiry from pytest.",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Customer"
        assert data["status"] == "new"


@pytest.mark.asyncio
async def test_list_enquiries_requires_admin():
    """
    Verify that listing all enquiries without an admin token returns 401.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/enquiries")
        assert response.status_code == 401
