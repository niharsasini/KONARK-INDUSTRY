import { useEffect, useState } from "react";

export interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  type: string;
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  short_description: string;
}

let cachedProducts: FeaturedProduct[] | null = null;
let inFlight: Promise<FeaturedProduct[] | null> | null = null;

async function fetchJson(url: string): Promise<FeaturedProduct[] | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data : null;
}

function fetchFeatured(): Promise<FeaturedProduct[] | null> {
  if (cachedProducts) return Promise.resolve(cachedProducts);
  if (inFlight) return inFlight;

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const base = `${BACKEND}/api/v1/products`;

  inFlight = fetchJson(`${base}?featured=true&in_stock=true&limit=8`)
    .then((featured) => {
      if (featured && featured.length > 0) return featured;
      // No admin-curated products yet — fall back to newest in-stock products
      return fetchJson(`${base}?in_stock=true&limit=8`);
    })
    .then((data) => {
      if (data && data.length > 0) cachedProducts = data;
      return data;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** Admin-curated products for the homepage hero deck, via GET /products?featured=true. Returns null while loading or on failure so callers can fall back to static data. */
export function useFeaturedProducts(): FeaturedProduct[] | null {
  const [products, setProducts] = useState<FeaturedProduct[] | null>(cachedProducts);

  useEffect(() => {
    if (cachedProducts) {
      setProducts(cachedProducts);
      return;
    }
    fetchFeatured().then((data) => {
      if (data) setProducts(data);
    });
  }, []);

  return products;
}
