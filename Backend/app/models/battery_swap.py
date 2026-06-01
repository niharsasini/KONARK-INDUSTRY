"""
battery_swap.py - Battery Swap Request Document Model
Tracks EV battery swap requests from submission to completion.
Token format: BSW-YYYY-XXXXX
"""

from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime, date
from enum import Enum


class SwapStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class BatteryType(str, Enum):
    LFP = "LFP"
    LEAD_ACID = "Lead Acid"
    NMC = "NMC"
    NOT_SURE = "Not Sure"


class BatteryCondition(str, Enum):
    GOOD = "Good"
    FAIR = "Fair"
    POOR = "Poor"


class SwapTimeSlot(str, Enum):
    MORNING = "Morning 9-12"
    AFTERNOON = "Afternoon 12-4"
    EVENING = "Evening 4-7"


class SwapLocation(str, Enum):
    HOME_PICKUP = "Home Pickup"
    VISIT_CENTER = "Visit Center"


class BatterySwap(Document):
    """
    BatterySwap document in the 'battery_swaps' MongoDB collection.
    Represents a single battery swap service request.
    """

    # Unique human-readable token shown to customer for tracking
    # Format: BSW-YYYY-XXXXX (e.g. BSW-2024-00042)
    token_number: str

    # ── Customer details ──────────────────────────────────────────────────────
    name: str
    phone: str
    email: Optional[EmailStr] = None
    city: str
    address: str

    # ── Battery details ───────────────────────────────────────────────────────
    battery_brand: str
    battery_capacity: str                       # e.g. "48V 100Ah"
    battery_type: BatteryType
    purchase_year: int
    current_charge_percent: int = 50            # 0–100
    battery_condition: BatteryCondition
    battery_serial_number: Optional[str] = None
    battery_photo_url: Optional[str] = None
    any_physical_damage: bool = False
    damage_description: Optional[str] = None

    # ── Swap schedule details ─────────────────────────────────────────────────
    preferred_date: date
    preferred_time_slot: SwapTimeSlot
    swap_location: SwapLocation
    special_instructions: Optional[str] = None

    # ── Admin-populated fields ────────────────────────────────────────────────
    assigned_technician: Optional[str] = None
    confirmed_date: Optional[date] = None
    confirmed_time_slot: Optional[str] = None
    technician_notes: Optional[str] = None
    swap_fee: float = 0.0
    is_read: bool = False
    admin_notes: Optional[str] = None

    # ── Lifecycle ─────────────────────────────────────────────────────────────
    status: SwapStatus = SwapStatus.PENDING
    is_deleted: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "battery_swaps"
        indexes = ["token_number", "status", "created_at", "phone"]
