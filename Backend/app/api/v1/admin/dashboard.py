"""
dashboard.py - Admin Dashboard KPI + Activity Feed Endpoints
GET /stats            — dashboard KPI numbers
GET /recent-activity  — last 10 events across all collections
"""

import asyncio
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from datetime import datetime, date

from app.core.dependencies import get_admin_user
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.enquiry import Enquiry, EnquiryStatus
from app.models.order import Order, OrderStatus
from app.models.service_booking import ServiceBooking
from app.models.notification import Notification
from app.models.battery_swap import BatterySwap, SwapStatus

router = APIRouter()


class DashboardStats(BaseModel):
    """Top-level KPIs shown on the admin dashboard homepage."""
    total_products: int
    total_customers: int
    pending_enquiries: int
    unread_enquiries: int
    pending_orders: int
    total_orders: int
    confirmed_orders: int
    today_orders: int
    month_orders: int
    service_bookings_today: int
    total_service_bookings: int
    pending_service_bookings: int
    revenue_this_month: float
    revenue_today: float
    revenue_total: float
    new_customers_today: int
    new_customers_month: int
    total_battery_swaps: int
    pending_battery_swaps: int
    unread_notifications: int
    recent_orders: List[dict] = []
    recent_enquiries: List[dict] = []


class ActivityItem(BaseModel):
    """A single recent activity entry shown in the activity feed."""
    type: str
    id: str
    description: str
    timestamp: datetime


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(admin: User = Depends(get_admin_user)):
    """
    Return aggregated KPI numbers for the admin dashboard.
    Runs multiple MongoDB count queries concurrently for minimum latency.
    """
    today = date.today()
    today_start = datetime(today.year, today.month, today.day, 0, 0, 0)
    today_end = datetime(today.year, today.month, today.day, 23, 59, 59)
    month_start = datetime(today.year, today.month, 1)

    (
        total_products,
        total_customers,
        pending_enquiries,
        unread_enquiries,
        pending_orders,
        confirmed_orders,
        total_orders,
        today_orders,
        month_orders,
        bookings_today,
        total_bookings,
        pending_bookings,
        unread_notifications,
        new_customers_today,
        new_customers_month,
        total_swaps,
        pending_swaps,
    ) = await asyncio.gather(
        Product.find({"is_active": True}).count(),
        User.find({"role": UserRole.CUSTOMER.value}).count(),
        Enquiry.find({"status": EnquiryStatus.NEW.value}).count(),
        Enquiry.find({"is_read": False}).count(),
        Order.find({"order_status": OrderStatus.PENDING.value}).count(),
        Order.find({"order_status": OrderStatus.CONFIRMED.value}).count(),
        Order.count(),
        Order.find({"created_at": {"$gte": today_start, "$lte": today_end}}).count(),
        Order.find({"created_at": {"$gte": month_start}}).count(),
        ServiceBooking.find({
            "created_at": {"$gte": today_start, "$lte": today_end}
        }).count(),
        ServiceBooking.count(),
        ServiceBooking.find({"status": "Booked"}).count(),
        Notification.find({"is_read": False}).count(),
        User.find({"role": UserRole.CUSTOMER.value, "created_at": {"$gte": today_start}}).count(),
        User.find({"role": UserRole.CUSTOMER.value, "created_at": {"$gte": month_start}}).count(),
        BatterySwap.find({"is_deleted": False}).count(),
        BatterySwap.find({"is_deleted": False, "status": SwapStatus.PENDING.value}).count(),
    )

    # Revenue: sum delivered orders (all-time, this month, today)
    delivered_all = await Order.find({"order_status": OrderStatus.DELIVERED.value}).to_list()
    revenue_total = sum(o.total_amount for o in delivered_all)
    revenue_this_month = sum(
        o.total_amount for o in delivered_all if o.created_at >= month_start
    )
    revenue_today = sum(
        o.total_amount for o in delivered_all if today_start <= o.created_at <= today_end
    )

    recent_orders_docs = await Order.find().sort(-Order.created_at).limit(10).to_list()
    recent_enquiries_docs = await Enquiry.find().sort(-Enquiry.created_at).limit(5).to_list()

    return DashboardStats(
        total_products=total_products,
        total_customers=total_customers,
        pending_enquiries=pending_enquiries,
        unread_enquiries=unread_enquiries,
        pending_orders=pending_orders,
        confirmed_orders=confirmed_orders,
        total_orders=total_orders,
        today_orders=today_orders,
        month_orders=month_orders,
        service_bookings_today=bookings_today,
        total_service_bookings=total_bookings,
        pending_service_bookings=pending_bookings,
        revenue_this_month=revenue_this_month,
        revenue_today=revenue_today,
        revenue_total=revenue_total,
        new_customers_today=new_customers_today,
        new_customers_month=new_customers_month,
        total_battery_swaps=total_swaps,
        pending_battery_swaps=pending_swaps,
        unread_notifications=unread_notifications,
        recent_orders=[
            {
                "order_number": o.order_number,
                "customer_name": o.customer_name,
                "total_amount": o.total_amount,
                "order_status": o.order_status.value,
                "created_at": o.created_at.isoformat(),
            }
            for o in recent_orders_docs
        ],
        recent_enquiries=[
            {
                "id": str(e.id),
                "name": e.name,
                "enquiry_type": e.enquiry_type.value,
                "phone": e.phone,
                "status": e.status.value,
                "created_at": e.created_at.isoformat(),
            }
            for e in recent_enquiries_docs
        ],
    )


@router.get("/recent-activity", response_model=List[ActivityItem])
async def get_recent_activity(admin: User = Depends(get_admin_user)):
    """
    Return the 10 most recent events across enquiries, orders, and service bookings.
    Merges and sorts three collections by created_at descending.
    """
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

    activity.sort(key=lambda x: x.timestamp, reverse=True)
    return activity[:10]
