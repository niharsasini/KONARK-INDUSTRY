"""
email_service.py - Transactional Email Service
Sends HTML emails via Gmail SMTP using aiosmtplib (async).
All emails share the Konark brand template — dark background, cyan accent.
"""

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """
    Core SMTP sender — all other functions in this module call this.
    Connects to Gmail on port 587 with STARTTLS encryption.
    Returns True on success, False on any SMTP or network error.
    """
    settings = get_settings()

    # Build MIME message with HTML body
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.email_from_name} <{settings.email_from}>"
    message["To"] = to_email
    message.attach(MIMEText(html_body, "html"))

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            start_tls=True,
            username=settings.smtp_user,
            password=settings.smtp_password,
        )
        logger.info(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


def _base_template(content: str) -> str:
    """
    Wrap content in the Konark dark-mode HTML email shell.
    Mobile-responsive, 600px max-width table layout.
    """
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:20px 0;">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;background:#0a0f1e;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#0f172a;padding:24px 32px;border-bottom:1px solid #1e2d40;">
          <span style="color:#00d4ff;font-size:20px;font-weight:bold;">&#9889; KONARK INDUSTRY</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;color:#f1f5f9;">{content}</td></tr>

        <!-- Footer -->
        <tr><td style="background:#060d1a;padding:20px 32px;border-top:1px solid #1e2d40;">
          <p style="color:#64748b;font-size:12px;margin:0;">
            Konark Industry &middot; Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002<br>
            &#128222; +91 94376 11129 &middot; &#128231; konarkindustrie@gmail.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


async def send_welcome_email(user_data: dict) -> bool:
    """
    Send a welcome email to a newly registered user.
    Introduces key account features and links to the product catalogue.
    """
    if not user_data.get("email"):
        return False

    content = f"""
      <h2 style="color:#00d4ff;margin:0 0 16px;">Welcome to Konark Industry! &#9889;</h2>
      <p style="color:#94a3b8;line-height:1.7;">Hi {user_data.get('name', 'there')},</p>
      <p style="color:#94a3b8;line-height:1.7;">
        Your account has been created successfully. Here's what you can do now:
      </p>
      <div style="margin:20px 0;">
        <p style="color:#f1f5f9;margin:8px 0;">&#128230; Track all your orders in one place</p>
        <p style="color:#f1f5f9;margin:8px 0;">&#10084; Save products to your wishlist</p>
        <p style="color:#f1f5f9;margin:8px 0;">&#128276; Get notified about new launches and deals</p>
        <p style="color:#f1f5f9;margin:8px 0;">&#128295; Manage your service bookings</p>
      </div>
      <a href="https://konark-industry.vercel.app/products"
         style="display:inline-block;background:#00d4ff;color:#0a0f1e;
                padding:12px 28px;border-radius:8px;font-weight:bold;
                text-decoration:none;margin-top:8px;">
        Start Shopping &rarr;
      </a>
    """
    return await send_email(
        user_data["email"],
        "Welcome to Konark Industry — Your account is ready!",
        _base_template(content),
    )


async def send_enquiry_confirmation(enquiry_data: dict) -> bool:
    """
    Confirm receipt of a customer enquiry.
    Tells the customer their message was received and a callback is coming.
    Skipped silently if no email address was provided.
    """
    if not enquiry_data.get("email"):
        return False

    enquiry_label = enquiry_data.get("enquiry_type", "").replace("_", " ").title()
    content = f"""
      <h2 style="color:#00d4ff;margin:0 0 16px;">We've received your enquiry! &#10003;</h2>
      <p style="color:#94a3b8;line-height:1.7;">Hi {enquiry_data.get('name', 'there')},</p>
      <p style="color:#94a3b8;line-height:1.7;">
        Thank you for reaching out. Our team will call you on
        <strong style="color:#f1f5f9;">{enquiry_data.get('phone')}</strong> within 2 hours.
      </p>
      <div style="background:#0f172a;border:1px solid #1e2d40;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="color:#64748b;font-size:13px;margin:0 0 8px;">YOUR ENQUIRY DETAILS</p>
        <p style="color:#f1f5f9;margin:4px 0;">Type: {enquiry_label}</p>
        <p style="color:#f1f5f9;margin:4px 0;">Message: {str(enquiry_data.get('message', ''))[:120]}</p>
      </div>
      <p style="color:#94a3b8;">
        If urgent, call us at
        <a href="tel:+919437611129" style="color:#00d4ff;">+91 94376 11129</a>
      </p>
    """
    return await send_email(
        enquiry_data["email"],
        "Your enquiry has been received — Konark Industry",
        _base_template(content),
    )


async def send_admin_enquiry_alert(enquiry_data: dict) -> bool:
    """
    Alert the admin inbox (konarkindustrie@gmail.com) when a new enquiry arrives.
    Includes all customer details so admin can call back without opening the dashboard.
    """
    settings = get_settings()
    enquiry_label = enquiry_data.get("enquiry_type", "").replace("_", " ").title()

    content = f"""
      <h2 style="color:#f97316;margin:0 0 16px;">&#128276; New {enquiry_label} Enquiry</h2>
      <div style="background:#0f172a;border-left:3px solid #00d4ff;
                  padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="color:#f1f5f9;margin:4px 0;font-size:16px;">
          <strong>Name:</strong> {enquiry_data.get('name')}
        </p>
        <p style="color:#00d4ff;margin:4px 0;font-size:18px;">
          <strong>&#128222; Phone:</strong> {enquiry_data.get('phone')}
        </p>
        <p style="color:#f1f5f9;margin:4px 0;">
          <strong>Email:</strong> {enquiry_data.get('email') or 'Not provided'}
        </p>
        <p style="color:#f1f5f9;margin:4px 0;">
          <strong>City:</strong> {enquiry_data.get('city') or 'Not specified'}
        </p>
        <p style="color:#f1f5f9;margin:4px 0;">
          <strong>Urgency:</strong> {enquiry_data.get('urgency', 'normal').upper()}
        </p>
      </div>
      <div style="background:#0f172a;border:1px solid #1e2d40;border-radius:8px;padding:16px;">
        <p style="color:#64748b;font-size:12px;margin:0 0 8px;">MESSAGE</p>
        <p style="color:#f1f5f9;line-height:1.7;margin:0;">
          {enquiry_data.get('message') or 'No message provided'}
        </p>
      </div>
    """
    return await send_email(
        settings.company_email,
        f"[NEW ENQUIRY] {enquiry_data.get('name')} — {enquiry_label}",
        _base_template(content),
    )


async def send_order_confirmation(order_data: dict) -> bool:
    """
    Send an order confirmation email to the customer.
    Lists ordered items, totals, and estimated delivery.
    Skipped if no customer email is on the order.
    """
    if not order_data.get("customer_email"):
        return False

    # Build the items table rows
    rows = ""
    for item in order_data.get("items", []):
        rows += f"""
          <tr>
            <td style="padding:8px;color:#f1f5f9;border-bottom:1px solid #1e2d40;">
              {item.get('name')}
            </td>
            <td style="padding:8px;color:#94a3b8;border-bottom:1px solid #1e2d40;text-align:center;">
              x{item.get('qty', 1)}
            </td>
            <td style="padding:8px;color:#00d4ff;border-bottom:1px solid #1e2d40;text-align:right;">
              &#8377;{item.get('price', 0):,.0f}
            </td>
          </tr>
        """

    content = f"""
      <h2 style="color:#10b981;margin:0 0 8px;">Order Confirmed! &#10003;</h2>
      <p style="color:#94a3b8;">
        Order Number: <strong style="color:#00d4ff;">{order_data.get('order_number')}</strong>
      </p>
      <table width="100%" style="border-collapse:collapse;margin:20px 0;">
        {rows}
        <tr>
          <td colspan="2" style="padding:12px 8px;color:#94a3b8;text-align:right;">
            Delivery:
          </td>
          <td style="padding:12px 8px;color:#f1f5f9;text-align:right;">
            {"FREE" if order_data.get('delivery_charge', 0) == 0 else f"&#8377;{order_data.get('delivery_charge'):,.0f}"}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px 8px;color:#94a3b8;text-align:right;">
            GST (18%):
          </td>
          <td style="padding:4px 8px;color:#f1f5f9;text-align:right;">
            &#8377;{order_data.get('gst_amount', 0):,.2f}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:12px 8px;color:#94a3b8;text-align:right;
                                  font-weight:bold;">Total:</td>
          <td style="padding:12px 8px;color:#00d4ff;font-size:20px;
                     font-weight:bold;text-align:right;">
            &#8377;{order_data.get('total_amount', 0):,.0f}
          </td>
        </tr>
      </table>
      <p style="color:#94a3b8;">
        Expected delivery: <strong style="color:#f1f5f9;">5–7 business days</strong>
      </p>
    """
    return await send_email(
        order_data["customer_email"],
        f"Order Confirmed: {order_data.get('order_number')} — Konark Industry",
        _base_template(content),
    )


async def send_service_booking_confirmation(booking_data: dict) -> bool:
    """
    Confirm a service booking to the customer.
    Includes the booking number and a note that the team will call to confirm timing.
    """
    if not booking_data.get("email"):
        return False

    content = f"""
      <h2 style="color:#00d4ff;margin:0 0 16px;">Service Booking Confirmed! &#10003;</h2>
      <p style="color:#94a3b8;line-height:1.7;">Hi {booking_data.get('name')},</p>
      <p style="color:#94a3b8;line-height:1.7;">
        Your booking for <strong style="color:#f1f5f9;">{booking_data.get('service_type')}</strong>
        has been received.
      </p>
      <div style="background:#0f172a;border:1px solid #1e2d40;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="color:#64748b;font-size:12px;margin:0 0 12px;">BOOKING DETAILS</p>
        <p style="color:#f1f5f9;margin:6px 0;">
          Booking No: <strong style="color:#00d4ff;">{booking_data.get('booking_number')}</strong>
        </p>
        <p style="color:#f1f5f9;margin:6px 0;">Service: {booking_data.get('service_type')}</p>
        <p style="color:#f1f5f9;margin:6px 0;">City: {booking_data.get('city')}</p>
      </div>
      <p style="color:#94a3b8;">
        Our team will call <strong style="color:#f1f5f9;">{booking_data.get('phone')}</strong>
        within 2 hours to confirm your appointment.
      </p>
    """
    return await send_email(
        booking_data["email"],
        f"Service Booking Confirmed: {booking_data.get('booking_number')} — Konark Industry",
        _base_template(content),
    )


async def send_order_status_update(order_data: dict, new_status: str) -> bool:
    """
    Notify a customer when admin updates their order's fulfilment status.
    Maps the status enum value to a human-readable message.
    Skipped if no customer email is on the order.
    """
    if not order_data.get("customer_email"):
        return False

    # Human-friendly status messages shown to the customer
    status_messages = {
        "confirmed": ("Your order has been confirmed!", "#10b981", "We're preparing it for dispatch."),
        "packed": ("Your order has been packed!", "#3b82f6", "It will be shipped very soon."),
        "shipped": ("Your order is on its way!", "#f59e0b", "Expected delivery in 2-3 business days."),
        "delivered": ("Your order has been delivered!", "#10b981", "Thank you for shopping with Konark Industry!"),
        "cancelled": ("Your order has been cancelled.", "#ef4444", "Please contact us if this was unexpected."),
    }

    status_label, color, sub_message = status_messages.get(
        new_status,
        (f"Order status updated to {new_status}", "#00d4ff", ""),
    )

    content = f"""
      <h2 style="color:{color};margin:0 0 8px;">&#128230; {status_label}</h2>
      <p style="color:#94a3b8;">
        Order: <strong style="color:#00d4ff;">{order_data.get('order_number')}</strong>
      </p>
      <p style="color:#94a3b8;line-height:1.7;">{sub_message}</p>
      <div style="background:#0f172a;border:1px solid #1e2d40;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="color:#64748b;font-size:12px;margin:0 0 8px;">ORDER SUMMARY</p>
        <p style="color:#f1f5f9;margin:4px 0;">
          Total: <strong style="color:#00d4ff;">&#8377;{order_data.get('total_amount', 0):,.0f}</strong>
        </p>
        <p style="color:#f1f5f9;margin:4px 0;">Status: {new_status.upper()}</p>
      </div>
      <p style="color:#94a3b8;">
        Questions? Call <a href="tel:+919437611129" style="color:#00d4ff;">+91 94376 11129</a>
      </p>
    """
    return await send_email(
        order_data["customer_email"],
        f"Order {order_data.get('order_number')} — {status_label}",
        _base_template(content),
    )


async def send_test_ride_confirmation(enquiry_data: dict) -> bool:
    """
    Send a specific confirmation for test ride booking enquiries.
    Provides more detail than the generic enquiry confirmation:
    what to bring, where to come, what to expect.
    Skipped if no email address was provided.
    """
    if not enquiry_data.get("email"):
        return False

    product_name = enquiry_data.get("product_name", "an electric vehicle")
    preferred_date = enquiry_data.get("preferred_date", "a date to be confirmed")

    content = f"""
      <h2 style="color:#00d4ff;margin:0 0 16px;">Test Ride Booking Confirmed! &#9889;</h2>
      <p style="color:#94a3b8;line-height:1.7;">Hi {enquiry_data.get('name', 'there')},</p>
      <p style="color:#94a3b8;line-height:1.7;">
        Your test ride request for
        <strong style="color:#f1f5f9;">{product_name}</strong>
        has been received. Our team will call
        <strong style="color:#f1f5f9;">{enquiry_data.get('phone')}</strong>
        within 2 hours to confirm your slot.
      </p>
      <div style="background:#0f172a;border:1px solid #00d4ff;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="color:#64748b;font-size:12px;margin:0 0 12px;">TEST RIDE DETAILS</p>
        <p style="color:#f1f5f9;margin:6px 0;">Vehicle: <strong>{product_name}</strong></p>
        <p style="color:#f1f5f9;margin:6px 0;">Preferred Date: {preferred_date}</p>
        <p style="color:#f1f5f9;margin:6px 0;">Location: Konark Industry Showroom, Bhimatangi, Bhubaneswar</p>
      </div>
      <p style="color:#64748b;font-size:14px;line-height:1.7;">
        <strong style="color:#94a3b8;">What to bring:</strong><br>
        &#10003; Valid driving licence (for scooter/motorcycle)<br>
        &#10003; Comfortable riding clothes<br>
        &#10003; This email or your phone number for check-in
      </p>
      <p style="color:#94a3b8;margin-top:16px;">
        Direct enquiries: <a href="tel:+919437611129" style="color:#00d4ff;">+91 94376 11129</a>
      </p>
    """
    return await send_email(
        enquiry_data["email"],
        f"Test Ride Booking Confirmed — {product_name} | Konark Industry",
        _base_template(content),
    )
