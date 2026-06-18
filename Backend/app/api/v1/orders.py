"""
orders.py - Order Management Endpoints
POST /orders                          — place a new order (any user / guest)
GET  /orders                          — customers see own orders; admins see all
GET  /orders/{order_number}           — detail for a single order
PATCH /orders/{order_number}/status   — admin: update fulfilment status + email customer
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query, Request
from app.core.limiter import limiter
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.order import Order, OrderStatus, PaymentMethod, PaymentStatus
from app.core.dependencies import get_admin_user, get_optional_user, get_current_user
from app.models.user import User, UserRole
from app.services.email_service import send_order_confirmation
from app.utils.helpers import generate_order_number, calculate_order_totals

router = APIRouter(prefix="/orders", tags=["Orders"])


# ---------- Schemas ----------

class OrderItemRequest(BaseModel):
    """A single item in the cart at checkout time."""
    product_id: str
    name: str
    category: str
    qty: int = Field(..., ge=1)
    price: float = Field(..., ge=0)
    image: str = ""


class PlaceOrderRequest(BaseModel):
    """Full checkout payload submitted by the customer."""
    customer_name: str = Field(..., min_length=2)
    customer_phone: str = Field(..., min_length=10, max_length=15)
    customer_email: Optional[EmailStr] = None
    items: List[OrderItemRequest]
    delivery_address: str
    city: str
    pincode: str = ""
    state: str = "Odisha"
    payment_method: PaymentMethod = PaymentMethod.COD
    notes: Optional[str] = None


class StatusUpdateRequest(BaseModel):
    """Admin uses this to advance the order through its lifecycle."""
    order_status: OrderStatus
    payment_status: Optional[PaymentStatus] = None


class OrderResponse(BaseModel):
    """Order fields returned to the API caller."""
    id: str
    order_number: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str]
    items: List[Dict[str, Any]]
    subtotal: float
    delivery_charge: float
    gst_amount: float
    total_amount: float
    delivery_address: str
    city: str
    pincode: str
    payment_method: str
    payment_status: str
    order_status: str
    notes: Optional[str]
    created_at: datetime


def _to_response(o: Order) -> OrderResponse:
    """Map Order document to the API response model."""
    return OrderResponse(
        id=str(o.id),
        order_number=o.order_number,
        customer_name=o.customer_name,
        customer_phone=o.customer_phone,
        customer_email=o.customer_email,
        items=o.items,
        subtotal=o.subtotal,
        delivery_charge=o.delivery_charge,
        gst_amount=o.gst_amount,
        total_amount=o.total_amount,
        delivery_address=o.delivery_address,
        city=o.city,
        pincode=o.pincode,
        payment_method=o.payment_method.value,
        payment_status=o.payment_status.value,
        order_status=o.order_status.value,
        notes=o.notes,
        created_at=o.created_at,
    )


# ---------- Endpoints ----------

@limiter.limit("20/minute")
@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_order(
    request: Request,
    body: PlaceOrderRequest,
    current_user: Optional[User] = Depends(get_optional_user),
):
    """
    Place a new order. Works for both authenticated users and guests.
    Calculates subtotal from cart items, applies 18% GST and delivery charge.
    Generates a sequential order number (KI-YYYY-NNNNN).
    Sends order confirmation email if customer email is provided.
    """
    if not body.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )

    # Calculate subtotal by summing qty * price for all items
    subtotal = sum(item.qty * item.price for item in body.items)

    # Apply business rules: 18% GST, free delivery above ₹5,000
    totals = calculate_order_totals(subtotal)

    # Generate sequential order number (count existing + 1)
    order_count = await Order.count()
    order_number = generate_order_number(order_count + 1)

    # Snapshot items as plain dicts so changes to the Product document don't affect history
    items_snapshot = [item.model_dump() for item in body.items]

    order = Order(
        order_number=order_number,
        user_id=str(current_user.id) if current_user else None,
        customer_name=body.customer_name,
        customer_phone=body.customer_phone,
        customer_email=body.customer_email,
        items=items_snapshot,
        subtotal=totals["subtotal"],
        delivery_charge=totals["delivery_charge"],
        gst_amount=totals["gst_amount"],
        total_amount=totals["total_amount"],
        delivery_address=body.delivery_address,
        city=body.city,
        pincode=body.pincode,
        state=body.state,
        payment_method=body.payment_method,
        notes=body.notes,
    )
    await order.insert()

    # Send confirmation email and create admin notification concurrently
    try:
        import asyncio as _asyncio
        from app.services.notification_service import notify_new_order
        await _asyncio.gather(
            send_order_confirmation({
                "customer_email": body.customer_email,
                "order_number": order_number,
                "items": items_snapshot,
                "subtotal": totals["subtotal"],
                "delivery_charge": totals["delivery_charge"],
                "gst_amount": totals["gst_amount"],
                "total_amount": totals["total_amount"],
            }),
            notify_new_order(
                str(order.id),
                order_number,
                body.customer_name,
                totals["total_amount"],
            ),
            return_exceptions=True,
        )
    except Exception:
        pass

    return _to_response(order)


@router.get("", response_model=List[OrderResponse])
async def list_orders(
    order_status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """
    List orders.
    Authenticated customers see only their own orders.
    Admins see all orders with optional status filter.
    Unauthenticated requests receive 401.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to view orders",
        )

    query_filter = {}

    # Non-admins can only see their own orders
    from app.models.user import UserRole
    if current_user.role != UserRole.ADMIN:
        query_filter["user_id"] = str(current_user.id)

    if order_status:
        query_filter["order_status"] = order_status

    orders = (
        await Order.find(query_filter)
        .sort(-Order.created_at)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_to_response(o) for o in orders]


@router.get("/export")
async def export_orders_csv(
    order_status: Optional[str] = Query(None),
    admin: User = Depends(get_admin_user),
):
    """
    Admin: download all orders (optionally filtered by status) as a CSV file.
    Returns a StreamingResponse so large order lists don't block memory.
    Registered before /{order_number} so "export" is never matched as an order number.
    """
    from fastapi.responses import StreamingResponse
    from app.services.order_service import export_orders_to_csv
    import io

    query_filter = {}
    if order_status:
        query_filter["order_status"] = order_status

    orders = await Order.find(query_filter).sort(-Order.created_at).to_list()
    csv_content = await export_orders_to_csv(orders)

    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=konark_orders.csv"},
    )


@router.get("/{order_number}", response_model=OrderResponse)
async def get_order(
    order_number: str,
    current_user: Optional[User] = Depends(get_optional_user),
):
    """
    Return a single order by its human-readable order number.
    Customers can only view their own orders.
    Admins can view any order.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    order = await Order.find_one({"order_number": order_number})
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_number} not found",
        )

    # Customers can only access orders that belong to them
    from app.models.user import UserRole
    if (
        current_user.role != UserRole.ADMIN
        and order.user_id != str(current_user.id)
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: this order belongs to another account",
        )

    return _to_response(order)


@router.patch("/{order_number}/status", response_model=OrderResponse)
async def update_order_status(
    order_number: str,
    body: StatusUpdateRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Admin: advance an order's fulfilment and/or payment status.
    Sends an order status update email to the customer if email is on record.
    """
    order = await Order.find_one({"order_number": order_number})
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_number} not found",
        )

    order.order_status = body.order_status
    if body.payment_status:
        order.payment_status = body.payment_status

    order.updated_at = datetime.utcnow()
    await order.save()

    # Email customer about the status change (non-blocking)
    try:
        from app.services.email_service import send_order_status_update
        await send_order_status_update(
            {
                "customer_email": order.customer_email,
                "order_number": order.order_number,
                "total_amount": order.total_amount,
            },
            body.order_status.value,
        )
    except Exception:
        pass

    return _to_response(order)


@router.post("/{order_number}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_number: str,
    current_user: User = Depends(get_current_user),
):
    """
    Cancel an order. Customers can cancel their own orders; admins can cancel any.
    Orders that are already shipped or delivered cannot be cancelled.
    """
    order = await Order.find_one({"order_number": order_number})
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_number} not found",
        )

    if current_user.role != UserRole.ADMIN and order.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: this order belongs to another account",
        )

    if order.order_status in (OrderStatus.SHIPPED, OrderStatus.DELIVERED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel an order that has already shipped or been delivered",
        )

    order.order_status = OrderStatus.CANCELLED
    order.updated_at = datetime.utcnow()
    await order.save()

    return _to_response(order)
