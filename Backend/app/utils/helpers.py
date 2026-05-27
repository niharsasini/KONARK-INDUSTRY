"""
helpers.py - Shared utility functions used across the application.
"""

import re
from datetime import datetime


def generate_order_number(sequence: int) -> str:
    """
    Generate a human-readable order number.
    Format: KI-YYYY-NNNNN (e.g. KI-2024-00042)
    The sequence integer comes from counting existing orders + 1.
    """
    year = datetime.utcnow().year
    return f"KI-{year}-{sequence:05d}"


def generate_booking_number(sequence: int) -> str:
    """
    Generate a human-readable service booking number.
    Format: KB-YYYY-NNNNN (e.g. KB-2024-00007)
    """
    year = datetime.utcnow().year
    return f"KB-{year}-{sequence:05d}"


def sanitize_phone(phone: str) -> str:
    """
    Strip all non-digit characters from a phone string.
    Returns the last 10 digits for Indian mobile numbers.
    Accepts formats: +91-9437611129, 09437611129, 9437611129
    """
    digits = re.sub(r"\D", "", phone)
    # Keep last 10 digits to normalise +91 prefix
    return digits[-10:] if len(digits) >= 10 else digits


def calculate_order_totals(subtotal: float) -> dict:
    """
    Calculate delivery charge and GST for an order subtotal.
    - Delivery: free if subtotal >= ₹5,000, else ₹199
    - GST: 18% of subtotal
    Returns a dict with subtotal, delivery_charge, gst_amount, total_amount.
    """
    delivery_charge = 0.0 if subtotal >= 5000 else 199.0
    gst_amount = round(subtotal * 0.18, 2)
    total_amount = round(subtotal + delivery_charge + gst_amount, 2)

    return {
        "subtotal": subtotal,
        "delivery_charge": delivery_charge,
        "gst_amount": gst_amount,
        "total_amount": total_amount,
    }
