"""
customers.py - Admin Customer Management Endpoints
GET   /customers           — list all registered customers
GET   /customers/export    — download customers as CSV
GET   /customers/{id}      — single customer detail
PATCH /customers/{id}/toggle — activate / deactivate account
"""

import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from fastapi.responses import StreamingResponse
from typing import Optional
from datetime import datetime

from app.core.dependencies import get_admin_user
from app.models.user import User, UserRole
from app.models.order import Order

router = APIRouter()


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


@router.get("/customers", response_model=list)
async def list_customers(
    response: Response,
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: list all registered customer accounts, newest first.
    """
    query_filter: dict = {"role": UserRole.CUSTOMER.value}
    if is_active is not None:
        query_filter["is_active"] = is_active
    if search:
        regex = {"$regex": search, "$options": "i"}
        query_filter["$or"] = [
            {"name": regex},
            {"email": regex},
            {"phone": regex},
        ]

    total = await User.find(query_filter).count()
    response.headers["X-Total-Count"] = str(total)

    customers = (
        await User.find(query_filter)
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
            status_code=status.HTTP_404_NOT_FOUND,
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
            status_code=status.HTTP_404_NOT_FOUND,
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
