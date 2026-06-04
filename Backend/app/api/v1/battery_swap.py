"""
battery_swap.py - Battery Swap Service Endpoints
POST   /battery-swap               — public: submit new swap request
GET    /battery-swap               — admin: list all requests with filters
GET    /battery-swap/stats         — admin: dashboard stats
GET    /battery-swap/{token}       — public: track swap by token number
GET    /battery-swap/admin/{id}    — admin: full swap details by MongoDB ID
PATCH  /battery-swap/{id}          — admin: update status / assign technician
DELETE /battery-swap/{id}          — admin: soft delete
POST   /battery-swap/upload-photo  — public: upload battery photo before form submit
"""

import os
import uuid
import asyncio
from datetime import datetime, date
from typing import Optional, List

from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.battery_swap import (
    BatterySwap, SwapStatus, BatteryType, BatteryCondition, SwapTimeSlot, SwapLocation,
)
from app.core.dependencies import get_admin_user
from app.main import limiter
from app.models.user import User
from app.services.battery_swap_service import generate_swap_token, calculate_swap_fee
from app.services.email_service import (
    send_swap_request_confirmation,
    send_swap_admin_alert,
    send_swap_confirmed,
    send_swap_completed,
)

router = APIRouter(prefix="/battery-swap", tags=["Battery Swap"])

# Directory where battery photos are saved on the VPS
UPLOAD_DIR = os.getenv("BATTERY_PHOTO_DIR", "/var/www/konark/uploads/battery-photos")
UPLOAD_URL_PREFIX = os.getenv("BATTERY_PHOTO_URL_PREFIX", "/uploads/battery-photos")
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
MAX_PHOTO_BYTES = 5 * 1024 * 1024  # 5 MB


# ─── Schemas ──────────────────────────────────────────────────────────────────

class SwapCreateRequest(BaseModel):
    """All fields submitted by the customer across the 4-step form."""
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    city: str
    address: str = Field(..., min_length=5)

    battery_brand: str
    battery_capacity: str
    battery_type: BatteryType
    purchase_year: int = Field(..., ge=2000, le=2030)
    current_charge_percent: int = Field(50, ge=0, le=100)
    battery_condition: BatteryCondition
    battery_serial_number: Optional[str] = None
    battery_photo_url: Optional[str] = None
    any_physical_damage: bool = False
    damage_description: Optional[str] = None

    preferred_date: date
    preferred_time_slot: SwapTimeSlot
    swap_location: SwapLocation
    special_instructions: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 10:
            raise ValueError("Phone number must have at least 10 digits")
        return digits[-10:]

    @field_validator("preferred_date")
    @classmethod
    def validate_future_date(cls, v: date) -> date:
        if v <= date.today():
            raise ValueError("Preferred date must be a future date")
        return v


class SwapUpdateRequest(BaseModel):
    """Admin-only fields for updating a swap request."""
    status: Optional[SwapStatus] = None
    assigned_technician: Optional[str] = None
    confirmed_date: Optional[date] = None
    confirmed_time_slot: Optional[str] = None
    technician_notes: Optional[str] = None
    swap_fee: Optional[float] = None
    admin_notes: Optional[str] = None
    is_read: Optional[bool] = None


class SwapResponse(BaseModel):
    """Full swap details returned by admin-facing endpoints."""
    id: str
    token_number: str
    status: str
    name: str
    phone: str
    email: Optional[str]
    city: str
    address: str
    battery_brand: str
    battery_capacity: str
    battery_type: str
    purchase_year: int
    current_charge_percent: int
    battery_condition: str
    battery_serial_number: Optional[str]
    battery_photo_url: Optional[str]
    any_physical_damage: bool
    damage_description: Optional[str]
    preferred_date: date
    preferred_time_slot: str
    swap_location: str
    special_instructions: Optional[str]
    assigned_technician: Optional[str]
    confirmed_date: Optional[date]
    confirmed_time_slot: Optional[str]
    technician_notes: Optional[str]
    swap_fee: float
    is_read: bool
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime


class SwapListItem(BaseModel):
    """Compact row used in the admin list table."""
    id: str
    token_number: str
    name: str
    phone: str
    battery_capacity: str
    battery_type: str
    preferred_date: date
    preferred_time_slot: str
    swap_location: str
    status: str
    is_read: bool
    created_at: datetime


class SwapTrackResponse(BaseModel):
    """Public tracking response — no admin-only fields."""
    token_number: str
    status: str
    name: str
    city: str
    battery_capacity: str
    preferred_date: date
    preferred_time_slot: str
    swap_location: str
    assigned_technician: Optional[str]
    confirmed_date: Optional[date]
    confirmed_time_slot: Optional[str]
    created_at: datetime
    updated_at: datetime


def _to_response(s: BatterySwap) -> SwapResponse:
    return SwapResponse(
        id=str(s.id),
        token_number=s.token_number,
        status=s.status.value,
        name=s.name,
        phone=s.phone,
        email=s.email,
        city=s.city,
        address=s.address,
        battery_brand=s.battery_brand,
        battery_capacity=s.battery_capacity,
        battery_type=s.battery_type.value,
        purchase_year=s.purchase_year,
        current_charge_percent=s.current_charge_percent,
        battery_condition=s.battery_condition.value,
        battery_serial_number=s.battery_serial_number,
        battery_photo_url=s.battery_photo_url,
        any_physical_damage=s.any_physical_damage,
        damage_description=s.damage_description,
        preferred_date=s.preferred_date,
        preferred_time_slot=s.preferred_time_slot.value,
        swap_location=s.swap_location.value,
        special_instructions=s.special_instructions,
        assigned_technician=s.assigned_technician,
        confirmed_date=s.confirmed_date,
        confirmed_time_slot=s.confirmed_time_slot,
        technician_notes=s.technician_notes,
        swap_fee=s.swap_fee,
        is_read=s.is_read,
        admin_notes=s.admin_notes,
        created_at=s.created_at,
        updated_at=s.updated_at,
    )


def _to_list_item(s: BatterySwap) -> SwapListItem:
    return SwapListItem(
        id=str(s.id),
        token_number=s.token_number,
        name=s.name,
        phone=s.phone,
        battery_capacity=s.battery_capacity,
        battery_type=s.battery_type.value,
        preferred_date=s.preferred_date,
        preferred_time_slot=s.preferred_time_slot.value,
        swap_location=s.swap_location.value,
        status=s.status.value,
        is_read=s.is_read,
        created_at=s.created_at,
    )


def _to_track(s: BatterySwap) -> SwapTrackResponse:
    return SwapTrackResponse(
        token_number=s.token_number,
        status=s.status.value,
        name=s.name,
        city=s.city,
        battery_capacity=s.battery_capacity,
        preferred_date=s.preferred_date,
        preferred_time_slot=s.preferred_time_slot.value,
        swap_location=s.swap_location.value,
        assigned_technician=s.assigned_technician,
        confirmed_date=s.confirmed_date,
        confirmed_time_slot=s.confirmed_time_slot,
        created_at=s.created_at,
        updated_at=s.updated_at,
    )


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def submit_swap_request(request: Request, body: SwapCreateRequest):
    """
    Public: create a new battery swap request.
    Generates a unique BSW token, saves to MongoDB, fires confirmation emails.
    """
    token = await generate_swap_token()
    estimated_fee = calculate_swap_fee(body.battery_capacity, body.battery_type.value)

    swap = BatterySwap(
        token_number=token,
        swap_fee=estimated_fee,
        **body.model_dump(),
    )
    await swap.insert()

    swap_dict = {
        "token_number": token,
        "name": body.name,
        "phone": body.phone,
        "email": body.email,
        "city": body.city,
        "address": body.address,
        "battery_capacity": body.battery_capacity,
        "battery_type": body.battery_type.value,
        "battery_brand": body.battery_brand,
        "battery_condition": body.battery_condition.value,
        "battery_photo_url": body.battery_photo_url,
        "preferred_date": str(body.preferred_date),
        "preferred_time_slot": body.preferred_time_slot.value,
        "swap_location": body.swap_location.value,
        "estimated_fee": estimated_fee,
        "id": str(swap.id),
    }

    # Send emails and notifications concurrently — failure must not block the response
    try:
        from app.services.notification_service import create_notification
        from app.models.notification import NotificationType
        await asyncio.gather(
            send_swap_request_confirmation(swap_dict),
            send_swap_admin_alert(swap_dict),
            create_notification(
                type=NotificationType.BOOKING,
                title=f"New Battery Swap: {token}",
                message=f"{body.name} ({body.city}) — {body.battery_capacity} {body.battery_type.value}",
                entity_id=str(swap.id),
            ),
            return_exceptions=True,
        )
    except Exception:
        pass

    return {
        "token_number": token,
        "message": "Battery swap request submitted successfully",
        "estimated_fee": estimated_fee,
        "id": str(swap.id),
    }


@router.get("/stats")
async def get_swap_stats(admin: User = Depends(get_admin_user)):
    """Admin: dashboard counts for total / pending / confirmed / completed today."""
    today = date.today()

    all_swaps = await BatterySwap.find(BatterySwap.is_deleted == False).to_list()

    total = len(all_swaps)
    pending = sum(1 for s in all_swaps if s.status == SwapStatus.PENDING)
    confirmed = sum(1 for s in all_swaps if s.status == SwapStatus.CONFIRMED)
    assigned = sum(1 for s in all_swaps if s.status == SwapStatus.ASSIGNED)
    in_progress = sum(1 for s in all_swaps if s.status == SwapStatus.IN_PROGRESS)
    completed = sum(1 for s in all_swaps if s.status == SwapStatus.COMPLETED)
    cancelled = sum(1 for s in all_swaps if s.status == SwapStatus.CANCELLED)
    unread = sum(1 for s in all_swaps if not s.is_read and s.status == SwapStatus.PENDING)

    completed_today = sum(
        1 for s in all_swaps
        if s.status == SwapStatus.COMPLETED and s.updated_at.date() == today
    )

    return {
        "total": total,
        "pending": pending,
        "confirmed": confirmed,
        "assigned": assigned,
        "in_progress": in_progress,
        "completed": completed,
        "cancelled": cancelled,
        "completed_today": completed_today,
        "unread": unread,
    }


@router.get("", response_model=List[SwapListItem])
async def list_swaps(
    status_filter: Optional[str] = Query(None, alias="status"),
    city: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_admin_user),
):
    """Admin: list all battery swap requests with optional filters, sorted newest first."""
    query_filter: dict = {"is_deleted": False}

    if status_filter:
        query_filter["status"] = status_filter
    if city:
        query_filter["city"] = city

    swaps = (
        await BatterySwap.find(query_filter)
        .sort(-BatterySwap.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )

    # Apply search and date range in Python (Beanie text search is limited without text index)
    if search:
        s = search.lower()
        swaps = [
            sw for sw in swaps
            if s in sw.token_number.lower()
            or s in sw.name.lower()
            or s in sw.phone
        ]

    if date_from:
        swaps = [sw for sw in swaps if sw.preferred_date >= date_from]
    if date_to:
        swaps = [sw for sw in swaps if sw.preferred_date <= date_to]

    return [_to_list_item(sw) for sw in swaps]


@router.get("/admin/{swap_id}", response_model=SwapResponse)
async def get_swap_admin(swap_id: str, admin: User = Depends(get_admin_user)):
    """Admin: retrieve full swap details by MongoDB document ID."""
    swap = await BatterySwap.get(swap_id)
    if not swap or swap.is_deleted:
        raise HTTPException(status_code=404, detail="Battery swap request not found")
    return _to_response(swap)


@router.get("/{token_number}", response_model=SwapTrackResponse)
async def track_swap(token_number: str):
    """
    Public: look up a swap request by token number (e.g. BSW-2024-00042).
    Returns limited public-safe fields so customers can track their swap.
    """
    swap = await BatterySwap.find_one(
        BatterySwap.token_number == token_number.upper(),
        BatterySwap.is_deleted == False,
    )
    if not swap:
        raise HTTPException(status_code=404, detail="Swap token not found. Please check the token and try again.")
    return _to_track(swap)


@router.patch("/{swap_id}", response_model=SwapResponse)
async def update_swap(
    swap_id: str,
    body: SwapUpdateRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: update a swap request — change status, assign technician, set fee.
    Sends status-change emails to the customer automatically:
      confirmed → send_swap_confirmed
      completed → send_swap_completed
    """
    swap = await BatterySwap.get(swap_id)
    if not swap or swap.is_deleted:
        raise HTTPException(status_code=404, detail="Battery swap request not found")

    prev_status = swap.status

    if body.status is not None:
        swap.status = body.status
    if body.assigned_technician is not None:
        swap.assigned_technician = body.assigned_technician
    if body.confirmed_date is not None:
        swap.confirmed_date = body.confirmed_date
    if body.confirmed_time_slot is not None:
        swap.confirmed_time_slot = body.confirmed_time_slot
    if body.technician_notes is not None:
        swap.technician_notes = body.technician_notes
    if body.swap_fee is not None:
        swap.swap_fee = body.swap_fee
    if body.admin_notes is not None:
        swap.admin_notes = body.admin_notes
    if body.is_read is not None:
        swap.is_read = body.is_read

    swap.updated_at = datetime.utcnow()
    await swap.save()

    # Fire status-change emails when relevant transitions occur
    if swap.status != prev_status and swap.email:
        swap_dict = {
            "token_number": swap.token_number,
            "name": swap.name,
            "phone": swap.phone,
            "email": swap.email,
            "city": swap.city,
            "address": swap.address,
            "battery_capacity": swap.battery_capacity,
            "preferred_date": str(swap.preferred_date),
            "preferred_time_slot": swap.preferred_time_slot.value,
            "confirmed_date": str(swap.confirmed_date) if swap.confirmed_date else None,
            "confirmed_time_slot": swap.confirmed_time_slot,
            "assigned_technician": swap.assigned_technician,
            "swap_location": swap.swap_location.value,
            "swap_fee": swap.swap_fee,
        }
        try:
            if swap.status == SwapStatus.CONFIRMED:
                await send_swap_confirmed(swap_dict)
            elif swap.status == SwapStatus.COMPLETED:
                await send_swap_completed(swap_dict)
        except Exception:
            pass

    return _to_response(swap)


@router.delete("/{swap_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_swap(swap_id: str, admin: User = Depends(get_admin_user)):
    """Admin: soft-delete a battery swap request."""
    swap = await BatterySwap.get(swap_id)
    if not swap or swap.is_deleted:
        raise HTTPException(status_code=404, detail="Battery swap request not found")
    swap.is_deleted = True
    swap.updated_at = datetime.utcnow()
    await swap.save()


@router.post("/upload-photo")
async def upload_battery_photo(file: UploadFile = File(...)):
    """
    Public: upload a battery photo before submitting the swap form.
    Validates MIME type and file size, saves to the uploads directory,
    and returns the URL path to be stored in the form state.
    """
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are accepted",
        )

    contents = await file.read()
    if len(contents) > MAX_PHOTO_BYTES:
        raise HTTPException(status_code=400, detail="Image must be under 5 MB")

    # Generate a unique filename to prevent overwrites
    ext = file.filename.rsplit(".", 1)[-1] if "." in (file.filename or "") else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(contents)
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Failed to save photo: {e}")

    photo_url = f"{UPLOAD_URL_PREFIX}/{filename}"
    return {"photo_url": photo_url, "filename": filename}
