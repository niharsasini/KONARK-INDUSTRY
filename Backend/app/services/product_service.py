"""
product_service.py - Product Business Logic Helpers
Handles rating recalculation after new reviews and other product operations.
"""

from typing import Optional
from app.models.product import Product
from app.models.review import Review
import logging

logger = logging.getLogger(__name__)


async def recalculate_product_rating(product_slug: str) -> Optional[Product]:
    """
    Recalculate a product's average rating from all approved reviews.
    Called after a new review is approved or deleted.
    Returns the updated product document.
    """
    product = await Product.find_one({"slug": product_slug, "is_active": True})
    if not product:
        return None

    # Only count approved, active reviews in the rating
    reviews = await Review.find({
        "product_slug": product_slug,
        "is_approved": True,
        "is_active": True,
    }).to_list()

    if reviews:
        avg = sum(r.rating for r in reviews) / len(reviews)
        product.rating = round(avg, 1)
        product.review_count = len(reviews)
    else:
        # No reviews: reset to 0
        product.rating = 0
        product.review_count = 0

    await product.save()
    logger.info(f"Rating recalculated for {product_slug}: {product.rating} ({product.review_count} reviews)")
    return product


async def get_featured_products(limit: int = 6) -> list:
    """
    Return up to `limit` featured, active products.
    Used by the homepage featured section.
    """
    return await Product.find({"is_featured": True, "is_active": True}).limit(limit).to_list()


async def get_products_by_type(product_type: str, limit: int = 50) -> list:
    """
    Return all active products of a given type (vehicle/product/service).
    """
    return await Product.find({"type": product_type, "is_active": True}).limit(limit).to_list()
