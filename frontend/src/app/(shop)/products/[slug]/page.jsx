"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { products } from "@/components/product/ProductData";
import EnquiryModal from "@/components/forms/EnquiryModal";

const BADGE_COLORS = {
  "Electric Vehicles": "#00d4ff",
  "Batteries": "#7c3aed",
  "Home Appliances": "#10b981",
  "Industrial Equipment": "#f97316",
  "Industrial Components": "#f97316",
  "Electronics": "#94a3b8",
};

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 14, height: 14 }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: 13, color: "#94a3b8" }}>({rating})</span>
    </div>
  );
}

const STATIC_REVIEWS = [
  { name: "Amit Das", date: "Jan 2024", rating: 5, text: "Excellent build quality. Arrived well-packaged and works exactly as described. Very happy with the purchase." },
  { name: "Priya Singh", date: "Nov 2023", rating: 4, text: "Good product overall. Setup was straightforward and the performance is solid. Would recommend." },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [qty, setQty] = useState(1);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const product = products.find((p) => p.slug === slug);
  const related = products.filter((p) => p.category === product?.category && p.slug !== slug).slice(0, 4);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 20, color: "#ef4444", fontWeight: 600 }}>Product not found</p>
        <Link href="/products" style={{ color: "#00d4ff", textDecoration: "none", fontSize: 14 }}>← Back to Products</Link>
      </div>
    );
  }

  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";
  const formattedPrice = product.price ? `₹${product.price.toLocaleString("en-IN")}` : null;
  const specs = product.specifications ? Object.entries(product.specifications) : [];

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", alignItems: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "#94a3b8", textDecoration: "none" }}>Products</Link>
        <span>/</span>
        <span style={{ color: "#00d4ff" }}>{product.name}</span>
      </div>

      {/* Main two-col */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "45% 55%", gap: 40, alignItems: "start" }} className="detail-grid">
        {/* LEFT: image */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340, position: "relative" }}>
            {product.isNew && (
              <span style={{ position: "absolute", top: 16, left: 16, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, textTransform: "uppercase" }}>NEW</span>
            )}
            <img src={product.image} alt={product.name} style={{ maxHeight: 280, maxWidth: "85%", objectFit: "contain", filter: "drop-shadow(0 4px 20px rgba(0,212,255,0.15))" }} />
          </div>
        </div>

        {/* RIGHT: details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Category badge */}
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: "uppercase", letterSpacing: "0.08em", width: "fit-content" }}>
            {product.category}
          </span>

          <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "#f1f5f9", margin: 0, lineHeight: 1.2 }}>{product.name}</h1>

          <StarRating rating={product.rating} />

          <p style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: formattedPrice ? "#f1f5f9" : "#94a3b8", margin: 0, fontStyle: formattedPrice ? "normal" : "italic" }}>
            {formattedPrice ? <span style={{ color: "#00d4ff" }}>{formattedPrice}</span> : "Price on Request"}
          </p>

          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{product.shortDescription || product.description}</p>

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Qty:</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #1e2d40", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, cursor: "pointer", transition: "background 0.15s" }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>+</button>
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              style={{ padding: "14px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 15, borderRadius: 10, border: "none", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
            >
              Add to Cart
            </button>
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{ padding: "14px", background: "transparent", color: "#f1f5f9", fontWeight: 600, fontSize: 15, borderRadius: 10, border: "1px solid #1e2d40", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
            >
              Enquire Now
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["🛡 2-Year Warranty", "🚚 Free Delivery", "↩ Easy Returns"].map((t) => (
              <span key={t} style={{ fontSize: 12, color: "#94a3b8", background: "#0f172a", border: "1px solid #1e2d40", padding: "5px 10px", borderRadius: 6 }}>{t}</span>
            ))}
          </div>

          {/* Key highlights */}
          {specs.length > 0 && (
            <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Key Highlights</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {specs.slice(0, 6).map(([k, v]) => (
                  <li key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ color: "#10b981", flexShrink: 0 }}>✓</span>
                    <span><strong style={{ color: "#f1f5f9" }}>{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs accordion */}
          {specs.length > 0 && (
            <div style={{ border: "1px solid #1e2d40", borderRadius: 10 }}>
              <button
                onClick={() => setSpecsOpen((o) => !o)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "transparent", border: "none", color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Full Specifications
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, transform: specsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </button>
              {specsOpen && (
                <div style={{ borderTop: "1px solid #1e2d40", padding: "0 16px 16px" }}>
                  {specs.map(([k, v], i) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < specs.length - 1 ? "1px solid #1e2d40" : "none" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs section */}
      <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 24px" }}>
        {/* Tab buttons */}
        <div style={{ display: "flex", borderBottom: "1px solid #1e2d40", gap: 0, marginBottom: 28 }}>
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#00d4ff" : "transparent"}`, color: activeTab === tab ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, maxWidth: 720 }}>{product.description}</p>
        )}

        {activeTab === "specifications" && specs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px", maxWidth: 720 }}>
            {specs.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d40" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
            {STATIC_REVIEWS.map((r) => (
              <div key={r.name} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{r.name}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{r.date}</span>
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                  {[1,2,3,4,5].map((s) => <svg key={s} viewBox="0 0 20 20" fill={s <= r.rating ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 13, height: 13 }}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 24px 60px" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>Related Products</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, overflow: "hidden", textDecoration: "none", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d4a6b")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
              >
                <div style={{ background: "#111827", height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={p.image} alt={p.name} loading="lazy" style={{ maxHeight: 120, maxWidth: "90%", objectFit: "contain" }} />
                </div>
                <div style={{ padding: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 4px" }}>{p.name}</p>
                  <p style={{ fontSize: 13, color: "#00d4ff", margin: 0, fontWeight: 700 }}>{p.price ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} product={product} />

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
