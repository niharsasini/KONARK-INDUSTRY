"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { products } from "@/components/product/ProductData";

const TABS = ["All", "EV", "Battery", "Appliances", "Industrial"];

const CATEGORY_MAP = {
  All: null,
  EV: "Electric Vehicles",
  Battery: "Batteries",
  Appliances: "Home Appliances",
  Industrial: "Industrial Equipment",
};

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
        <svg key={s} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 12, height: 12 }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>{rating}</span>
    </div>
  );
}

function ProductCard({ product, index, inView }) {
  const [hovered, setHovered] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const cardRef = useRef(null);
  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setRotY(((e.clientX - rect.left - rect.width / 2) / rect.width) * 12);
    setRotX(-((e.clientY - rect.top - rect.height / 2) / rect.height) * 12);
  }

  function handleMouseLeave() {
    setHovered(false);
    setRotX(0);
    setRotY(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <motion.div
        ref={cardRef}
        animate={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "800px",
          background: hovered ? "#111827" : "#0f172a",
          border: `1px solid ${hovered ? "#2d4a6b" : "#1e2d40"}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: hovered ? "0 12px 30px rgba(0,0,0,0.3)" : "none",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Image */}
        <div style={{ position: "relative", background: "#111827", height: 200, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ maxHeight: 180, maxWidth: "90%", objectFit: "contain" }}
          />
          {product.isNew && (
            <span style={{ position: "absolute", top: 10, left: 10, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              NEW
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {product.category}
          </span>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0, lineHeight: 1.4 }}>{product.name}</p>
          <StarRating rating={product.rating} />
          <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            {product.price ? `₹${product.price.toLocaleString("en-IN")}` : <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 13 }}>Price on Request</span>}
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 4 }}>
            <Link
              href={`/products/${product.slug}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                border: "1px solid #00d4ff",
                borderRadius: 8,
                color: "#00d4ff",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#00d4ff"; e.currentTarget.style.color = "#0a0f1e"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00d4ff"; }}
            >
              View Details
            </Link>
            <button
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1e2d40",
                borderRadius: 8,
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "#1e2d40"; }}
              aria-label="Add to wishlist"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("All");
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  const filtered = CATEGORY_MAP[activeTab]
    ? products.filter((p) => p.category === CATEGORY_MAP[activeTab]).slice(0, 6)
    : products.slice(0, 6);

  return (
    <section style={{ background: "#111827", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16 }}>
            Our Products
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.2 }}>
            Built to Last. Priced to Move.
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 560, margin: "0 auto" }}>
            Every product goes through 47 quality checks before leaving our factory floor in Bhubaneswar.
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: activeTab === tab ? "#00d4ff" : "#1e2d40",
                background: activeTab === tab ? "#00d4ff" : "transparent",
                color: activeTab === tab ? "#0a0f1e" : "#94a3b8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} inView={gridIn} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              border: "1px solid #1e2d40",
              borderRadius: 8,
              color: "#f1f5f9",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
