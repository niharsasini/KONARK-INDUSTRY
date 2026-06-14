"""
products.py - Product Catalogue Endpoints
GET  /products            — list with filters (category, type, search, price, stock)
GET  /products/{slug}     — single product detail
POST /products            — create product (admin only)
PUT  /products/{slug}     — update product (admin only)
DELETE /products/{slug}   — soft delete product (admin only)
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query, Request
from app.core.limiter import limiter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.product import Product, ProductType
from app.core.dependencies import get_admin_user, get_optional_user
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])


# ---------- Request / Response schemas ----------

class ProductCreateRequest(BaseModel):
    """All fields needed to create a new product."""
    slug: str
    name: str = Field(..., min_length=2, max_length=200)
    category: str
    type: ProductType
    price: float = 0
    short_description: str = ""
    description: str = ""
    images: List[str] = []
    rating: float = Field(default=0, ge=0, le=5)
    specs: Dict[str, Any] = {}
    in_stock: bool = True
    is_new: bool = False
    is_featured: bool = False


class ProductUpdateRequest(BaseModel):
    """All fields are optional — only provided fields are updated."""
    name: Optional[str] = None
    category: Optional[str] = None
    type: Optional[ProductType] = None
    price: Optional[float] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    specs: Optional[Dict[str, Any]] = None
    in_stock: Optional[bool] = None
    is_new: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    """Product fields returned in API responses."""
    id: str
    slug: str
    name: str
    category: str
    type: str
    price: float
    short_description: str
    description: str
    images: List[str]
    rating: float
    review_count: int
    specs: Dict[str, Any]
    in_stock: bool
    is_new: bool
    is_featured: bool
    created_at: datetime


def _to_response(p: Product) -> ProductResponse:
    """Convert a Product document to the API response model."""
    return ProductResponse(
        id=str(p.id),
        slug=p.slug,
        name=p.name,
        category=p.category,
        type=p.type.value,
        price=p.price,
        short_description=p.short_description,
        description=p.description,
        images=p.images,
        rating=p.rating,
        review_count=p.review_count,
        specs=p.specs,
        in_stock=p.in_stock,
        is_new=p.is_new,
        is_featured=p.is_featured,
        created_at=p.created_at,
    )


# ---------- Endpoints ----------

@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    type: Optional[str] = Query(None, description="vehicle | product | service"),
    search: Optional[str] = Query(None, description="Search in product name, category, and description"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price in INR"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price in INR"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock availability"),
    featured: Optional[bool] = Query(None, description="Show only featured products"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=100, description="Max results per page"),
):
    """
    List all active products with optional filters.
    Builds a MongoDB filter dict progressively from query params.
    Supports pagination via skip/limit.
    """
    # Start with only active (not soft-deleted) products
    query_filter = {"is_active": True}

    if category:
        query_filter["category"] = category
    if type:
        query_filter["type"] = type
    if in_stock is not None:
        query_filter["in_stock"] = in_stock
    if featured is not None:
        query_filter["is_featured"] = featured
    if min_price is not None:
        query_filter.setdefault("price", {})["$gte"] = min_price
    if max_price is not None:
        query_filter.setdefault("price", {})["$lte"] = max_price
    if search:
        # Case-insensitive search across name, category, and description
        regex = {"$regex": search, "$options": "i"}
        query_filter["$or"] = [
            {"name": regex},
            {"category": regex},
            {"description": regex},
        ]

    products = (
        await Product.find(query_filter)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_to_response(p) for p in products]


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str):
    """
    Return a single product by its URL slug.
    Returns 404 if not found or soft-deleted.
    """
    product = await Product.find_one({"slug": slug, "is_active": True})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )
    return _to_response(product)


@limiter.limit("30/minute")
@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    request: Request,
    body: ProductCreateRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Create a new product. Admin only.
    Validates slug uniqueness before inserting.
    """
    # Ensure slug is unique across the collection
    if await Product.find_one({"slug": body.slug}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A product with slug '{body.slug}' already exists",
        )

    product = Product(**body.model_dump())
    await product.insert()
    return _to_response(product)


@limiter.limit("30/minute")
@router.put("/{slug}", response_model=ProductResponse)
async def update_product(
    request: Request,
    slug: str,
    body: ProductUpdateRequest,
    admin: User = Depends(get_admin_user),
):
    """
    Update an existing product by slug. Admin only.
    Only fields included in the request body are changed.
    """
    product = await Product.find_one({"slug": slug})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )

    # Apply only the provided fields
    update_data = body.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    product.updated_at = datetime.utcnow()
    await product.save()
    return _to_response(product)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(slug: str, admin: User = Depends(get_admin_user)):
    """
    Soft-delete a product by slug. Admin only.
    Sets is_active=False instead of removing the document,
    so order history that references the product remains intact.
    """
    product = await Product.find_one({"slug": slug})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )

    product.is_active = False
    product.updated_at = datetime.utcnow()
    await product.save()


@router.patch("/{slug}/toggle-stock", response_model=ProductResponse)
async def toggle_stock(slug: str, admin: User = Depends(get_admin_user)):
    """
    Admin: flip a product's in_stock flag between True and False.
    Out-of-stock products show an "Out of Stock" badge on the product page.
    """
    product = await Product.find_one({"slug": slug})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )

    product.in_stock = not product.in_stock
    product.updated_at = datetime.utcnow()
    await product.save()
    return _to_response(product)


@router.patch("/{slug}/toggle-featured", response_model=ProductResponse)
async def toggle_featured(slug: str, admin: User = Depends(get_admin_user)):
    """
    Admin: flip a product's is_featured flag.
    Featured products appear in the homepage featured section.
    """
    product = await Product.find_one({"slug": slug})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found",
        )

    product.is_featured = not product.is_featured
    product.updated_at = datetime.utcnow()
    await product.save()
    return _to_response(product)
