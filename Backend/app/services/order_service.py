"""
order_service.py - Order Business Logic Helpers
CSV export and order aggregation utilities.
"""

import csv
import io
from typing import List
from app.models.order import Order
import logging

logger = logging.getLogger(__name__)


async def export_orders_to_csv(orders: List[Order]) -> str:
    """
    Convert a list of Order documents to a CSV string.
    Returns the CSV content as a string ready for StreamingResponse.
    Includes all columns needed for accounting and operations review.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    # Header row
    writer.writerow([
        "Order Number",
        "Customer Name",
        "Phone",
        "Email",
        "City",
        "Items",
        "Subtotal (₹)",
        "Delivery (₹)",
        "GST (₹)",
        "Total (₹)",
        "Payment Method",
        "Payment Status",
        "Order Status",
        "Date",
    ])

    # Data rows
    for order in orders:
        items_summary = "; ".join(
            f"{item.get('name', '')} x{item.get('qty', 1)}"
            for item in order.items
        )
        writer.writerow([
            order.order_number,
            order.customer_name,
            order.customer_phone,
            order.customer_email or "",
            order.city,
            items_summary,
            order.subtotal,
            order.delivery_charge,
            order.gst_amount,
            order.total_amount,
            order.payment_method.value,
            order.payment_status.value,
            order.order_status.value,
            order.created_at.strftime("%Y-%m-%d %H:%M"),
        ])

    return output.getvalue()


async def get_monthly_revenue(year: int, month: int) -> float:
    """
    Sum total_amount for all DELIVERED orders in a given year/month.
    """
    from datetime import datetime
    from app.models.order import OrderStatus

    start = datetime(year, month, 1)
    # Last day of month
    if month == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, month + 1, 1)

    orders = await Order.find({
        "order_status": OrderStatus.DELIVERED.value,
        "created_at": {"$gte": start, "$lt": end},
    }).to_list()

    return sum(o.total_amount for o in orders)
