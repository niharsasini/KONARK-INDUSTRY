"""
notifications.py - Admin Notification Endpoints
GET   /notifications              — unread count + list
PATCH /notifications/{id}/read    — mark one as read
POST  /notifications/mark-all-read — mark all as read
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.core.dependencies import get_admin_user
from app.models.user import User
from app.models.notification import Notification

router = APIRouter()


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
            status_code=status.HTTP_404_NOT_FOUND,
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
