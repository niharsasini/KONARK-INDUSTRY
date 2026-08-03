"""
public_stats.py - Public Auto-Calculated Stats Endpoint
Exposes the homepage stat numbers that should reflect live data
(product count, average review rating, years of operation) alongside
the admin-set manual overrides (customer/city counts) and cert
visibility, without requiring admin auth.
"""

from datetime import datetime

from fastapi import APIRouter

from app.models.site_settings import SiteSettings
from app.models.product import Product
from app.models.review import Review

router = APIRouter(prefix="/stats", tags=["Public Stats"])


@router.get("/public")
async def get_public_stats():
    """Public: homepage stats — auto-calculated where possible, admin overrides otherwise."""
    settings = await SiteSettings.get_site_settings()

    total_products = await Product.find({"is_active": True}).count()

    approved_reviews = await Review.find({"is_approved": True, "is_active": True}).to_list()
    if approved_reviews:
        avg_rating = round(sum(r.rating for r in approved_reviews) / len(approved_reviews), 1)
        avg_rating_display = f"{avg_rating}★"
    else:
        avg_rating = None
        avg_rating_display = settings.stats_rating

    current_year = datetime.utcnow().year
    years = max(current_year - settings.founding_year, 0)

    return {
        # Manual (admin-set)
        "customers": settings.stats_customers,
        "cities": settings.stats_cities,
        "satisfaction": settings.stats_satisfaction,
        "founding_year": settings.founding_year,

        # Auto-calculated
        "total_products": total_products,
        "review_count": len(approved_reviews),
        "avg_rating": avg_rating,
        "avg_rating_display": avg_rating_display,
        "years_experience": f"{years}+",

        # Certifications (admin-controlled visibility)
        "hidden_certifications": settings.hidden_certifications,
    }
