"""
enquiry_service.py - Enquiry Business Logic Helpers
CSV export and bulk operations for the admin enquiry management panel.
"""

import csv
import io
from typing import List
from app.models.enquiry import Enquiry
import logging

logger = logging.getLogger(__name__)


async def bulk_mark_read(enquiry_ids: List[str]) -> int:
    """
    Mark multiple enquiries as read in one operation.
    Returns the count of actually updated documents.
    Used by the "Select All → Mark Read" button in the admin panel.
    """
    count = 0
    for eid in enquiry_ids:
        enquiry = await Enquiry.get(eid)
        if enquiry and not enquiry.is_read:
            enquiry.is_read = True
            await enquiry.save()
            count += 1
    return count


async def export_enquiries_to_csv(enquiries: List[Enquiry]) -> str:
    """
    Convert a list of Enquiry documents to a CSV string.
    Returns the CSV content as a string for StreamingResponse.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Name",
        "Phone",
        "Email",
        "Type",
        "Product",
        "Service",
        "City",
        "Urgency",
        "Message",
        "Status",
        "Read",
        "Date",
    ])

    for e in enquiries:
        writer.writerow([
            e.name,
            e.phone,
            e.email or "",
            e.enquiry_type.value,
            e.product_name or "",
            e.service_type or "",
            e.city or "",
            e.urgency.value,
            e.message[:200],
            e.status.value,
            "Yes" if e.is_read else "No",
            e.created_at.strftime("%Y-%m-%d %H:%M"),
        ])

    return output.getvalue()
