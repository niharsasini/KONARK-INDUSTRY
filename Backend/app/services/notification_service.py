"""
notification_service.py - Admin Notification Creator
Creates Notification documents when significant events occur.
Called from enquiries, orders, and service bookings endpoints.
"""

import logging
from app.models.notification import Notification, NotificationType

logger = logging.getLogger(__name__)


async def create_notification(
    type: NotificationType,
    title: str,
    message: str,
    entity_id: str = None,
) -> Notification:
    """
    Create and persist a new admin notification document.
    Called after inserting a new enquiry, order, or service booking.
    Returns the created notification for logging purposes.
    """
    notification = Notification(
        type=type,
        title=title,
        message=message,
        entity_id=entity_id,
    )
    await notification.insert()
    logger.info(f"Notification created: [{type.value}] {title}")
    return notification


async def notify_new_enquiry(enquiry_id: str, name: str, enquiry_type: str, phone: str):
    """
    Create a notification when a new customer enquiry arrives.
    Enquiry type is displayed in the notification title for quick scanning.
    """
    label = enquiry_type.replace("_", " ").title()
    await create_notification(
        type=NotificationType.ENQUIRY if enquiry_type != "test_ride" else NotificationType.TEST_RIDE,
        title=f"New {label} Enquiry",
        message=f"{name} ({phone}) submitted a {label.lower()} enquiry.",
        entity_id=enquiry_id,
    )


async def notify_new_order(order_id: str, order_number: str, customer_name: str, total: float):
    """
    Create a notification when a new order is placed.
    Includes the order total so admin can prioritise high-value orders.
    """
    await create_notification(
        type=NotificationType.ORDER,
        title=f"New Order: {order_number}",
        message=f"{customer_name} placed an order worth ₹{total:,.0f}.",
        entity_id=order_id,
    )


async def notify_new_booking(booking_id: str, booking_number: str, name: str, service_type: str, city: str):
    """
    Create a notification when a new service booking is submitted.
    Includes city so admin can assign the nearest technician.
    """
    await create_notification(
        type=NotificationType.BOOKING,
        title=f"New Service Booking: {service_type}",
        message=f"{name} booked {service_type} in {city}. Booking: {booking_number}",
        entity_id=booking_id,
    )


async def notify_new_partner(enquiry_id: str, name: str, phone: str):
    """
    Create a notification when a partner/distributor application arrives.
    """
    await create_notification(
        type=NotificationType.PARTNER,
        title="New Partner Application",
        message=f"{name} ({phone}) applied to become a distributor/partner.",
        entity_id=enquiry_id,
    )


async def get_unread_count() -> int:
    """
    Return the number of unread admin notifications.
    Used by the admin dashboard bell icon badge.
    """
    return await Notification.find({"is_read": False}).count()


async def mark_all_read():
    """
    Mark every unread notification as read.
    Called when admin clicks "mark all as read" in the dashboard.
    """
    unread = await Notification.find({"is_read": False}).to_list()
    for n in unread:
        n.is_read = True
        await n.save()
    return len(unread)
