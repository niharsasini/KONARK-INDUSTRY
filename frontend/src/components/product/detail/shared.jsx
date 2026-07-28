import Link from "next/link";
import Image from "next/image";
import { products } from "@/components/product/ProductData";

/* ─── Shared helpers used across Vehicle / Product / Service detail pages ─── */

export const BADGE_COLORS = {
  "Electric Vehicles": "var(--navy)",
  Batteries: "#5b21b6",
  "Home Appliances": "#1a7a4a",
  "Industrial Equipment": "var(--gold)",
  "Industrial Components": "var(--gold)",
  Electronics: "var(--text-muted)",
  "Industrial Services": "#9a6419",
};

export function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "var(--gold)" : "none"} stroke="var(--gold)" strokeWidth={1.5} style={{ width: size, height: size }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: size - 1, color: "var(--text-muted)" }}>({rating})</span>
    </div>
  );
}

export function RelatedProducts({ current }) {
  const related = products.filter((p) => p.category === current.category && p.slug !== current.slug).slice(0, 4);
  if (!related.length) return null;
  return (
    <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 24px 60px" }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", marginBottom: 20 }}>Related Products</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {related.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12, overflow: "hidden", textDecoration: "none", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
          >
            <div style={{ background: "var(--bg-surface)", height: 140, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 10 }} />
            </div>
            <div style={{ padding: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)", margin: "0 0 4px" }}>{p.name}</p>
              <p style={{ fontSize: 13, color: "var(--gold)", margin: 0, fontWeight: 700 }}>{p.price ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
