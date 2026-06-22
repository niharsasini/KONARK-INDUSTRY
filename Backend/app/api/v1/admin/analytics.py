"""
analytics.py - Admin Analytics/Reports Endpoints
GET /analytics/daily              — last 30 days enquiries + orders per day
GET /analytics/top-products       — most ordered products
GET /analytics/revenue            — monthly revenue breakdown
GET /analytics/orders-by-status   — order counts grouped by status
GET /analytics/enquiries-by-type  — enquiry counts grouped by type
"""

import asyncio
from fastapi import APIRouter, Depends, Query
from datetime import datetime, timedelta

from app.core.dependencies import get_admin_user
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.models.enquiry import Enquiry, EnquiryType

router = APIRouter()


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


@router.get("/analytics/orders-by-status")
async def analytics_orders_by_status(admin: User = Depends(get_admin_user)):
    """Return order counts grouped by status, for the Reports page bar chart."""
    statuses = [s.value for s in OrderStatus]
    counts = await asyncio.gather(*[
        Order.find({"order_status": s}).count() for s in statuses
    ])
    return [{"status": s, "count": c} for s, c in zip(statuses, counts)]


@router.get("/analytics/enquiries-by-type")
async def analytics_enquiries_by_type(admin: User = Depends(get_admin_user)):
    """Return enquiry counts grouped by type, for the Reports page breakdown."""
    types = [t.value for t in EnquiryType]
    counts = await asyncio.gather(*[
        Enquiry.find({"enquiry_type": t}).count() for t in types
    ])
    return [{"type": t, "count": c} for t, c in zip(types, counts)]
