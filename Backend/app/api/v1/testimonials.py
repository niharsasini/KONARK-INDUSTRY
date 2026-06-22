"""
testimonials.py - Company Testimonial Endpoints
GET    /testimonials        — public: active testimonials, sorted by display_order
POST   /testimonials        — admin: create
PUT    /testimonials/{id}   — admin: update
DELETE /testimonials/{id}   — admin: delete
PATCH  /testimonials/{id}/toggle — admin: toggle active/inactive
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.models.testimonial import Testimonial
from app.core.dependencies import get_admin_user
from app.models.user import User

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


class TestimonialCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    location: str = ""
    rating: int = Field(default=5, ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=1000)
    product_used: str = ""
    avatar_initials: str = ""
    display_order: int = 0
    is_active: bool = True


class TestimonialUpdateRequest(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = None
    product_used: Optional[str] = None
    avatar_initials: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


@router.get("")
async def get_testimonials():
    """Public: active testimonials for the homepage, in display order."""
    testimonials = await Testimonial.find(Testimonial.is_active == True).sort(
        Testimonial.display_order
    ).to_list()
    return testimonials


@router.get("/admin")
async def get_all_testimonials_admin(admin: User = Depends(get_admin_user)):
    """Admin: every testimonial (active and inactive), in display order."""
    return await Testimonial.find_all().sort(Testimonial.display_order).to_list()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    body: TestimonialCreateRequest, admin: User = Depends(get_admin_user)
):
    testimonial = Testimonial(**body.model_dump())
    await testimonial.insert()
    return testimonial


@router.put("/{testimonial_id}")
async def update_testimonial(
    testimonial_id: str,
    body: TestimonialUpdateRequest,
    admin: User = Depends(get_admin_user),
):
    testimonial = await Testimonial.get(testimonial_id)
    if not testimonial:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Testimonial not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(testimonial, key, value)
    testimonial.updated_at = datetime.utcnow()
    await testimonial.save()
    return testimonial


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(testimonial_id: str, admin: User = Depends(get_admin_user)):
    testimonial = await Testimonial.get(testimonial_id)
    if not testimonial:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Testimonial not found")
    await testimonial.delete()


@router.patch("/{testimonial_id}/toggle")
async def toggle_testimonial(testimonial_id: str, admin: User = Depends(get_admin_user)):
    testimonial = await Testimonial.get(testimonial_id)
    if not testimonial:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Testimonial not found")
    testimonial.is_active = not testimonial.is_active
    testimonial.updated_at = datetime.utcnow()
    await testimonial.save()
    return testimonial
