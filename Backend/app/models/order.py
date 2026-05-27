"""
order.py - Order Document Model
Items are stored as embedded dicts (not references) so order history
is preserved exactly as placed, even if product prices change later.
"""

from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class PaymentMethod(str, Enum):
    UPI = "upi"
    COD = "cod"        # Cash on delivery
    ONLINE = "online"  # Card / net banking


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PACKED = "packed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Document):
    """
    Order document in the 'orders' MongoDB collection.
    Stores a complete snapshot of the order at purchase time.
    """

    # Human-readable order number shown on invoices and emails
    # Format: KI-2024-00001
    order_number: str

    # None for guest checkouts
    user_id: Optional[str] = None

    # Customer snapshot — stored so profile changes don't affect order history
    customer_name: str
    customer_phone: str
    customer_email: Optional[EmailStr] = None

    # Each dict: {product_id, name, category, qty, price, image}
    # Snapshot at purchase time so price changes don't alter history
    items: List[Dict[str, Any]] = []

    # Price breakdown shown on invoice
    subtotal: float = 0
    # Free delivery for orders above ₹5,000; otherwise ₹199
    delivery_charge: float = 0
    # 18% GST applied to product subtotal
    gst_amount: float = 0
    # Final amount charged to the customer
    total_amount: float = 0

    # Delivery location
    delivery_address: str
    city: str
    pincode: str = ""
    state: str = "Odisha"

    # Payment info
    payment_method: PaymentMethod = PaymentMethod.COD
    payment_status: PaymentStatus = PaymentStatus.PENDING

    # Fulfillment lifecycle
    order_status: OrderStatus = OrderStatus.PENDING

    # Optional special instructions from customer
    notes: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
        indexes = ["order_number", "user_id", "order_status", "created_at"]
