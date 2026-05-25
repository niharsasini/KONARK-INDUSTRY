"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { products as allProducts } from "@/components/product/ProductData";

const CATEGORIES = ["All", "Electric Vehicles", "Batteries", "Home Appliances", "Industrial Equipment", "Industrial Components", "Electronics"];

const BADGE_COLORS = {
  "Electric Vehicles": "#00d4ff",
  "Batteries": "#7c3aed",
  "Home Appliances": "#10b981",
  "Industrial Equipment": "#f97316",
  "Industrial Components": "#f97316",
  "Electronics": "#94a3b8",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "rating", label: "Top Rated" },
];

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 11, height: 11 }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{rating}</span>
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#0f172a", border: `1px solid ${hovered ? "#2d4a6b" : "#1e2d40"}`, borderRadius: 14, overflow: "hidden", transition: "all 0.2s", transform: hovered ? "translateY(-2px)" : "none", display: "flex", flexDirection: "column" }}
    >
      <div style={{ background: "#111827", height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src={product.image} alt={product.name} loading="lazy" style={{ maxHeight: 160, maxWidth: "90%", objectFit: "contain" }} />
        {product.isNew && (
          <span style={{ position: "absolute", top: 8, left: 8, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase" }}>NEW</span>
        )}
      </div>
      <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {product.category}
        </span>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0, lineHeight: 1.4 }}>{product.name}</p>
        <StarRating rating={product.rating} />
        <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
          {product.price ? `₹${product.price.toLocaleString("en-IN")}` : <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>Price on Request</span>}
        </p>
        <Link
          href={`/products/${product.slug}`}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "7px", border: "1px solid #00d4ff", borderRadius: 7, color: "#00d4ff", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", marginTop: "auto" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#00d4ff"; e.currentTarget.style.color = "#0a0f1e"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00d4ff"; }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCategory = (cat) => {
    if (cat === "All") { setSelectedCategories(["All"]); return; }
    setSelectedCategories((prev) => {
      const without = prev.filter((c) => c !== "All");
      return without.includes(cat) ? without.filter((c) => c !== cat) || ["All"] : [...without, cat];
    });
  };

  const filtered = useMemo(() => {
    let list = selectedCategories.includes("All") ? allProducts : allProducts.filter((p) => selectedCategories.includes(p.category));
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (sortBy === "price-asc") list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [selectedCategories, minRating, sortBy]);

  const Sidebar = () => (
    <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Filters</h3>
        <button onClick={() => { setSelectedCategories(["All"]); setMinRating(0); setSortBy("newest"); }} style={{ fontSize: 12, color: "#00d4ff", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>Reset</button>
      </div>

      {/* Categories */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Category</p>
        {CATEGORIES.map((cat) => (
          <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer", borderBottom: "1px solid #1e2d4040" }}>
            <input
              type="checkbox"
              checked={cat === "All" ? selectedCategories.includes("All") : selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              style={{ accentColor: "#00d4ff", width: 14, height: 14, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: selectedCategories.includes(cat) || (cat === "All" && selectedCategories.includes("All")) ? "#f1f5f9" : "#94a3b8" }}>{cat}</span>
          </label>
        ))}
      </div>

      {/* Rating */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Minimum Rating</p>
        <button
          onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1px solid ${minRating === 4 ? "#00d4ff" : "#1e2d40"}`, borderRadius: 6, background: minRating === 4 ? "rgba(0,212,255,0.1)" : "transparent", color: minRating === 4 ? "#00d4ff" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
        >
          4★ & above
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e2d40", padding: "80px 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12, fontSize: 12, color: "#94a3b8" }}>
            <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#00d4ff" }}>Products</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 10px" }}>All Products</h1>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: 0 }}>50+ products across EVs, batteries, appliances, and industrial solutions</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {/* Mobile filter button */}
        <div className="show-mobile-filter" style={{ marginBottom: 16, display: "none" }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", border: "1px solid #1e2d40", borderRadius: 8, background: "transparent", color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filters
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }} className="products-layout">
          {/* Sidebar */}
          <div className="hide-mobile-filter">
            <Sidebar />
          </div>

          {/* Grid */}
          <div>
            {/* Sort bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Showing <strong style={{ color: "#f1f5f9" }}>{filtered.length}</strong> products</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: "#0f172a", border: "1px solid #1e2d40", color: "#f1f5f9", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none", cursor: "pointer" }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8" }}>
                <p style={{ fontSize: 16 }}>No products match your filters.</p>
                <button onClick={() => { setSelectedCategories(["All"]); setMinRating(0); }} style={{ marginTop: 12, padding: "8px 20px", background: "#00d4ff", color: "#0a0f1e", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Clear Filters</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div onClick={() => setDrawerOpen(false)} style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} />
          <div style={{ width: 300, background: "#0a0f1e", borderLeft: "1px solid #1e2d40", padding: 20, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "#f1f5f9" }}>Filters</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr !important; }
          .hide-mobile-filter { display: none !important; }
          .show-mobile-filter { display: block !important; }
        }
      `}</style>
    </div>
  );
}
