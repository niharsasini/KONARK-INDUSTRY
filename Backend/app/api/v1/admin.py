"""
admin.py - Admin Dashboard Endpoints
GET /admin/stats           — dashboard KPI numbers
GET /admin/recent-activity — last 10 events across all collections
GET /admin/customers       — list all registered customers
PATCH /admin/customers/{id}/toggle — activate / deactivate an account
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, date

from app.core.dependencies import get_admin_user
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.enquiry import Enquiry, EnquiryStatus
from app.models.order import Order, OrderStatus
from app.models.service_booking import ServiceBooking

router = APIRouter(prefix="/admin", tags=["Admin"])


# ---------- Response schemas ----------

class DashboardStats(BaseModel):
    """Top-level KPIs shown on the admin dashboard homepage."""
    total_products: int
    total_customers: int
    pending_enquiries: int
    unread_enquiries: int
    pending_orders: int
    total_orders: int
    service_bookings_today: int
    total_service_bookings: int
    revenue_this_month: float


class ActivityItem(BaseModel):
    """A single recent activity entry shown in the activity feed."""
    type: str           # "enquiry" | "order" | "booking"
    id: str
    description: str
    timestamp: datetime


# ---------- Endpoints ----------

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(admin: User = Depends(get_admin_user)):
    """
    Return aggregated KPI numbers for the admin dashboard.
    Runs multiple MongoDB count queries concurrently for performance.
    revenue_this_month sums total_amount of all DELIVERED orders in the current month.
    """
    import asyncio

    # Today's date boundaries for the service-bookings-today count
    today = date.today()
    today_start = datetime(today.year, today.month, today.day, 0, 0, 0)
    today_end = datetime(today.year, today.month, today.day, 23, 59, 59)

    # Month boundaries for revenue calculation
    month_start = datetime(today.year, today.month, 1)

    # Run all counts concurrently to minimise latency
    (
        total_products,
        total_customers,
        pending_enquiries,
        unread_enquiries,
        pending_orders,
        total_orders,
        bookings_today,
        total_bookings,
    ) = await asyncio.gather(
        Product.find({"is_active": True}).count(),
        User.find({"role": UserRole.CUSTOMER.value}).count(),
        Enquiry.find({"status": EnquiryStatus.NEW.value}).count(),
        Enquiry.find({"is_read": False}).count(),
        Order.find({"order_status": OrderStatus.PENDING.value}).count(),
        Order.count(),
        ServiceBooking.find({
            "created_at": {"$gte": today_start, "$lte": today_end}
        }).count(),
        ServiceBooking.count(),
    )

    # Revenue: sum of delivered orders created this month
    delivered_orders = await Order.find({
        "order_status": OrderStatus.DELIVERED.value,
        "created_at": {"$gte": month_start},
    }).to_list()
    revenue_this_month = sum(o.total_amount for o in delivered_orders)

    return DashboardStats(
        total_products=total_products,
        total_customers=total_customers,
        pending_enquiries=pending_enquiries,
        unread_enquiries=unread_enquiries,
        pending_orders=pending_orders,
        total_orders=total_orders,
        service_bookings_today=bookings_today,
        total_service_bookings=total_bookings,
        revenue_this_month=revenue_this_month,
    )


@router.get("/recent-activity", response_model=List[ActivityItem])
async def get_recent_activity(admin: User = Depends(get_admin_user)):
    """
    Return the 10 most recent events across enquiries, orders, and service bookings.
    Merges and sorts all three lists by created_at descending.
    """
    import asyncio

    # Fetch latest 10 from each collection concurrently
    recent_enquiries, recent_orders, recent_bookings = await asyncio.gather(
        Enquiry.find().sort(-Enquiry.created_at).limit(10).to_list(),
        Order.find().sort(-Order.created_at).limit(10).to_list(),
        ServiceBooking.find().sort(-ServiceBooking.created_at).limit(10).to_list(),
    )

    activity: List[ActivityItem] = []

    for e in recent_enquiries:
        activity.append(ActivityItem(
            type="enquiry",
            id=str(e.id),
            description=f"New {e.enquiry_type.value.replace('_', ' ')} enquiry from {e.name} ({e.phone})",
            timestamp=e.created_at,
        ))

    for o in recent_orders:
        activity.append(ActivityItem(
            type="order",
            id=str(o.id),
            description=f"Order {o.order_number} placed by {o.customer_name} — ₹{o.total_amount:,.0f}",
            timestamp=o.created_at,
        ))

    for b in recent_bookings:
        activity.append(ActivityItem(
            type="booking",
            id=str(b.id),
            description=f"Service booking for {b.service_type} in {b.city} by {b.name}",
            timestamp=b.created_at,
        ))

    # Sort merged list newest first, return only the top 10
    activity.sort(key=lambda x: x.timestamp, reverse=True)
    return activity[:10]


@router.get("/customers", response_model=List[dict])
async def list_customers(
    skip: int = 0,
    limit: int = 50,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list all registered customers (non-admin users).
    Returns id, name, email, phone, city, is_active, created_at.
    """
    customers = (
        await User.find({"role": UserRole.CUSTOMER.value})
        .sort(-User.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "city": c.city,
            "is_active": c.is_active,
            "is_verified": c.is_verified,
            "created_at": c.created_at.isoformat(),
            "last_login": c.last_login.isoformat() if c.last_login else None,
        }
        for c in customers
    ]


@router.patch("/customers/{customer_id}/toggle")
async def toggle_customer_status(
    customer_id: str,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: flip a customer account between active and deactivated.
    Deactivated accounts cannot log in.
    """
    from fastapi import HTTPException, status as http_status

    customer = await User.get(customer_id)
    if not customer or customer.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    # Toggle the active flag
    customer.is_active = not customer.is_active
    customer.updated_at = datetime.utcnow()
    await customer.save()

    return {
        "id": str(customer.id),
        "is_active": customer.is_active,
        "message": f"Account {'activated' if customer.is_active else 'deactivated'} successfully",
    }
