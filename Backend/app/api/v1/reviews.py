"""
reviews.py - Product Review Endpoints
GET  /products/{slug}/reviews        — public: list approved reviews for a product
POST /products/{slug}/reviews        — authenticated users: submit a review
PATCH /reviews/{id}/approve          — admin: approve a pending review
DELETE /reviews/{id}                 — admin: hide / remove a review
GET  /admin/reviews                  — admin: all reviews (including pending)
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query, Request
from app.core.limiter import limiter
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.models.review import Review
from app.models.product import Product
from app.core.dependencies import get_current_user, get_admin_user, get_optional_user
from app.models.user import User
from app.services.product_service import recalculate_product_rating

router = APIRouter(tags=["Reviews"])


# ---------- Schemas ----------

class ReviewCreateRequest(BaseModel):
    """Fields submitted when a customer writes a review."""
    name: str = Field(..., min_length=2, max_length=100)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=10, max_length=2000)


class ReviewResponse(BaseModel):
    """Review fields returned in API responses."""
    id: str
    product_slug: str
    product_name: str
    user_id: Optional[str]
    name: str
    rating: int
    comment: str
    is_approved: bool
    created_at: datetime


def _to_response(r: Review) -> ReviewResponse:
    """Map Review document to API response model."""
    return ReviewResponse(
        id=str(r.id),
        product_slug=r.product_slug,
        product_name=r.product_name,
        user_id=r.user_id,
        name=r.name,
        rating=r.rating,
        comment=r.comment,
        is_approved=r.is_approved,
        created_at=r.created_at,
    )


# ---------- Endpoints ----------

@router.get("/products/{slug}/reviews", response_model=List[ReviewResponse])
async def list_product_reviews(
    slug: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Public: list all approved, active reviews for a product.
    Unauthenticated users can read reviews.
    Sorted newest first so the most recent review appears at the top.
    """
    # Verify product exists
    product = await Product.find_one({"slug": slug, "is_active": True})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )

    reviews = (
        await Review.find({
            "product_slug": slug,
            "is_approved": True,
            "is_active": True,
        })
        .sort(-Review.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_to_response(r) for r in reviews]


@router.post("/products/{slug}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def submit_review(
    request: Request,
    slug: str,
    body: ReviewCreateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
):
    """
    Submit a review for a product. Works for both authenticated users and guests.
    Reviews are pending (is_approved=False) until an admin approves them.
    Prevents duplicate reviews: one active review per user per product.
    """
    # Verify product exists
    product = await Product.find_one({"slug": slug, "is_active": True})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )

    # Prevent logged-in users from reviewing the same product twice
    if current_user:
        existing = await Review.find_one({
            "product_slug": slug,
            "user_id": str(current_user.id),
            "is_active": True,
        })
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already submitted a review for this product",
            )

    review = Review(
        product_slug=slug,
        product_name=product.name,
        user_id=str(current_user.id) if current_user else None,
        name=body.name,
        rating=body.rating,
        comment=body.comment,
        is_approved=False,   # Pending admin approval
    )
    await review.insert()
    return _to_response(review)


@router.patch("/reviews/{review_id}/approve", response_model=ReviewResponse)
async def approve_review(review_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: toggle a review's approval status.
    Approved reviews appear publicly; un-approving hides them again.
    Recalculates the product's average rating after any change.
    """
    review = await Review.get(review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    # Toggle approval
    review.is_approved = not review.is_approved
    review.updated_at = datetime.utcnow()
    await review.save()

    # Recalculate product rating from all currently approved reviews
    await recalculate_product_rating(review.product_slug)

    return _to_response(review)


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: soft-delete a review.
    Sets is_active=False and recalculates the product rating.
    """
    review = await Review.get(review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    review.is_active = False
    review.is_approved = False
    review.updated_at = datetime.utcnow()
    await review.save()

    # Update product rating after removing this review
    await recalculate_product_rating(review.product_slug)


@router.get("/admin/reviews", response_model=List[ReviewResponse])
async def admin_list_reviews(
    product_slug: Optional[str] = Query(None),
    approved: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list all reviews with optional filters.
    Shows both pending and approved reviews — use approved=false to see the moderation queue.
    """
    query_filter = {"is_active": True}

    if product_slug:
        query_filter["product_slug"] = product_slug
    if approved is not None:
        query_filter["is_approved"] = approved

    reviews = (
        await Review.find(query_filter)
        .sort(-Review.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_to_response(r) for r in reviews]
