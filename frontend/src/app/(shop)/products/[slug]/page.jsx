"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/components/product/ProductData";
import { getProduct } from "@/lib/api";
import VehicleDetail from "@/components/product/detail/VehicleDetail";
import ProductDetail from "@/components/product/detail/ProductDetail";
import ServiceDetail from "@/components/product/detail/ServiceDetail";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ui/JsonLd";

/* ─── Router ─────────────────────────────────────── */

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(() => products.find((p) => p.slug === slug) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(slug)
      .then((data) => {
        if (data) {
          setProduct((prev) => ({
            ...(prev || {}),
            id: data.id,
            name: data.name,
            category: data.category,
            type: data.type,
            price: data.price,
            description: data.description || data.short_description || prev?.description,
            image: data.images?.[0] || prev?.image || "",
            images: data.images?.length ? data.images : prev?.images || [],
            rating: data.rating ?? prev?.rating ?? 0,
            isNew: data.is_new ?? prev?.isNew ?? false,
            inStock: data.in_stock ?? prev?.inStock ?? true,
            specifications: data.specs || prev?.specifications || {},
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading && !product) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "#94a3b8" }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 20, color: "#ef4444", fontWeight: 600 }}>Product not found</p>
        <Link href="/products" style={{ color: "#00d4ff", textDecoration: "none", fontSize: 14 }}>← Back to Products</Link>
      </div>
    );
  }

  const jsonLdProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    image: product.image,
    price: product.price,
    in_stock: product.inStock,
    rating: product.rating,
    review_count: product.review_count,
    slug: product.slug,
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.name },
  ];

  return (
    <>
      <ProductJsonLd product={jsonLdProduct} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {product.type === "vehicle" ? (
        <VehicleDetail product={product} />
      ) : product.type === "service" ? (
        <ServiceDetail product={product} />
      ) : (
        <ProductDetail product={product} />
      )}
    </>
  );
}
