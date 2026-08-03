"""
public_settings.py - Public Site Settings Endpoint
Exposes only the subset of SiteSettings safe to show to anonymous visitors
(tagline/banner/social/contact copy) without admin auth. The full settings
document (notification toggles, business rules, etc.) stays behind
/admin/settings.
"""

from fastapi import APIRouter
from app.models.site_settings import SiteSettings

router = APIRouter(prefix="/settings", tags=["Public Settings"])


@router.get("")
async def get_public_settings():
    """Public: return the subset of site settings the storefront needs to render."""
    settings = await SiteSettings.get_site_settings()
    return {
        "company_name": settings.company_name,
        "company_phone": settings.company_phone,
        "company_email": settings.company_email,
        "company_address": settings.company_address,
        "company_tagline": settings.company_tagline,
        "facebook_url": settings.facebook_url,
        "instagram_url": settings.instagram_url,
        "linkedin_url": settings.linkedin_url,
        "youtube_url": settings.youtube_url,
        "whatsapp_number": settings.whatsapp_number,
        "business_hours": settings.business_hours,
        "service_areas": settings.service_areas,
        "hero_tagline": settings.hero_tagline,
        "hero_heading": settings.hero_heading,
        "hero_subheading": settings.hero_subheading,
        "hero_rotating_words": settings.hero_rotating_words,
        "stats_customers": settings.stats_customers,
        "stats_cities": settings.stats_cities,
        "stats_rating": settings.stats_rating,
        "stats_satisfaction": settings.stats_satisfaction,
        "footer_tagline": settings.footer_tagline,
        "footer_description": settings.footer_description,
        "announcement_banner_enabled": settings.announcement_banner_enabled,
        "announcement_banner_text": settings.announcement_banner_text,
        "announcement_banner_link": settings.announcement_banner_link,
        "announcement_banner_emoji": settings.announcement_banner_emoji,
        "announcement_banner_type": settings.announcement_banner_type,
        "whatsapp_message_template": settings.whatsapp_message_template,
        "maintenance_mode": settings.maintenance_mode,
        "maintenance_message": settings.maintenance_message,
    }
