"""
router.py - API v1 Router
Combines all sub-routers under the /api/v1 prefix.
Adding a new feature module: import its router here and call include_router.
"""

from fastapi import APIRouter
from app.api.v1 import auth, products, enquiries, orders, services, admin

# Master v1 router — mounted at /api/v1 in main.py
api_router = APIRouter(prefix="/api/v1")

# Auth routes: /api/v1/auth/...
api_router.include_router(auth.router)

# Product routes: /api/v1/products/...
api_router.include_router(products.router)

# Enquiry routes: /api/v1/enquiries/...
api_router.include_router(enquiries.router)

# Order routes: /api/v1/orders/...
api_router.include_router(orders.router)

# Service booking routes: /api/v1/services/...
api_router.include_router(services.router)

# Admin dashboard routes: /api/v1/admin/...
api_router.include_router(admin.router)
