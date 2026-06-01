"""
battery_swap_service.py - Business logic for the battery swap module.
Handles token generation, fee calculation, and slot availability.
"""

from datetime import datetime, date
from typing import List

from app.models.battery_swap import BatterySwap, SwapStatus, SwapTimeSlot


async def generate_swap_token() -> str:
    """
    Generate a unique token in the format BSW-YYYY-XXXXX.
    Counts existing documents to derive the sequence, then verifies uniqueness
    because concurrent inserts could produce the same count.
    """
    year = datetime.utcnow().year
    # Count all documents (including deleted) to get a monotonically increasing base
    count = await BatterySwap.count()
    candidate = f"BSW-{year}-{count + 1:05d}"

    # Ensure no collision — increment until we find an unused token
    while await BatterySwap.find_one(BatterySwap.token_number == candidate):
        count += 1
        candidate = f"BSW-{year}-{count + 1:05d}"

    return candidate


def calculate_swap_fee(battery_capacity: str, battery_type: str) -> float:
    """
    Estimate the swap service fee based on battery specs.
    Returns a float fee in INR. This is an estimate; admin confirms exact fee after inspection.

    Pricing logic:
      - Lead Acid → ₹80 flat (simpler chemistry, easier swap)
      - LFP high-voltage (72V) → ₹250
      - LFP standard (48–60V 100Ah+) → ₹180
      - LFP standard (48V <100Ah) → ₹120
      - NMC → ₹200
      - Default / Not Sure → ₹150
    """
    capacity_lower = battery_capacity.lower()
    btype = battery_type.strip()

    if "lead acid" in btype.lower():
        return 80.0

    if "nmc" in btype.lower():
        return 200.0

    if "lfp" in btype.lower():
        if "72v" in capacity_lower:
            return 250.0
        if "60v" in capacity_lower:
            return 180.0
        if "48v" in capacity_lower:
            # Differentiate by Ah rating
            if "100ah" in capacity_lower:
                return 180.0
            return 120.0
        return 150.0

    return 150.0


async def get_available_slots(requested_date: date) -> List[str]:
    """
    Return which time slots are still available on the requested date.
    A maximum of 10 swaps are accepted per day.
    If a slot has ≥4 bookings, it is considered full for that slot.
    Returns a list of available SwapTimeSlot values.
    """
    MAX_PER_DAY = 10
    MAX_PER_SLOT = 4

    # Count active bookings (not cancelled) for the date
    day_bookings = await BatterySwap.find(
        BatterySwap.preferred_date == requested_date,
        BatterySwap.status != SwapStatus.CANCELLED,
        BatterySwap.is_deleted == False,
    ).to_list()

    if len(day_bookings) >= MAX_PER_DAY:
        return []

    # Count per slot
    slot_counts = {}
    for b in day_bookings:
        slot_val = b.preferred_time_slot.value if b.preferred_time_slot else ""
        slot_counts[slot_val] = slot_counts.get(slot_val, 0) + 1

    available = []
    for slot in SwapTimeSlot:
        if slot_counts.get(slot.value, 0) < MAX_PER_SLOT:
            available.append(slot.value)

    return available
