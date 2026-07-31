"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { products as ALL_PRODUCTS, CATEGORIES as PD_CATEGORIES } from "@/components/product/ProductData";

function pickProducts(slugs) {
  return slugs.map((slug) => ALL_PRODUCTS.find((p) => p.slug === slug)).filter(Boolean);
}

function displayPrice(p) {
  if (p.isUpcoming) return "Coming Soon";
  if (p.slug === "hybrid-cold-storage") return "₹250/sq.ft";
  if (!p.price) return "Contact for Price";
  return `₹${p.price.toLocaleString("en-IN")}`;
}

const EV_SLUGS = ["electric-scooter", "electric-motor-cycle", "e-rickshaw", "utility-vehicle", "konark-ev-car-x1"];
const APPLIANCE_SLUGS = ["bldc-fan", "air-conditioner", "android-tv", "induction-cooker", "water-purifier"];
const ENERGY_SLUGS = ["lfp-battery", "solar-inverter", "bms", "battery-charger", "hybrid-cold-storage"];

const CATEGORIES = [
  {
    id: "ev",
    label: "ELECTRIC MOBILITY",
    title: "EV Vehicles",
    emoji: "🛵",
    gradient: "linear-gradient(135deg, #0D518C, #0EA5E9)",
    accent: "#0D518C",
    accentGlow: "rgba(13,81,140,0.25)",
    href: "/products?type=vehicle",
    products: pickProducts(EV_SLUGS),
    total: ALL_PRODUCTS.filter((p) => p.type === "vehicle" && p.category === PD_CATEGORIES.EV).length,
  },
  {
    id: "appliances",
    label: "HOME & INDUSTRIAL",
    title: "Appliances",
    emoji: "🌀",
    gradient: "linear-gradient(135deg, #D97706, #F59E0B)",
    accent: "#D97706",
    accentGlow: "rgba(217,119,6,0.25)",
    href: "/products?category=Home+Appliances",
    products: pickProducts(APPLIANCE_SLUGS),
    total: ALL_PRODUCTS.filter((p) => p.category === PD_CATEGORIES.HOME).length,
  },
  {
    id: "energy",
    label: "CLEAN ENERGY",
    title: "Energy & Power",
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #059669, #10B981)",
    accent: "#059669",
    accentGlow: "rgba(5,150,105,0.25)",
    href: "/products?category=Batteries",
    products: pickProducts(ENERGY_SLUGS),
    total: ALL_PRODUCTS.filter((p) => p.slug && ENERGY_SLUGS.includes(p.slug)).length,
  },
];

const SLIDE_FROM = [
  { x: -60, y: 0 },
  { x: 0, y: 60 },
  { x: 60, y: 0 },
];

function ProductItem({ product, index, cardIn, baseDelay, accent }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        paddingLeft: hovered ? 6 : 0,
        borderBottom: index < 4 ? "1px solid rgba(13,81,140,0.05)" : "none",
        textDecoration: "none",
        cursor: "pointer",
        opacity: cardIn ? 1 : 0,
        transform: cardIn ? "translateX(0)" : "translateX(-10px)",
        transition: `opacity 0.4s ease ${baseDelay + index * 0.05}s, transform 0.4s ease ${baseDelay + index * 0.05}s, padding-left 0.2s ease, background 0.2s ease`,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          flexShrink: 0,
          background: accent,
          boxShadow: `0 0 6px ${accent}66`,
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 600, color: "#0C1A2E", flex: 1 }}>
        {product.name}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#D97706", flexShrink: 0 }}>
        {displayPrice(product)}
      </span>
      <span
        style={{
          color: accent,
          fontSize: 13,
          fontWeight: 700,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        →
      </span>
    </Link>
  );
}

function CategoryCard({ category, index, gridIn }) {
  const [hovered, setHovered] = useState(false);
  const from = SLIDE_FROM[index] || SLIDE_FROM[0];
  const delay = index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, x: from.x, y: from.y }}
      animate={gridIn ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.34, 1.2, 0.64, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: hovered
          ? "16px 16px 40px rgba(13,81,140,0.14), -12px -12px 32px rgba(255,255,255,1), 0 0 0 1px rgba(13,81,140,0.08)"
          : "12px 12px 32px rgba(13,81,140,0.1), -10px -10px 28px rgba(255,255,255,0.95), 0 0 0 1px rgba(13,81,140,0.04)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Banner */}
      <div
        style={{
          height: 140,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          padding: "20px 24px",
          background: category.gradient,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            fontSize: 80,
            opacity: 0.15,
            transform: "rotate(15deg)",
            lineHeight: 1,
          }}
        >
          {category.emoji}
        </span>
        <span
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 20,
          }}
        >
          {category.total}+ products
        </span>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>
            {category.label}
          </p>
          <p style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.5px", margin: 0 }}>
            {category.title}
          </p>
        </div>
      </div>

      {/* Product list */}
      <div style={{ padding: "20px 24px", flex: 1 }}>
        {category.products.map((product, i) => (
          <ProductItem
            key={product.slug}
            product={product}
            index={i}
            cardIn={gridIn}
            baseDelay={delay + 0.35}
            accent={category.accent}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 24px 20px",
          borderTop: "1px solid rgba(13,81,140,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#8BA8C4", fontWeight: 500 }}>
          {category.total} products available
        </span>
        <Link
          href={category.href}
          style={{
            background: category.gradient,
            color: "white",
            padding: "8px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: `0 4px 12px ${category.accentGlow}`,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 20px ${category.accentGlow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${category.accentGlow}`;
          }}
        >
          Explore All →
        </Link>
      </div>
    </motion.div>
  );
}

export default function SolutionsSection() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{ background: "#F5F7FF", padding: "88px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            className="section-tag"
            style={{ background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.2)", color: "#0D518C" }}
          >
            WHAT WE MAKE
          </span>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-1px", margin: "16px 0 16px", lineHeight: 1.15, textAlign: "center" }}>
            <span style={{ color: "#0C1A2E" }}>Powering Every</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #0D518C, #0EA5E9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Corner of Life.
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "#4A6785", maxWidth: 520, margin: "0 auto", lineHeight: 1.7, textAlign: "center" }}>
            One company. Three pillars. Everything you need to live, work, and move sustainably.
          </p>
        </motion.div>

        <div ref={gridRef} className="solutions-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {CATEGORIES.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} gridIn={gridIn} />
          ))}
        </div>
      </div>
    </section>
  );
}
