"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/components/product/ProductData";

const TABS = [
  { label: "All", icon: "✦", filter: () => true },
  { label: "EV Vehicles", icon: "🏍", filter: (p) => p.type === "vehicle" },
  { label: "Buy Now", icon: "🛒", filter: (p) => p.type === "product" },
  { label: "Book Service", icon: "🔧", filter: (p) => p.type === "service" },
];

const CARD_W = 280;
const CARD_GAP = 20;

function TiltCard({ product }) {
  const router = useRouter();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const catColor = {
    "Electric Vehicles": "#00d4ff",
    Batteries: "#7c3aed",
    "Home Appliances": "#10b981",
    "Industrial Equipment": "#f97316",
    "Industrial Services": "#a78bfa",
  }[product.category] || "#64748b";

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const y = ((e.clientX - r.left) / r.width - 0.5) * 10;
    setTilt({ x, y });
  }

  const ctaLabel = product.type === "vehicle" ? "Book Test Ride" : product.type === "service" ? "Book Now" : "Add to Cart";
  const ctaColor = product.type === "service" ? "#7c3aed" : "#00d4ff";

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => router.push(`/products/${product.slug}`)}
      style={{
        width: "100%", flexShrink: 0,
        background: "linear-gradient(145deg, #111827, #0f172a)",
        border: `1px solid ${hovered ? `${catColor}60` : "#1e2d40"}`,
        borderRadius: 20, overflow: "hidden",
        boxShadow: hovered ? `0 30px 60px rgba(0,0,0,0.5), 0 0 30px ${catColor}20` : "0 20px 40px rgba(0,0,0,0.4)",
        cursor: "pointer", transformStyle: "preserve-3d",
        transition: "border-color 0.2s, box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{
        height: 200, position: "relative",
        background: "radial-gradient(ellipse at center, #0f172a 0%, #060d1a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        overflow: "hidden",
      }}>
        <img
          src={product.image} alt={product.name} loading="lazy"
          style={{ maxHeight: 160, maxWidth: "85%", objectFit: "contain",
            filter: hovered ? `drop-shadow(0 0 20px ${catColor}60)` : "none",
            transition: "filter 0.3s",
          }}
        />
        {product.isNew && (
          <span style={{ position: "absolute", top: 12, left: 12, background: "#00d4ff", color: "#0a0f1e", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>NEW</span>
        )}
        <span style={{ position: "absolute", top: 12, right: 12, background: `${catColor}18`, border: `1px solid ${catColor}40`, color: catColor, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
          {product.category.replace("Electric Vehicles", "EV").replace("Home Appliances", "Home").replace("Industrial Equipment", "Industrial")}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${catColor}, transparent)` }} />
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{product.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} viewBox="0 0 12 12" fill={s <= Math.round(product.rating) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 10, height: 10 }}>
              <path d="M6 1l1.24 2.51L10 3.86 8 5.82l.47 2.76L6 7.25 3.53 8.58 4 5.82 2 3.86l2.76-.35L6 1z" />
            </svg>
          ))}
          <span style={{ fontSize: 10, color: "#64748b", marginLeft: 2 }}>({product.rating})</span>
        </div>
        <p style={{ fontSize: 18, fontWeight: 800, color: product.price > 0 ? catColor : "#64748b", margin: 0 }}>
          {product.price > 0 ? `₹${product.price.toLocaleString("en-IN")}` : <span style={{ fontSize: 13, fontStyle: "italic" }}>Price on Request</span>}
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e2d40", display: "flex", gap: 8, alignItems: "center" }}>
        <Link
          href={`/products/${product.slug}`}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 10px", fontSize: 12, fontWeight: 700, background: "transparent", color: ctaColor, border: `1px solid ${ctaColor}60`, borderRadius: 8, textDecoration: "none", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = `${ctaColor}18`)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {ctaLabel} →
        </Link>
        <button
          onClick={e => e.stopPropagation()}
          style={{ width: 34, height: 34, borderRadius: 8, background: "transparent", border: "1px solid #1e2d40", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", fontSize: 14 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#64748b"; }}
          title="Add to wishlist"
        >♡</button>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });

  const filtered = products.filter(TABS[activeTab].filter).slice(0, 8);
  const displayed = filtered.length > 0 ? filtered : products.slice(0, 8);
  const doubled = [...displayed, ...displayed];
  const trackWidth = doubled.length * (CARD_W + CARD_GAP);

  return (
    <section className="products-section">
      {/* Decorative background text */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(120px, 20vw, 220px)",
        fontWeight: 900, color: "rgba(241,245,249,0.02)",
        pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
        zIndex: 0,
      }}>
        PRODUCTS
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="products-header"
        >
          <div className="products-header-left">
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
              borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff",
              fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
              background: "rgba(0,212,255,0.08)", marginBottom: 14,
            }}>
              OUR CATALOGUE
            </span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, margin: "0 0 10px", lineHeight: 1.15 }}>
              <span style={{ color: "#f1f5f9" }}>Our Product </span>
              <span style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Catalogue</span>
            </h2>
            <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 480, margin: 0, lineHeight: 1.7 }}>
              Every scooter, battery, and appliance from our Bhubaneswar factory passes 47 quality checks.
            </p>
          </div>
          <Link href="/products" style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap", alignSelf: "flex-end" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            View all 50+ →
          </Link>
        </motion.div>

        {/* Filter tabs */}
        <div className="filter-tabs-row" style={{ display: "flex", gap: 8, marginBottom: 36, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4, paddingLeft: 48, paddingRight: 48 }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`filter-tab-btn${activeTab === i ? " active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                padding: "9px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                background: activeTab === i ? "#00d4ff" : "transparent",
                color: activeTab === i ? "#0a0f1e" : "#64748b",
                border: `1px solid ${activeTab === i ? "#00d4ff" : "#1e2d40"}`,
                boxShadow: activeTab === i ? "0 0 16px rgba(0,212,255,0.3)" : "none",
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="products-carousel-wrap products-carousel">
        <div
          key={activeTab}
          className="products-track"
          style={{
            animation: "scrollProducts 35s linear infinite",
            width: `${trackWidth + 24}px`,
          }}
        >
          {doubled.map((p, i) => (
            <div key={`${p.id}-${i}`} className="product-card-wrap">
              <TiltCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 10, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", margin: "0 24px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          View All 50+ Products →
        </Link>
      </div>
    </section>
  );
}
