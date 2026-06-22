"""
faqs.py - FAQ Endpoints
GET    /faqs        — public: active FAQs, sorted by display_order
POST   /faqs        — admin: create
PUT    /faqs/{id}   — admin: update
DELETE /faqs/{id}   — admin: delete
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.models.faq import FAQ
from app.core.dependencies import get_admin_user
from app.models.user import User

router = APIRouter(prefix="/faqs", tags=["FAQs"])


class FAQCreateRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=300)
    answer: str = Field(..., min_length=3, max_length=2000)
    category: str = "general"
    display_order: int = 0
    is_active: bool = True


class FAQUpdateRequest(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


@router.get("")
async def get_faqs():
    """Public: active FAQs, in display order."""
    return await FAQ.find(FAQ.is_active == True).sort(FAQ.display_order).to_list()


@router.get("/admin")
async def get_all_faqs_admin(admin: User = Depends(get_admin_user)):
    """Admin: every FAQ (active and inactive), in display order."""
    return await FAQ.find_all().sort(FAQ.display_order).to_list()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_faq(body: FAQCreateRequest, admin: User = Depends(get_admin_user)):
    faq = FAQ(**body.model_dump())
    await faq.insert()
    return faq


@router.put("/{faq_id}")
async def update_faq(
    faq_id: str, body: FAQUpdateRequest, admin: User = Depends(get_admin_user)
):
    faq = await FAQ.get(faq_id)
    if not faq:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "FAQ not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(faq, key, value)
    faq.updated_at = datetime.utcnow()
    await faq.save()
    return faq


@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faq(faq_id: str, admin: User = Depends(get_admin_user)):
    faq = await FAQ.get(faq_id)
    if not faq:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "FAQ not found")
    await faq.delete()
