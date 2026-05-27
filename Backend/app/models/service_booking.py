"""
service_booking.py - Service Booking Document Model
Tracks service requests from initial booking through technician completion.
"""

from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime, date
from enum import Enum


class TimeSlot(str, Enum):
    MORNING = "morning"       # 9 AM – 12 PM
    AFTERNOON = "afternoon"   # 12 PM – 4 PM
    EVENING = "evening"       # 4 PM – 7 PM


class BookingStatus(str, Enum):
    BOOKED = "booked"
    ASSIGNED = "assigned"          # Technician assigned by admin
    IN_PROGRESS = "in_progress"    # Technician currently on site
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ServiceBooking(Document):
    """
    ServiceBooking document in the 'service_bookings' MongoDB collection.
    """

    # Human-readable booking number shown to customer
    # Format: KB-2024-00001
    booking_number: str

    # Customer details
    name: str
    phone: str
    email: Optional[EmailStr] = None

    # Which service is needed: AC Repair, EV Charger Install, etc.
    service_type: str

    # Location used to dispatch the nearest technician
    city: str
    address: Optional[str] = None

    # Customer's preferred visit timing
    preferred_date: Optional[date] = None
    time_slot: Optional[TimeSlot] = None

    # Urgency level: normal / urgent
    urgency: str = "normal"

    # What the customer describes as the problem
    problem_description: str = ""

    # Name of assigned technician — populated by admin
    assigned_technician: Optional[str] = None

    # Booking lifecycle status
    status: BookingStatus = BookingStatus.BOOKED

    # Post-visit notes added by the technician
    technician_notes: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "service_bookings"
        indexes = ["booking_number", "status", "service_type", "city"]
