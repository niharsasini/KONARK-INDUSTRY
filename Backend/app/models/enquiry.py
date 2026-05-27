"""
enquiry.py - Enquiry Document Model
Single collection handles all enquiry types (test ride, product, service, contact)
so admin sees everything in one dashboard view.
"""

from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime, date
from enum import Enum


class EnquiryType(str, Enum):
    TEST_RIDE = "test_ride"    # Customer wants to test an EV
    PRODUCT = "product"         # Question about a product or bulk order
    SERVICE = "service"         # Needs AC repair, wiring, etc.
    CONTACT = "contact"         # General contact form submission
    PARTNER = "partner"         # Distributor / partner application


class EnquiryStatus(str, Enum):
    NEW = "new"                   # Submitted, not yet seen by admin
    CONTACTED = "contacted"       # Admin called or emailed the customer
    IN_PROGRESS = "in_progress"   # Actively being handled
    RESOLVED = "resolved"         # Issue fully resolved
    CLOSED = "closed"             # Closed without resolution


class UrgencyLevel(str, Enum):
    NORMAL = "normal"
    MODERATE = "moderate"
    URGENT = "urgent"


class Enquiry(Document):
    """
    Enquiry document in the 'enquiries' MongoDB collection.
    """

    # Customer identification
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None

    # Determines how admin categorises and handles the enquiry
    enquiry_type: EnquiryType

    # Populated when the customer enquires about a specific product
    product_id: Optional[str] = None
    product_name: Optional[str] = None

    # For service-type enquiries — which service they need
    service_type: Optional[str] = None

    # Free-text message from the customer
    message: str = ""

    # Customer's city — used to dispatch nearest technician
    city: Optional[str] = None

    # How urgently they need a response
    urgency: UrgencyLevel = UrgencyLevel.NORMAL

    # When the customer wants the appointment or test ride
    preferred_date: Optional[date] = None

    # Lifecycle status updated by admin
    status: EnquiryStatus = EnquiryStatus.NEW

    # False until admin opens the enquiry detail view
    is_read: bool = False

    # Internal notes — never shown to customer
    admin_notes: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "enquiries"
        indexes = ["enquiry_type", "status", "is_read", "created_at"]
