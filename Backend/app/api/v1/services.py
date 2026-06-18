"""
services.py - Service Booking Endpoints
POST /services/bookings          — public: submit a new service booking
GET  /services/bookings          — admin: list with filters
GET  /services/bookings/{id}     — admin: single booking detail
PATCH /services/bookings/{id}    — admin: assign technician, update status
DELETE /services/bookings/{id}   — admin: hard delete
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query, Request
from app.core.limiter import limiter
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date

from app.models.service_booking import ServiceBooking, BookingStatus, TimeSlot
from app.core.dependencies import get_admin_user
from app.models.user import User
from app.services.email_service import send_service_booking_confirmation
from app.utils.helpers import generate_booking_number

router = APIRouter(prefix="/services", tags=["Service Bookings"])


# ---------- Schemas ----------

class BookingCreateRequest(BaseModel):
    """Fields submitted by the customer on the service booking form."""
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    service_type: str
    city: str
    address: Optional[str] = None
    preferred_date: Optional[date] = None
    time_slot: Optional[TimeSlot] = None
    urgency: str = "normal"
    problem_description: str = ""


class BookingUpdateRequest(BaseModel):
    """Admin uses this to assign a technician and track progress."""
    status: Optional[BookingStatus] = None
    assigned_technician: Optional[str] = None
    technician_notes: Optional[str] = None


class BookingResponse(BaseModel):
    """Booking fields returned in API responses."""
    id: str
    booking_number: str
    name: str
    phone: str
    email: Optional[str]
    service_type: str
    city: str
    address: Optional[str]
    preferred_date: Optional[date]
    time_slot: Optional[str]
    urgency: str
    problem_description: str
    assigned_technician: Optional[str]
    status: str
    technician_notes: Optional[str]
    created_at: datetime


def _to_response(b: ServiceBooking) -> BookingResponse:
    """Map ServiceBooking document to the API response model."""
    return BookingResponse(
        id=str(b.id),
        booking_number=b.booking_number,
        name=b.name,
        phone=b.phone,
        email=b.email,
        service_type=b.service_type,
        city=b.city,
        address=b.address,
        preferred_date=b.preferred_date,
        time_slot=b.time_slot.value if b.time_slot else None,
        urgency=b.urgency,
        problem_description=b.problem_description,
        assigned_technician=b.assigned_technician,
        status=b.status.value,
        technician_notes=b.technician_notes,
        created_at=b.created_at,
    )


# ---------- Endpoints ----------

@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def create_booking(request: Request, body: BookingCreateRequest):
    """
    Public endpoint: create a service booking.
    Generates a sequential booking number (KB-YYYY-NNNNN).
    Sends a confirmation email to the customer and alerts the admin inbox.
    """
    # Generate sequential booking number
    booking_count = await ServiceBooking.count()
    booking_number = generate_booking_number(booking_count + 1)

    booking = ServiceBooking(
        booking_number=booking_number,
        **body.model_dump(),
    )
    await booking.insert()

    # Send confirmation email and create admin notification concurrently
    try:
        import asyncio as _asyncio
        from app.services.notification_service import notify_new_booking
        await _asyncio.gather(
            send_service_booking_confirmation({
                "email": body.email,
                "name": body.name,
                "phone": body.phone,
                "booking_number": booking_number,
                "service_type": body.service_type,
                "city": body.city,
            }),
            notify_new_booking(
                str(booking.id),
                booking_number,
                body.name,
                body.service_type,
                body.city,
            ),
            return_exceptions=True,
        )
    except Exception:
        pass

    return _to_response(booking)


@router.get("/bookings", response_model=List[BookingResponse])
async def list_bookings(
    status_filter: Optional[str] = Query(None, alias="status"),
    city: Optional[str] = Query(None),
    service_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list all service bookings with optional filters.
    Sorted newest first.
    """
    query_filter = {}

    if status_filter:
        query_filter["status"] = status_filter
    if city:
        query_filter["city"] = city
    if service_type:
        # Case-insensitive partial match on service_type
        query_filter["service_type"] = {"$regex": service_type, "$options": "i"}

    bookings = (
        await ServiceBooking.find(query_filter)
        .sort(-ServiceBooking.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_to_response(b) for b in bookings]


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: return a single booking by MongoDB document ID.
    """
    booking = await ServiceBooking.get(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service booking not found",
        )
    return _to_response(booking)


@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    body: BookingUpdateRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: assign a technician, change booking status, or add notes.
    Only fields included in the request body are updated.
    """
    booking = await ServiceBooking.get(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service booking not found",
        )

    if body.status is not None:
        booking.status = body.status
    if body.assigned_technician is not None:
        booking.assigned_technician = body.assigned_technician
    if body.technician_notes is not None:
        booking.technician_notes = body.technician_notes

    booking.updated_at = datetime.utcnow()
    await booking.save()
    return _to_response(booking)


@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(booking_id: str, admin: User = Depends(get_admin_user)):
    """
    Admin: permanently delete a service booking document.
    Use only to remove test or spam entries.
    """
    booking = await ServiceBooking.get(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service booking not found",
        )
    await booking.delete()


@router.get("/bookings/export")
async def export_bookings_csv(
    status_filter: Optional[str] = Query(None, alias="status"),
    city: Optional[str] = Query(None),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: download all service bookings as a CSV file.
    Optional filters for status and city.
    """
    import csv
    import io
    from fastapi.responses import StreamingResponse

    query_filter = {}
    if status_filter:
        query_filter["status"] = status_filter
    if city:
        query_filter["city"] = city

    bookings = await ServiceBooking.find(query_filter).sort(-ServiceBooking.created_at).to_list()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Booking Number", "Name", "Phone", "Email",
        "Service Type", "City", "Preferred Date", "Time Slot",
        "Urgency", "Assigned Technician", "Status", "Date Submitted",
    ])
    for b in bookings:
        writer.writerow([
            b.booking_number, b.name, b.phone, b.email or "",
            b.service_type, b.city,
            str(b.preferred_date) if b.preferred_date else "",
            b.time_slot.value if b.time_slot else "",
            b.urgency, b.assigned_technician or "",
            b.status.value,
            b.created_at.strftime("%Y-%m-%d %H:%M"),
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=konark_bookings.csv"},
    )
