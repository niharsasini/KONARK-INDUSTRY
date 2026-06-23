"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { products as staticProducts } from "@/components/product/ProductData";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

const CATEGORIES = ["All", "Electric Vehicles", "Batteries", "Home Appliances", "Industrial Equipment", "Industrial Components", "Electronics"];
const TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "vehicle", label: "🏍 EV Vehicles" },
  { value: "product", label: "🛒 Home & Industrial" },
  { value: "service", label: "🔧 Services" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "rating", label: "Most Popular" },
];

/** Normalizes a backend ProductResponse (snake_case) to the camelCase shape ProductCard expects. */
function normalizeProduct(p) {
  return {
    ...p,
    isNew: p.is_new ?? p.isNew ?? false,
    inStock: p.in_stock ?? p.inStock ?? true,
    shortDescription: p.short_description ?? p.shortDescription,
    image: p.images?.[0] || p.image,
  };
}

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [productsList, setProductsList] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProductsList(Array.isArray(data) ? data.map(normalizeProduct) : null))
      .catch(() => {});
  }, []);

  const allProducts = productsList ?? staticProducts;

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
  }, [selectedCategories, typeFilter, minRating, sortBy, priceRange, productsList]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [allProducts]);

  const Sidebar = () => (
    <div style={{ background: "rgba(13, 20, 36, 0.8)", backdropFilter: "blur(20px)", border: "1px solid #1c3050", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Filters</h3>
        <button onClick={() => { setSelectedCategories(["All"]); setMinRating(0); setSortBy("newest"); setTypeFilter("all"); setPriceRange([0, 200000]); }} style={{ fontSize: 12, color: "#38bdf8", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>Reset</button>
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
              border: `1px solid ${typeFilter === t.value ? "#38bdf8" : "transparent"}`,
              borderRadius: 8, background: typeFilter === t.value ? "rgba(56,189,248,0.08)" : "transparent",
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
          <label key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "7px 0", cursor: "pointer", borderBottom: "1px solid #1c305080" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={cat === "All" ? selectedCategories.includes("All") : selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{ accentColor: "#38bdf8", width: 14, height: 14, cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, color: selectedCategories.includes(cat) || (cat === "All" && selectedCategories.includes("All")) ? "#f8fafc" : "#94a3b8" }}>{cat}</span>
            </span>
            <span style={{ fontSize: 11, color: "#64748b", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: 100 }}>
              {cat === "All" ? allProducts.length : categoryCounts[cat] || 0}
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Price Range</p>
        <p style={{ fontSize: 12, color: "#38bdf8", fontWeight: 600, marginBottom: 10 }}>
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
              style={{ width: "100%", background: "#080f1e", border: "1px solid #1c3050", borderRadius: 6, padding: "6px 8px 6px 20px", color: "#f1f5f9", fontSize: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1c3050")}
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
              style={{ width: "100%", background: "#080f1e", border: "1px solid #1c3050", borderRadius: 6, padding: "6px 8px 6px 20px", color: "#f1f5f9", fontSize: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1c3050")}
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
          style={{ width: "100%", accentColor: "#38bdf8" }}
        />
      </div>

      {/* Rating */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Minimum Rating</p>
        <button
          onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1px solid ${minRating === 4 ? "#38bdf8" : "#1c3050"}`, borderRadius: 6, background: minRating === 4 ? "rgba(56,189,248,0.1)" : "transparent", color: minRating === 4 ? "#38bdf8" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
        >
          4★ & above
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "linear-gradient(135deg, #050a14 0%, #080f1e 30%, #0c1525 60%, #050a14 100%)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#0c1525", borderBottom: "1px solid #1c3050", padding: "80px 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12, fontSize: 12, color: "#94a3b8" }}>
            <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#38bdf8" }}>Products</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "0 0 10px" }}>
            <span style={{ color: "#f8fafc" }}>Explore Our </span>
            <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Full Range</span>
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: 0 }}>EVs to book a test ride · Products to buy online · Services to book a technician</p>
        </div>
      </div>

      {/* EV Vehicles banner (shown when type=vehicle selected) */}
      {typeFilter === "vehicle" && (
        <div style={{ maxWidth: 1280, margin: "24px auto 0", padding: "0 24px" }}>
          <div style={{
            padding: "18px 24px",
            background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.06))",
            border: "1px solid rgba(56,189,248,0.2)", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>
                🏍 Book a test ride at our Bhubaneswar showroom. No pressure, just drive.
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                Call <a href="tel:+919437611129" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a> to schedule · Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002
              </p>
            </div>
            <Link href="/test-ride" style={{ padding: "9px 20px", background: "#38bdf8", color: "#080f1e", fontWeight: 700, fontSize: 13, borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
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
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", border: "1px solid #1c3050", borderRadius: 8, background: "transparent", color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filters
            {typeFilter !== "all" && <span style={{ background: "#38bdf8", color: "#080f1e", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 100, marginLeft: 4 }}>1</span>}
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
                style={{ background: "#0c1525", border: "1px solid #1c3050", color: "#f1f5f9", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none", cursor: "pointer" }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8" }}>
                <p style={{ fontSize: 16 }}>No products match your filters.</p>
                <button onClick={() => { setSelectedCategories(["All"]); setMinRating(0); setTypeFilter("all"); }} style={{ marginTop: 12, padding: "8px 20px", background: "#38bdf8", color: "#080f1e", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Clear Filters</button>
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
          <div style={{ width: 300, background: "#080f1e", borderLeft: "1px solid #1c3050", padding: 20, overflowY: "auto" }}>
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
