"""
notification.py - Admin Notification Document Model
Auto-created whenever a new enquiry, order, or service booking arrives.
Admin sees these as an unread count + list in the dashboard.
"""

from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime
from enum import Enum


class NotificationType(str, Enum):
    ENQUIRY = "enquiry"             # New customer enquiry
    ORDER = "order"                 # New order placed
    BOOKING = "booking"             # New service booking
    TEST_RIDE = "test_ride"         # New test ride request
    PARTNER = "partner"             # New partner application
    SYSTEM = "system"               # Internal system alert


class Notification(Document):
    """
    Notification document in the 'notifications' MongoDB collection.
    One notification is created per significant event for the admin.
    """

    # Category so admin can filter by type
    type: NotificationType

    # Short headline shown in the notification bell dropdown
    title: str

    # Full detail message
    message: str

    # MongoDB document ID of the related entity (enquiry_id, order_id, etc.)
    entity_id: Optional[str] = None

    # False until the admin opens or dismisses the notification
    is_read: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"
        indexes = ["is_read", "type", "created_at"]
