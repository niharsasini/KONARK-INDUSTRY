"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products as allProducts } from "@/components/product/ProductData";

const CATEGORIES = ["All", "Electric Vehicles", "Batteries", "Home Appliances", "Industrial Equipment", "Industrial Components", "Electronics"];
const TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "vehicle", label: "🏍 EV Vehicles" },
  { value: "product", label: "🛒 Home & Industrial" },
  { value: "service", label: "🔧 Services" },
];

const BADGE_COLORS = {
  "Electric Vehicles": "#00d4ff",
  Batteries: "#7c3aed",
  "Home Appliances": "#10b981",
  "Industrial Equipment": "#f97316",
  "Industrial Components": "#f97316",
  Electronics: "#94a3b8",
  "Industrial Services": "#a78bfa",
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
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 11, height: 11 }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{rating}</span>
    </div>
  );
}

function ProductCard({ product }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";
  const isVehicle = product.type === "vehicle";
  const isService = product.type === "service";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0f172a",
        border: `1px solid ${hovered
          ? isVehicle ? "rgba(0,212,255,0.3)" : isService ? "rgba(167,139,250,0.3)" : "rgba(16,185,129,0.25)"
          : "#1e2d40"}`,
        borderRadius: 14, overflow: "hidden",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ background: "#111827", height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src={product.image} alt={product.name} loading="lazy" style={{ maxHeight: 160, maxWidth: "90%", objectFit: "contain" }} />
        {product.isNew && (
          <span style={{ position: "absolute", top: 8, left: 8, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>NEW</span>
        )}
        {/* Type badge */}
        {isVehicle && (
          <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>⚡ EV</span>
        )}
        {isService && (
          <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>Free Quote</span>
        )}
        {!isVehicle && !isService && (
          <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>● In Stock</span>
        )}
      </div>
      <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {product.category}
        </span>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0, lineHeight: 1.4 }}>{product.name}</p>
        {!isService && <StarRating rating={product.rating} />}

        {/* Price / CTA label */}
        {isService ? (
          <p style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, margin: 0 }}>💜 Free inspection · Then quote</p>
        ) : isVehicle ? (
          <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            {product.price ? <><span style={{ fontSize: 11, color: "#64748b" }}>from </span><span style={{ color: "#00d4ff" }}>₹{product.price.toLocaleString("en-IN")}</span></> : <span style={{ color: "#64748b", fontWeight: 400, fontSize: 12 }}>Price on Request</span>}
          </p>
        ) : (
          <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            {product.price ? `₹${product.price.toLocaleString("en-IN")}` : <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>Price on Request</span>}
          </p>
        )}

        {/* Action button */}
        {isVehicle ? (
          <Link href={`/products/${product.slug}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", background: "#00d4ff", color: "#0a0f1e", fontSize: 12, fontWeight: 700, borderRadius: 7, textDecoration: "none", marginTop: "auto" }}>
            Book Test Ride →
          </Link>
        ) : isService ? (
          <Link href="/services/enquiry"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 7, textDecoration: "none", marginTop: "auto" }}>
            Book Service →
          </Link>
        ) : (
          <Link href={`/products/${product.slug}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", border: "1px solid #00d4ff", color: "#00d4ff", fontSize: 12, fontWeight: 600, borderRadius: 7, textDecoration: "none", transition: "all 0.2s", marginTop: "auto" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#00d4ff"; e.currentTarget.style.color = "#0a0f1e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00d4ff"; }}
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);

  const toggleCategory = (cat) => {
    if (cat === "All") { setSelectedCategories(["All"]); return; }
    setSelectedCategories((prev) => {
      const without = prev.filter((c) => c !== "All");
      return without.includes(cat) ? (without.filter((c) => c !== cat).length ? without.filter((c) => c !== cat) : ["All"]) : [...without, cat];
    });
  };

  const filtered = useMemo(() => {
    let list = selectedCategories.includes("All") ? allProducts : allProducts.filter((p) => selectedCategories.includes(p.category));
    if (typeFilter !== "all") list = list.filter((p) => p.type === typeFilter);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (priceRange[0] > 0 || priceRange[1] < 200000) {
      list = list.filter((p) => p.price === 0 || (p.price >= priceRange[0] && p.price <= priceRange[1]));
    }
    if (sortBy === "price-asc") list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [selectedCategories, typeFilter, minRating, sortBy, priceRange]);

  const Sidebar = () => (
    <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Filters</h3>
        <button onClick={() => { setSelectedCategories(["All"]); setMinRating(0); setSortBy("newest"); setTypeFilter("all"); setPriceRange([0, 200000]); }} style={{ fontSize: 12, color: "#00d4ff", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>Reset</button>
      </div>

      {/* Type filter */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Type</p>
        {TYPE_FILTERS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTypeFilter(t.value)}
            style={{
              display: "flex", alignItems: "center", width: "100%",
              gap: 8, padding: "7px 10px", marginBottom: 4, cursor: "pointer",
              border: `1px solid ${typeFilter === t.value ? "#00d4ff" : "transparent"}`,
              borderRadius: 8, background: typeFilter === t.value ? "rgba(0,212,255,0.08)" : "transparent",
              color: typeFilter === t.value ? "#f1f5f9" : "#94a3b8",
              fontSize: 13, fontWeight: typeFilter === t.value ? 600 : 400, transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
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

      {/* Price Range */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Price Range</p>
        <p style={{ fontSize: 12, color: "#00d4ff", fontWeight: 600, marginBottom: 10 }}>
          ₹{priceRange[0].toLocaleString("en-IN")} — ₹{priceRange[1].toLocaleString("en-IN")}
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#64748b" }}>₹</span>
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
              style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 6, padding: "6px 8px 6px 20px", color: "#f1f5f9", fontSize: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
            />
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#64748b" }}>₹</span>
            <input
              type="number"
              min={priceRange[0]}
              max={200000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
              style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 6, padding: "6px 8px 6px 20px", color: "#f1f5f9", fontSize: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
            />
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={200000}
          step={1000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          style={{ width: "100%", accentColor: "#00d4ff" }}
        />
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
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 10px" }}>All Products & Services</h1>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: 0 }}>EVs to book a test ride · Products to buy online · Services to book a technician</p>
        </div>
      </div>

      {/* EV Vehicles banner (shown when type=vehicle selected) */}
      {typeFilter === "vehicle" && (
        <div style={{ maxWidth: 1280, margin: "24px auto 0", padding: "0 24px" }}>
          <div style={{
            padding: "18px 24px",
            background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.06))",
            border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>
                🏍 Book a test ride at our Bhubaneswar showroom. No pressure, just drive.
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                Call <a href="tel:+919437611129" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a> to schedule · Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002
              </p>
            </div>
            <Link href="/test-ride" style={{ padding: "9px 20px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
              Book Test Ride →
            </Link>
          </div>
        </div>
      )}

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
            {typeFilter !== "all" && <span style={{ background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 100, marginLeft: 4 }}>1</span>}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }} className="products-layout">
          <div className="hide-mobile-filter"><Sidebar /></div>

          <div>
            {/* Sort bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Showing <strong style={{ color: "#f1f5f9" }}>{filtered.length}</strong> results</p>
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
                <button onClick={() => { setSelectedCategories(["All"]); setMinRating(0); setTypeFilter("all"); }} style={{ marginTop: 12, padding: "8px 20px", background: "#00d4ff", color: "#0a0f1e", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Clear Filters</button>
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
