"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { products } from "@/components/product/ProductData";

const TRUST_PILLS = ["✓ ISI Certified", "✓ 2-Year Warranty", "✓ Doorstep Service"];

const CATEGORY_CHIPS = [
  { icon: "⚡", label: "EV Scooters", href: "/products?cat=ev" },
  { icon: "🛺", label: "E-Rickshaws", href: "/products?cat=rickshaw" },
  { icon: "🔋", label: "LFP Batteries", href: "/products?cat=battery" },
];

// Products highlighted in the hero card: newly launched or top-rated
const featuredProducts = products.filter(p => p.isNew || p.rating >= 4.5).slice(0, 6);

export default function Hero() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProduct = featuredProducts[currentIndex] || featuredProducts[0];

  // Auto-cycle every 3 seconds; clear on unmount
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
      }}
    >
      {/* Layer 1 — animated grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Layer 2 — glowing orbs */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", left: "-10%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        animation: "float 10s ease-in-out infinite reverse",
      }} />

      {/* Layer 3 — rotating rings */}
      <div style={{
        position: "absolute", top: "50%", right: "5%",
        transform: "translateY(-50%)",
        width: "500px", height: "500px",
        border: "1px solid rgba(0,212,255,0.08)",
        borderRadius: "50%",
        animation: "spin 30s linear infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "5%",
        transform: "translateY(-50%)",
        width: "380px", height: "380px",
        marginTop: "-60px", marginRight: "-60px",
        border: "1px solid rgba(124,58,237,0.08)",
        borderRadius: "50%",
        animation: "spin 20s linear infinite reverse",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Content */}
      <div
        className="hero-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "55% 45%",
          gap: 40,
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* LEFT */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ marginBottom: 28 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              borderRadius: 100, padding: "6px 16px",
              fontSize: 12, fontWeight: 600, color: "#00d4ff",
              letterSpacing: "0.04em",
              boxShadow: "0 0 20px rgba(0,212,255,0.1)",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#00d4ff",
                boxShadow: "0 0 8px #00d4ff",
                animation: "pulse-glow 2s infinite",
                display: "inline-block",
              }} />
              Powering Odisha since 2014
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginBottom: 24 }}>
            {[
              { text: "Power Your", gradient: false },
              { text: "World With", gradient: false },
              { text: "Konark.", gradient: true },
            ].map((line, i) => (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              >
                <h1 style={{
                  fontSize: "clamp(48px, 6vw, 80px)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  margin: 0,
                  ...(line.gradient ? {
                    background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  } : { color: "#f1f5f9" }),
                }}>
                  {line.text}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.8, maxWidth: 520, marginBottom: 36 }}
          >
            We make electric scooters, e-rickshaws, and batteries in Bhubaneswar.
            We fix your AC, EV charger, and electrical faults at your doorstep.
            One company. Every power need. Across Odisha.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/products")}
              style={{
                background: "#00d4ff", color: "#0a0f1e",
                padding: "14px 32px", borderRadius: 10,
                fontWeight: 800, fontSize: 15, border: "none",
                cursor: "pointer", letterSpacing: "0.02em",
              }}
            >
              Shop Products →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/services/enquiry")}
              style={{
                background: "transparent", color: "#f1f5f9",
                border: "1px solid rgba(241,245,249,0.2)",
                padding: "14px 32px", borderRadius: 10,
                fontWeight: 700, fontSize: 15, cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)";
                e.currentTarget.style.color = "#00d4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(241,245,249,0.2)";
                e.currentTarget.style.color = "#f1f5f9";
              }}
            >
              Book a Service →
            </motion.button>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {TRUST_PILLS.map((pill) => (
              <span key={pill} style={{
                fontSize: 12, color: "#64748b",
                border: "1px dashed rgba(100,116,139,0.3)",
                padding: "4px 12px", borderRadius: 100,
                display: "inline-block",
              }}>
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — 3D product showcase (auto-cycles) */}
        <div className="hero-right" style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}>
          <motion.div
            initial={{ opacity: 0, rotateY: -15, x: 60 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            whileHover={{ rotateY: 8, rotateX: -5, scale: 1.03 }}
            onClick={() => router.push(`/products/${currentProduct.slug}`)}
            style={{
              transformStyle: "preserve-3d",
              background: "rgba(15,23,42,0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: 20,
              padding: 32,
              boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.08)",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {/* key={currentIndex} triggers fade animation on every product change */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Featured tag */}
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#00d4ff",
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  padding: "3px 10px", borderRadius: 4,
                }}>
                  FEATURED PRODUCT
                </span>
              </div>

              {/* Product image */}
              <div style={{
                width: "100%", height: 220,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(17,24,39,0.6)", borderRadius: 12,
                overflow: "hidden", marginBottom: 16,
              }}>
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  style={{ maxHeight: 200, maxWidth: "90%", objectFit: "contain",
                    filter: "drop-shadow(0 4px 24px rgba(0,212,255,0.2))" }}
                />
              </div>

              {/* Name + price */}
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>
                {currentProduct.name}
              </p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#00d4ff", margin: "0 0 14px" }}>
                {currentProduct.price > 0
                  ? `₹${currentProduct.price.toLocaleString("en-IN")}`
                  : "Price on Request"}
              </p>

              {/* Stat chips — category + rating */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#00d4ff",
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  padding: "4px 10px", borderRadius: 6,
                }}>
                  {currentProduct.category.replace("Electric Vehicles", "EV").replace("Home Appliances", "Home")}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#f97316",
                  background: "rgba(249,115,22,0.08)",
                  border: "1px solid rgba(249,115,22,0.2)",
                  padding: "4px 10px", borderRadius: 6,
                }}>
                  ⭐ {currentProduct.rating}
                </span>
              </div>

              <Link
                href={`/products/${currentProduct.slug}`}
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}
              >
                View Product →
              </Link>
            </motion.div>
          </motion.div>

          {/* Dot indicators — click to jump to a product */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
            {featuredProducts.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === currentIndex ? "#00d4ff" : "#1e2d40",
                  cursor: "pointer",
                  transition: "all 300ms",
                }}
              />
            ))}
          </div>

          {/* Category quick-links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ display: "flex", gap: 8, marginTop: 12 }}
          >
            {CATEGORY_CHIPS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 4, padding: "10px 8px",
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid #1e2d40", borderRadius: 10,
                  textDecoration: "none", fontSize: 11,
                  color: "#94a3b8", fontWeight: 600, textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00d4ff";
                  e.currentTarget.style.color = "#00d4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e2d40";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                {c.label} →
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 4, color: "#94a3b8", zIndex: 10,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          style={{ width: 18, height: 18, color: "#00d4ff" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>

    </section>
  );
}
