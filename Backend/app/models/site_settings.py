"""
site_settings.py - Site Settings Document Model
Stores a single document (singleton pattern) with all admin-configurable settings.
Use SiteSettings.get_site_settings() to always get or create the one document.
"""

from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime


class SiteSettings(Document):
    """
    SiteSettings document in the 'site_settings' MongoDB collection.
    Only one document should exist — identified by settings_key="global".
    """

    # Sentinel field so we can always find the single settings doc
    settings_key: str = "global"

    # --- Company Info ---
    company_name: str = "Konark Industry"
    company_phone: str = "+919437611129"
    company_email: str = "konarkindustrie@gmail.com"
    company_address: str = "Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002"
    company_tagline: str = "Powering Odisha's Green Future"
    # Long-form "About" text shown in the admin Company Info section
    company_about: Optional[str] = None

    # --- Social Links ---
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    whatsapp_number: str = "919437611129"

    # --- Business Hours ---
    # Per-day schedule: { "Monday": {"open": true, "from": "09:00", "to": "18:00"}, ... }
    business_hours: dict = Field(default_factory=dict)

    # --- Service Areas ---
    # Cities where Konark offers service/installation
    service_areas: list = Field(default_factory=lambda: [
        "Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Berhampur", "Sambalpur",
    ])

    # --- Business Rules ---
    # Free delivery threshold in INR
    free_delivery_above: float = 5000
    # Flat delivery charge below the threshold
    delivery_charge: float = 199
    # GST percentage applied to product orders
    gst_rate: float = 18.0

    # --- Homepage Settings ---
    # Product slugs to pin as featured on homepage
    homepage_featured_slugs: list = []
    # Whether the marquee strip is visible
    show_marquee: bool = True
    # Hero section tagline override
    hero_tagline: Optional[str] = None
    # Footer tagline shown under the logo in the site footer
    footer_tagline: Optional[str] = None

    # --- Announcement Banner ---
    # Whether the top-of-site announcement banner is visible
    announcement_banner_enabled: bool = False
    # Text shown in the announcement banner
    announcement_banner_text: str = ""
    # Optional link/CTA the banner text points to
    announcement_banner_link: Optional[str] = None
    # Emoji shown at the start of the banner text
    announcement_banner_emoji: str = "🎉"
    # Visual style/category — one of: announcement, new_product, offer, event, alert
    announcement_banner_type: str = "announcement"

    # --- WhatsApp ---
    # Pre-filled message template used by the floating WhatsApp button
    whatsapp_message_template: str = "Hi Konark Industry, I have a query"

    # --- Maintenance Mode ---
    # True shows a maintenance banner — API still works but frontend shows warning
    maintenance_mode: bool = False
    maintenance_message: str = "We'll be back shortly. Thank you for your patience."

    # --- Technicians ---
    # Names available for assignment in Service Bookings and Battery Swap admin pages
    technicians: list = Field(default_factory=lambda: [
        "Ramesh Kumar",
        "Bikash Patel",
        "Sanjay Nayak",
        "Dilip Sahoo",
    ])

    # --- Email Notifications ---
    # Whether to send alert emails to admin on new enquiries
    notify_admin_on_enquiry: bool = True
    notify_admin_on_order: bool = True
    notify_admin_on_booking: bool = True
    notify_daily_summary: bool = False
    notify_weekly_report: bool = True

    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "site_settings"
        indexes = ["settings_key"]

    @classmethod
    async def get_site_settings(cls) -> "SiteSettings":
        """
        Always returns the single settings document.
        Creates it with defaults if it doesn't exist yet.
        NOTE: Named get_site_settings (not get_settings) to avoid overriding
        Beanie's internal Document.get_settings() which returns DocumentSettings.
        """
        settings = await cls.find_one({"settings_key": "global"})
        if not settings:
            settings = cls()
            await settings.insert()
        return settings
