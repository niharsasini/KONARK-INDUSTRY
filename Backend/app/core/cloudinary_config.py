"""
cloudinary_config.py - Cloudinary Image Upload Helper
Lazily configures the Cloudinary SDK from env vars and exposes a single
upload helper used by every image-upload endpoint (products, testimonials,
FAQ, etc). Returns a clear 500 if credentials aren't set rather than a
cryptic SDK error.
"""

import os
import cloudinary
import cloudinary.uploader
from fastapi import HTTPException


def _init_cloudinary() -> bool:
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if not all([cloud_name, api_key, api_secret]):
        return False

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )
    return True


async def upload_to_cloudinary(file_bytes: bytes, filename: str, folder: str = "konark-industry") -> str:
    """Uploads image bytes to Cloudinary and returns the secure CDN URL."""
    if not _init_cloudinary():
        raise HTTPException(
            status_code=500,
            detail="Image upload not configured. Please set CLOUDINARY credentials.",
        )

    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder=folder,
            public_id=filename.rsplit(".", 1)[0],
            resource_type="image",
            transformation=[
                {"width": 1200, "height": 900, "crop": "limit", "quality": "auto", "fetch_format": "auto"}
            ],
            overwrite=True,
        )
        return result["secure_url"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")
