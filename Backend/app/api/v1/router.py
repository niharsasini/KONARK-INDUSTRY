"""
router.py - API v1 Router
Combines all sub-routers under the /api/v1 prefix.
To add a new module: import its router here and call include_router.
"""

from fastapi import APIRouter
from app.api.v1 import auth, products, enquiries, orders, services, admin, reviews, users
from app.api.v1 import battery_swap as battery_swap_module
from app.api.v1 import public_settings, testimonials, faqs

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

# Review routes: /api/v1/products/{slug}/reviews and /api/v1/reviews/{id}
api_router.include_router(reviews.router)

# Battery swap routes: /api/v1/battery-swap/...
api_router.include_router(battery_swap_module.router)

# Customer-facing routes: /api/v1/users/...
api_router.include_router(users.router)

# Public site settings: /api/v1/settings
api_router.include_router(public_settings.router)

# Testimonials: /api/v1/testimonials/...
api_router.include_router(testimonials.router)

# FAQs: /api/v1/faqs/...
api_router.include_router(faqs.router)
