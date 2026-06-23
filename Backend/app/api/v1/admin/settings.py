"""
settings.py - Admin Site Settings Endpoints
GET /settings — read site settings
PUT /settings — update site settings
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.core.dependencies import get_admin_user
from app.models.user import User
from app.models.site_settings import SiteSettings

router = APIRouter()


class SiteSettingsUpdate(BaseModel):
    """Fields admin can change in site settings — all optional."""
    company_name: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[str] = None
    company_address: Optional[str] = None
    company_tagline: Optional[str] = None
    company_about: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    business_hours: Optional[dict] = None
    service_areas: Optional[List[str]] = None
    free_delivery_above: Optional[float] = None
    delivery_charge: Optional[float] = None
    gst_rate: Optional[float] = None
    show_marquee: Optional[bool] = None
    hero_tagline: Optional[str] = None
    footer_tagline: Optional[str] = None
    announcement_banner_enabled: Optional[bool] = None
    announcement_banner_text: Optional[str] = None
    announcement_banner_link: Optional[str] = None
    announcement_banner_emoji: Optional[str] = None
    announcement_banner_type: Optional[str] = None
    whatsapp_message_template: Optional[str] = None
    maintenance_mode: Optional[bool] = None
    maintenance_message: Optional[str] = None
    notify_admin_on_enquiry: Optional[bool] = None
    notify_admin_on_order: Optional[bool] = None
    notify_admin_on_booking: Optional[bool] = None
    notify_daily_summary: Optional[bool] = None
    notify_weekly_report: Optional[bool] = None
    technicians: Optional[List[str]] = None


@router.get("/settings")
async def get_settings(admin: User = Depends(get_admin_user)):
    """
    Admin: return the current site settings document.
    Creates the settings document with defaults if it doesn't exist yet.
    """
    settings = await SiteSettings.get_site_settings()
    # Return as dict — exclude MongoDB internals
    data = settings.model_dump(exclude={"id", "revision_id"})
    data["id"] = str(settings.id)
    return data


@router.put("/settings")
async def update_settings(
    body: SiteSettingsUpdate,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: update one or more site setting fields.
    Only provided fields are changed — all others remain as-is.
    """
    settings = await SiteSettings.get_site_settings()

    update_data = body.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(settings, field, value)

    settings.updated_at = datetime.utcnow()
    await settings.save()

    data = settings.model_dump(exclude={"id", "revision_id"})
    data["id"] = str(settings.id)
    return data
