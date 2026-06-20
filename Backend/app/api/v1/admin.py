"""
admin.py - Admin Dashboard Endpoints
GET  /admin/stats               — dashboard KPI numbers
GET  /admin/recent-activity     — last 10 events across all collections
GET  /admin/customers           — list all registered customers
GET  /admin/customers/export    — download customers as CSV
GET  /admin/customers/{id}      — single customer detail
PATCH /admin/customers/{id}/toggle — activate / deactivate account

Analytics:
GET  /admin/analytics/daily         — last 30 days enquiries + orders per day
GET  /admin/analytics/top-products  — most ordered products
GET  /admin/analytics/revenue       — monthly revenue breakdown

Settings:
GET  /admin/settings    — read site settings
PUT  /admin/settings    — update site settings

Notifications:
GET   /admin/notifications         — unread count + list
PATCH /admin/notifications/{id}/read — mark one as read
POST  /admin/notifications/mark-all-read — mark all as read
"""

import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status as http_status, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime, date, timedelta

from app.core.dependencies import get_admin_user
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.enquiry import Enquiry, EnquiryStatus
from app.models.order import Order, OrderStatus
from app.models.service_booking import ServiceBooking
from app.models.notification import Notification, NotificationType
from app.models.site_settings import SiteSettings

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
    unread_notifications: int


class ActivityItem(BaseModel):
    """A single recent activity entry shown in the activity feed."""
    type: str
    id: str
    description: str
    timestamp: datetime


class NotificationResponse(BaseModel):
    """Notification fields returned in API responses."""
    id: str
    type: str
    title: str
    message: str
    entity_id: Optional[str]
    is_read: bool
    created_at: datetime


class SiteSettingsUpdate(BaseModel):
    """Fields admin can change in site settings — all optional."""
    company_name: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[str] = None
    company_address: Optional[str] = None
    company_tagline: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    free_delivery_above: Optional[float] = None
    delivery_charge: Optional[float] = None
    gst_rate: Optional[float] = None
    show_marquee: Optional[bool] = None
    hero_tagline: Optional[str] = None
    footer_tagline: Optional[str] = None
    announcement_banner_enabled: Optional[bool] = None
    announcement_banner_text: Optional[str] = None
    whatsapp_message_template: Optional[str] = None
    maintenance_mode: Optional[bool] = None
    maintenance_message: Optional[str] = None
    notify_admin_on_enquiry: Optional[bool] = None
    notify_admin_on_order: Optional[bool] = None
    notify_admin_on_booking: Optional[bool] = None
    technicians: Optional[List[str]] = None


# ---------- Dashboard ----------

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(admin: User = Depends(get_admin_user)):
    """
    Return aggregated KPI numbers for the admin dashboard.
    Runs multiple MongoDB count queries concurrently for minimum latency.
    """
    import asyncio

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
        total_orders,
        bookings_today,
        total_bookings,
        unread_notifications,
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
        Notification.find({"is_read": False}).count(),
    )

    # Revenue: sum delivered orders created this month
    delivered = await Order.find({
        "order_status": OrderStatus.DELIVERED.value,
        "created_at": {"$gte": month_start},
    }).to_list()
    revenue_this_month = sum(o.total_amount for o in delivered)

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
        unread_notifications=unread_notifications,
    )


@router.get("/recent-activity", response_model=List[ActivityItem])
async def get_recent_activity(admin: User = Depends(get_admin_user)):
    """
    Return the 10 most recent events across enquiries, orders, and service bookings.
    Merges and sorts three collections by created_at descending.
    """
    import asyncio

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


# ---------- Customers ----------

@router.get("/customers", response_model=List[dict])
async def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list all registered customer accounts, newest first.
    """
    customers = (
        await User.find({"role": UserRole.CUSTOMER.value})
        .sort(-User.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_customer_dict(c) for c in customers]


@router.get("/customers/export")
async def export_customers_csv(admin: User = Depends(get_admin_user)):
    """
    Admin: download all customers as a CSV file.
    """
    customers = await User.find({"role": UserRole.CUSTOMER.value}).sort(-User.created_at).to_list()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Phone", "City", "Active", "Verified", "Registered"])
    for c in customers:
        writer.writerow([
            c.name, c.email, c.phone, c.city or "",
            "Yes" if c.is_active else "No",
            "Yes" if c.is_verified else "No",
            c.created_at.strftime("%Y-%m-%d"),
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=konark_customers.csv"},
    )


@router.get("/customers/{customer_id}", response_model=dict)
async def get_customer(customer_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: return full detail for a single customer including order count and last order.
    """
    customer = await User.get(customer_id)
    if not customer or customer.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    # Fetch customer's orders for context
    orders = await Order.find({"user_id": customer_id}).sort(-Order.created_at).to_list()
    total_spent = sum(o.total_amount for o in orders)

    result = _customer_dict(customer)
    result["order_count"] = len(orders)
    result["total_spent"] = total_spent
    result["recent_orders"] = [
        {
            "order_number": o.order_number,
            "total_amount": o.total_amount,
            "order_status": o.order_status.value,
            "created_at": o.created_at.isoformat(),
        }
        for o in orders[:5]
    ]
    return result


@router.patch("/customers/{customer_id}/toggle")
async def toggle_customer_status(customer_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: flip a customer account between active and deactivated.
    Deactivated accounts cannot log in.
    """
    customer = await User.get(customer_id)
    if not customer or customer.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    customer.is_active = not customer.is_active
    customer.updated_at = datetime.utcnow()
    await customer.save()

    return {
        "id": str(customer.id),
        "is_active": customer.is_active,
        "message": f"Account {'activated' if customer.is_active else 'deactivated'} successfully",
    }


def _customer_dict(c: User) -> dict:
    """Convert User document to a plain dict for customer API responses."""
    return {
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


# ---------- Analytics ----------

@router.get("/analytics/daily")
async def analytics_daily(
    days: int = Query(30, ge=7, le=90, description="Number of past days to include"),
    admin: User = Depends(get_admin_user),
):
    """
    Return daily counts of enquiries and orders for the last N days.
    Used to render the line chart on the admin analytics page.
    Returns a list of {date, enquiries, orders} dicts sorted oldest first.
    """
    since = datetime.utcnow() - timedelta(days=days)

    enquiries = await Enquiry.find({"created_at": {"$gte": since}}).to_list()
    orders = await Order.find({"created_at": {"$gte": since}}).to_list()

    # Build a dict keyed by date string for fast lookup
    daily: dict = {}
    for i in range(days):
        d = (datetime.utcnow() - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
        daily[d] = {"date": d, "enquiries": 0, "orders": 0}

    for e in enquiries:
        d = e.created_at.strftime("%Y-%m-%d")
        if d in daily:
            daily[d]["enquiries"] += 1

    for o in orders:
        d = o.created_at.strftime("%Y-%m-%d")
        if d in daily:
            daily[d]["orders"] += 1

    return list(daily.values())


@router.get("/analytics/top-products")
async def analytics_top_products(
    limit: int = Query(10, ge=1, le=50),
    admin: User = Depends(get_admin_user),
):
    """
    Return the top N most ordered products by unit count.
    Scans all orders and aggregates item quantities.
    """
    orders = await Order.find().to_list()

    # Aggregate quantity per product
    product_counts: dict = {}
    for order in orders:
        for item in order.items:
            pid = item.get("product_id", "")
            name = item.get("name", "Unknown")
            qty = item.get("qty", 1)
            if pid not in product_counts:
                product_counts[pid] = {"product_id": pid, "name": name, "total_qty": 0, "total_revenue": 0}
            product_counts[pid]["total_qty"] += qty
            product_counts[pid]["total_revenue"] += qty * item.get("price", 0)

    # Sort by total quantity and return top N
    top = sorted(product_counts.values(), key=lambda x: x["total_qty"], reverse=True)
    return top[:limit]


@router.get("/analytics/revenue")
async def analytics_revenue(
    months: int = Query(12, ge=1, le=24, description="Number of past months"),
    admin: User = Depends(get_admin_user),
):
    """
    Return monthly revenue totals for the last N months.
    Only counts orders with status DELIVERED.
    Returns a list of {month, revenue, order_count} dicts.
    """
    result = []
    now = datetime.utcnow()

    for i in range(months - 1, -1, -1):
        # Calculate the target month
        month_offset = (now.month - 1 - i) % 12 + 1
        year_offset = now.year - ((i - now.month + 1) // 12 + (1 if (i - now.month + 1) >= 0 else 0))
        # Simpler approach: subtract months
        target = now.replace(day=1) - timedelta(days=1)
        # Build start/end for each month from the past `months` months
        month_num = (now.month - 1 - i) % 12
        year_num = now.year - ((i + 12 - now.month) // 12) if (now.month - 1 - i) < 0 else now.year - (i // 12)
        # Clean calculation
        total_months_ago = i
        m = ((now.month - 1 - total_months_ago) % 12) + 1
        y = now.year + ((now.month - 1 - total_months_ago) // 12)

        start = datetime(y, m, 1)
        if m == 12:
            end = datetime(y + 1, 1, 1)
        else:
            end = datetime(y, m + 1, 1)

        month_orders = await Order.find({
            "order_status": OrderStatus.DELIVERED.value,
            "created_at": {"$gte": start, "$lt": end},
        }).to_list()

        result.append({
            "month": start.strftime("%Y-%m"),
            "month_label": start.strftime("%b %Y"),
            "revenue": sum(o.total_amount for o in month_orders),
            "order_count": len(month_orders),
        })

    return result


# ---------- Settings ----------

@router.get("/settings")
async def get_settings(admin: User = Depends(get_admin_user)):
    """
    Admin: return the current site settings document.
    Creates the settings document with defaults if it doesn't exist yet.
    """
    settings = await SiteSettings.get_site_settings()
    # Return as dict — exclude MongoDB internals
    data = settings.model_dump(exclude={"id", "revision_id"})
    data["id"] = str(settings.id)
    return data


@router.put("/settings")
async def update_settings(
    body: SiteSettingsUpdate,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: update one or more site setting fields.
    Only provided fields are changed — all others remain as-is.
    """
    settings = await SiteSettings.get_site_settings()

    update_data = body.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(settings, field, value)

    settings.updated_at = datetime.utcnow()
    await settings.save()

    data = settings.model_dump(exclude={"id", "revision_id"})
    data["id"] = str(settings.id)
    return data


# ---------- Notifications ----------

@router.get("/notifications")
async def list_notifications(
    unread_only: bool = Query(False, description="If true, return only unread notifications"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list notifications with unread count.
    Returns {unread_count, notifications: [...]} so the frontend can update the bell badge.
    """
    query_filter = {}
    if unread_only:
        query_filter["is_read"] = False

    notifications = (
        await Notification.find(query_filter)
        .sort(-Notification.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    unread_count = await Notification.find({"is_read": False}).count()

    return {
        "unread_count": unread_count,
        "notifications": [_notification_dict(n) for n in notifications],
    }


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: mark a single notification as read.
    Called when the admin clicks a notification item in the dropdown.
    """
    notification = await Notification.get(notification_id)
    if not notification:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    notification.is_read = True
    await notification.save()
    return _notification_dict(notification)


@router.post("/notifications/mark-all-read")
async def mark_all_notifications_read(admin: User = Depends(get_admin_user)):
    """
    Admin: mark every unread notification as read in one operation.
    Called by the "Mark All Read" button in the notification dropdown.
    """
    from app.services.notification_service import mark_all_read
    count = await mark_all_read()
    return {"marked_read": count, "message": f"{count} notifications marked as read"}


def _notification_dict(n: Notification) -> dict:
    """Convert Notification document to a plain dict."""
    return {
        "id": str(n.id),
        "type": n.type.value,
        "title": n.title,
        "message": n.message,
        "entity_id": n.entity_id,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat(),
    }
