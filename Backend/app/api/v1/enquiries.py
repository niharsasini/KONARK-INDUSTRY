"""
enquiries.py - Customer Enquiry Endpoints
POST /enquiries              — public: submit an enquiry
GET  /enquiries              — admin: list with filters
GET  /enquiries/{id}         — admin: single enquiry detail
PATCH /enquiries/{id}        — admin: update status / add notes
DELETE /enquiries/{id}       — admin: hard delete old enquiry
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query, Request, Response
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from fastapi.responses import StreamingResponse
from datetime import datetime, date

from app.models.enquiry import Enquiry, EnquiryType, EnquiryStatus, UrgencyLevel
from app.core.dependencies import get_admin_user
from app.core.limiter import limiter
from app.models.user import User
from app.services.email_service import (
    send_enquiry_confirmation,
    send_admin_enquiry_alert,
)

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])


# ---------- Schemas ----------

class EnquiryCreateRequest(BaseModel):
    """Fields submitted by a customer via the enquiry or contact form."""
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    enquiry_type: EnquiryType
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    service_type: Optional[str] = None
    message: str = ""
    city: Optional[str] = None
    urgency: UrgencyLevel = UrgencyLevel.NORMAL
    preferred_date: Optional[date] = None


class EnquiryUpdateRequest(BaseModel):
    """Fields admin can change on an existing enquiry."""
    status: Optional[EnquiryStatus] = None
    is_read: Optional[bool] = None
    admin_notes: Optional[str] = None


class EnquiryResponse(BaseModel):
    """Enquiry fields returned in API responses."""
    id: str
    name: str
    phone: str
    email: Optional[str]
    enquiry_type: str
    product_name: Optional[str]
    service_type: Optional[str]
    message: str
    city: Optional[str]
    urgency: str
    preferred_date: Optional[date]
    status: str
    is_read: bool
    admin_notes: Optional[str]
    created_at: datetime


def _to_response(e: Enquiry) -> EnquiryResponse:
    """Map Enquiry document to API response model."""
    return EnquiryResponse(
        id=str(e.id),
        name=e.name,
        phone=e.phone,
        email=e.email,
        enquiry_type=e.enquiry_type.value,
        product_name=e.product_name,
        service_type=e.service_type,
        message=e.message,
        city=e.city,
        urgency=e.urgency.value,
        preferred_date=e.preferred_date,
        status=e.status.value,
        is_read=e.is_read,
        admin_notes=e.admin_notes,
        created_at=e.created_at,
    )


# ---------- Endpoints ----------

@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_enquiry(request: Request, body: EnquiryCreateRequest):
    """
    Public endpoint: save a customer enquiry and fire notification emails.
    Sends a confirmation email to the customer (if email provided)
    and an alert email to the admin inbox — both run concurrently.
    Intentionally does not await email failures so the API response is fast.
    """
    enquiry = Enquiry(**body.model_dump())
    await enquiry.insert()

    # Prepare data dict for email templates
    enquiry_dict = body.model_dump()
    enquiry_dict["id"] = str(enquiry.id)

    # Send emails and create admin notification concurrently
    try:
        import asyncio
        from app.services.notification_service import notify_new_enquiry
        from app.services.email_service import send_test_ride_confirmation

        tasks = [
            send_admin_enquiry_alert(enquiry_dict),
            notify_new_enquiry(
                str(enquiry.id),
                body.name,
                body.enquiry_type.value,
                body.phone,
            ),
        ]

        # Send specific confirmation for test ride bookings
        if body.enquiry_type.value == "test_ride":
            tasks.append(send_test_ride_confirmation(enquiry_dict))
        else:
            tasks.append(send_enquiry_confirmation(enquiry_dict))

        await asyncio.gather(*tasks, return_exceptions=True)
    except Exception:
        pass

    return _to_response(enquiry)


@router.get("", response_model=List[EnquiryResponse])
async def list_enquiries(
    response: Response,
    enquiry_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    is_read: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list enquiries with optional filters.
    Sorted newest first so the admin always sees the most recent submission at top.
    """
    query_filter = {}

    if enquiry_type:
        query_filter["enquiry_type"] = enquiry_type
    if status:
        query_filter["status"] = status
    if is_read is not None:
        query_filter["is_read"] = is_read
    if search:
        regex = {"$regex": search, "$options": "i"}
        query_filter["$or"] = [
            {"name": regex},
            {"phone": regex},
            {"email": regex},
        ]

    total = await Enquiry.find(query_filter).count()
    response.headers["X-Total-Count"] = str(total)

    enquiries = (
        await Enquiry.find(query_filter)
        .sort(-Enquiry.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_to_response(e) for e in enquiries]


@router.get("/{enquiry_id}", response_model=EnquiryResponse)
async def get_enquiry(enquiry_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: return a single enquiry by MongoDB document ID.
    Auto-marks as read when the admin opens it.
    """
    enquiry = await Enquiry.get(enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    # Mark as read the first time admin views it
    if not enquiry.is_read:
        enquiry.is_read = True
        await enquiry.save()

    return _to_response(enquiry)


@router.patch("/{enquiry_id}", response_model=EnquiryResponse)
async def update_enquiry(
    enquiry_id: str,
    body: EnquiryUpdateRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: update enquiry status and/or add internal notes.
    Only provided fields are changed.
    """
    enquiry = await Enquiry.get(enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    if body.status is not None:
        enquiry.status = body.status
    if body.is_read is not None:
        enquiry.is_read = body.is_read
    if body.admin_notes is not None:
        enquiry.admin_notes = body.admin_notes

    enquiry.updated_at = datetime.utcnow()
    await enquiry.save()
    return _to_response(enquiry)


@router.delete("/{enquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enquiry(enquiry_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: permanently delete an enquiry document.
    Use only for clearing spam or test data.
    """
    enquiry = await Enquiry.get(enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )
    await enquiry.delete()


class BulkReadRequest(BaseModel):
    """List of enquiry IDs to mark as read in one operation."""
    enquiry_ids: List[str]


@router.post("/bulk-read")
async def bulk_mark_read(
    body: BulkReadRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: mark multiple enquiries as read in a single request.
    Used by the "Select All → Mark Read" button in the admin enquiries panel.
    Returns the count of enquiries that were actually changed.
    """
    from app.services.enquiry_service import bulk_mark_read as _bulk_mark_read
    updated = await _bulk_mark_read(body.enquiry_ids)
    return {"updated": updated, "message": f"{updated} enquiries marked as read"}
