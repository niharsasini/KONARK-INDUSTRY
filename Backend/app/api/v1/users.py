"""
users.py - Customer-Facing Endpoints
GET /users/notifications — status updates for the logged-in customer's own
                            orders, service bookings, and battery swaps.

Unlike app/models/notification.py (admin-only alerts with no user_id),
this endpoint synthesizes a feed on the fly from the customer's own
records, since orders carry user_id but bookings/swaps only carry phone.
"""

from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import datetime

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.order import Order
from app.models.service_booking import ServiceBooking
from app.models.battery_swap import BatterySwap

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/notifications")
async def get_my_notifications(
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    """
    Return a synthesized notification feed for the logged-in customer:
    current status of their own orders (by user_id) and service bookings /
    battery swaps (matched by phone number, since those forms are guest-friendly
    and don't store user_id).
    """
    orders = (
        await Order.find({"user_id": str(current_user.id)})
        .sort(-Order.updated_at)
        .limit(limit)
        .to_list()
    )
    bookings = (
        await ServiceBooking.find({"phone": current_user.phone})
        .sort(-ServiceBooking.updated_at)
        .limit(limit)
        .to_list()
    )
    swaps = (
        await BatterySwap.find({"phone": current_user.phone})
        .sort(-BatterySwap.updated_at)
        .limit(limit)
        .to_list()
    )

    items: List[dict] = []

    for o in orders:
        items.append({
            "id": f"order-{o.id}",
            "type": "order",
            "title": f"Order {o.order_number}",
            "message": f"Status: {o.order_status.value.capitalize()}",
            "created_at": o.updated_at,
        })

    for b in bookings:
        items.append({
            "id": f"booking-{b.id}",
            "type": "booking",
            "title": f"Service Booking {b.booking_number}",
            "message": f"{b.service_type} — Status: {b.status.value.replace('_', ' ').capitalize()}",
            "created_at": b.updated_at,
        })

    for s in swaps:
        items.append({
            "id": f"swap-{s.id}",
            "type": "battery_swap",
            "title": f"Battery Swap {s.token_number}",
            "message": f"Status: {s.status.value.replace('_', ' ').capitalize()}",
            "created_at": s.updated_at,
        })

    items.sort(key=lambda x: x["created_at"], reverse=True)
    items = items[:limit]

    for item in items:
        item["created_at"] = item["created_at"].isoformat()

    return {"notifications": items}
