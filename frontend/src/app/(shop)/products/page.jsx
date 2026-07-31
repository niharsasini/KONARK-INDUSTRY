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

const SORT_ARROW_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230D518C' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")";

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

function SkeletonCard() {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 20, boxShadow: "6px 6px 16px rgba(13,81,140,0.07), -4px -4px 12px rgba(255,255,255,0.95)", overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 220 }} />
      <div style={{ padding: "16px 18px 18px" }}>
        <div className="skeleton" style={{ height: 10, width: "40%", borderRadius: 4, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 16, width: "85%", borderRadius: 4, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 4, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 44, width: "100%", borderRadius: 10 }} />
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
  const [productsList, setProductsList] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const resetFilters = () => {
    setSelectedCategories(["All"]);
    setMinRating(0);
    setSortBy("newest");
    setTypeFilter("all");
    setPriceRange([0, 200000]);
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
    <div
      className="products-filter-panel"
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0C1A2E", margin: 0 }}>Filters</h3>
        <button
          onClick={resetFilters}
          style={{ fontSize: 13, color: "#8BA8C4", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8BA8C4")}
        >
          Reset
        </button>
      </div>

      {/* Type filter */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#8BA8C4", letterSpacing: "2px", textTransform: "uppercase", marginTop: 20, marginBottom: 10 }}>Type</p>
        {TYPE_FILTERS.map((t) => {
          const active = typeFilter === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              style={{
                display: "flex", alignItems: "center", gap: 6, width: "100%",
                padding: "8px 14px", marginBottom: 6, borderRadius: 10, cursor: "pointer",
                fontSize: 13, fontWeight: 500, transition: "all 0.2s ease",
                background: active ? "linear-gradient(135deg, #0D518C, #0EA5E9)" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#4A6785",
                border: active ? "none" : "1px solid rgba(13,81,140,0.1)",
                boxShadow: active
                  ? "0 4px 12px rgba(13,81,140,0.25)"
                  : "3px 3px 8px rgba(13,81,140,0.06), -2px -2px 6px rgba(255,255,255,0.9)",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(13,81,140,0.25)"; e.currentTarget.style.color = "#0D518C"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(13,81,140,0.1)"; e.currentTarget.style.color = "#4A6785"; } }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Categories */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#8BA8C4", letterSpacing: "2px", textTransform: "uppercase", marginTop: 20, marginBottom: 10 }}>Category</p>
        {CATEGORIES.map((cat) => {
          const checked = cat === "All" ? selectedCategories.includes("All") : selectedCategories.includes(cat);
          return (
            <label key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 0", cursor: "pointer" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  onClick={(e) => { e.preventDefault(); toggleCategory(cat); }}
                  style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: checked ? "none" : "1.5px solid rgba(13,81,140,0.2)",
                    background: checked ? "linear-gradient(135deg, #0D518C, #0EA5E9)" : "#FFFFFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {checked && (
                    <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10 }}>
                      <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#0C1A2E" }}>{cat}</span>
              </span>
              <span style={{ background: "rgba(13,81,140,0.08)", color: "#0D518C", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
                {cat === "All" ? allProducts.length : categoryCounts[cat] || 0}
              </span>
            </label>
          );
        })}
      </div>

      {/* Price Range */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#8BA8C4", letterSpacing: "2px", textTransform: "uppercase", marginTop: 20, marginBottom: 10 }}>Price Range</p>
        <p style={{ fontSize: 12, color: "#0D518C", fontWeight: 600, marginBottom: 10 }}>
          ₹{priceRange[0].toLocaleString("en-IN")} — ₹{priceRange[1].toLocaleString("en-IN")}
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#8BA8C4" }}>₹</span>
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
              style={{ width: "100%", background: "#F5F7FF", border: "1px solid rgba(13,81,140,0.1)", borderRadius: 8, padding: "6px 8px 6px 20px", color: "#0C1A2E", fontSize: 12, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#8BA8C4" }}>₹</span>
            <input
              type="number"
              min={priceRange[0]}
              max={200000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
              style={{ width: "100%", background: "#F5F7FF", border: "1px solid rgba(13,81,140,0.1)", borderRadius: 8, padding: "6px 8px 6px 20px", color: "#0C1A2E", fontSize: 12, outline: "none", boxSizing: "border-box" }}
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
          style={{ width: "100%", accentColor: "#0D518C" }}
        />
      </div>

      {/* Rating */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#8BA8C4", letterSpacing: "2px", textTransform: "uppercase", marginTop: 20, marginBottom: 10 }}>Minimum Rating</p>
        <button
          onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 500, transition: "all 0.2s ease",
            background: minRating === 4 ? "linear-gradient(135deg, #0D518C, #0EA5E9)" : "#FFFFFF",
            color: minRating === 4 ? "#FFFFFF" : "#4A6785",
            border: minRating === 4 ? "none" : "1px solid rgba(13,81,140,0.1)",
            boxShadow: minRating === 4
              ? "0 4px 12px rgba(13,81,140,0.25)"
              : "3px 3px 8px rgba(13,81,140,0.06), -2px -2px 6px rgba(255,255,255,0.9)",
          }}
        >
          4★ & above
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#F5F7FF", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, #EEF2FF 0%, #F5F7FF 100%)", padding: "calc(68px + var(--banner-h, 0px) + 40px) 28px 40px", borderBottom: "1px solid rgba(13,81,140,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12, fontSize: 12, color: "#8BA8C4" }}>
              <Link href="/" style={{ color: "#8BA8C4", textDecoration: "none" }}>Home</Link>
              <span>→</span>
              <span style={{ color: "#0D518C" }}>Products</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.5px", color: "#0C1A2E", margin: "0 0 10px" }}>
              Explore Our Full Range
            </h1>
            <p style={{ fontSize: 14, color: "#4A6785", margin: 0 }}>EVs to book · Products to buy · Services to book</p>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              boxShadow: "5px 5px 12px rgba(13,81,140,0.08), -4px -4px 10px rgba(255,255,255,0.95)",
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "#0D518C",
              whiteSpace: "nowrap",
            }}
          >
            {allProducts.length} Products Available
          </div>
        </div>
      </div>

      {/* EV Vehicles banner (shown when type=vehicle selected) */}
      {typeFilter === "vehicle" && (
        <div style={{ maxWidth: 1280, margin: "24px auto 0", padding: "0 24px" }}>
          <div style={{
            padding: "18px 24px",
            background: "rgba(13,81,140,0.06)",
            border: "1px solid rgba(13,81,140,0.15)", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0C1A2E", margin: "0 0 4px" }}>
                🏍 Book a test ride at our Bhubaneswar showroom. No pressure, just drive.
              </p>
              <p style={{ fontSize: 13, color: "#4A6785", margin: 0 }}>
                Call <a href="tel:+919437611129" style={{ color: "#0D518C", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a> to schedule · Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002
              </p>
            </div>
            <Link href="/test-ride" style={{ padding: "9px 20px", background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#fff", fontWeight: 700, fontSize: 13, borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(13,81,140,0.25)" }}>
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
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", border: "1px solid rgba(13,81,140,0.15)", borderRadius: 10, background: "#FFFFFF", color: "#0C1A2E", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "3px 3px 8px rgba(13,81,140,0.06), -2px -2px 6px rgba(255,255,255,0.9)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filters
            {typeFilter !== "all" && <span style={{ background: "#0D518C", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 100, marginLeft: 4 }}>1</span>}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }} className="products-layout">
          <div className="hide-mobile-filter products-filter-sidebar" style={{ position: "sticky", top: "calc(68px + var(--banner-h, 0px) + 20px)" }}>
            <Sidebar />
          </div>

          <div>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
              <p style={{ fontSize: 14, color: "#4A6785", fontWeight: 500, margin: 0 }}>
                Showing <span style={{ color: "#0D518C", fontWeight: 700 }}>{filtered.length}</span> results
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#FFFFFF", border: "1px solid rgba(13,81,140,0.1)", color: "#0C1A2E",
                  fontSize: 13, fontWeight: 500, padding: "10px 36px 10px 16px", borderRadius: 12, outline: "none", cursor: "pointer",
                  boxShadow: "4px 4px 10px rgba(13,81,140,0.07), -3px -3px 8px rgba(255,255,255,0.9)",
                  appearance: "none", WebkitAppearance: "none",
                  backgroundImage: SORT_ARROW_BG, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
                }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {!mounted ? (
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  boxShadow: "8px 8px 20px rgba(13,81,140,0.08), -6px -6px 16px rgba(255,255,255,0.95)",
                  padding: "60px 40px",
                  textAlign: "center",
                  maxWidth: 400,
                  margin: "80px auto",
                }}
              >
                <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#0C1A2E", margin: "0 0 8px" }}>No products found</p>
                <p style={{ fontSize: 14, color: "#8BA8C4", margin: "0 0 24px" }}>Try adjusting your filters</p>
                <button onClick={resetFilters} className="clay-btn clay-btn-primary" style={{ padding: "12px 28px", border: "none", fontSize: 14, cursor: "pointer" }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                {filtered.map((p, i) => (
                  <div key={p.id} className="product-card-item" style={{ animationDelay: `${i * 0.06}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div onClick={() => setDrawerOpen(false)} style={{ flex: 1, background: "rgba(15,23,42,0.5)" }} />
          <div style={{ width: 300, background: "#F5F7FF", padding: 20, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "#0C1A2E" }}>Filters</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "transparent", border: "none", color: "#4A6785", cursor: "pointer", fontSize: 20 }}>✕</button>
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
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
