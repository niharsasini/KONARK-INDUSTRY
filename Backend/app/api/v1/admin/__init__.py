"""
admin package - Admin Dashboard Endpoints
Split from a single 667-line admin.py into focused modules:
  dashboard.py     — stats, recent-activity
  customers.py     — customer list/detail/export/toggle
  analytics.py     — daily/top-products/revenue/status/type breakdowns
  settings.py      — site settings read/update
  notifications.py — admin notification list/read/mark-all-read

This __init__ combines them into the same `router` object that
router.py imports, so the mount point (/api/v1/admin/...) and every
existing path are unchanged.
"""

from fastapi import APIRouter

from . import dashboard, customers, analytics, settings, notifications

router = APIRouter(prefix="/admin", tags=["Admin"])
router.include_router(dashboard.router)
router.include_router(customers.router)
router.include_router(analytics.router)
router.include_router(settings.router)
router.include_router(notifications.router)
