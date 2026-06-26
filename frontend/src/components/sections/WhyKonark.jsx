"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const FEATURES = [
  {
    num: "01", icon: "🔧", color: "#c17f24",
    title: "Expert Technicians",
    body: "Certified professionals come to your doorstep. All our service engineers are trained and certified for EV, AC, and solar systems — no unqualified third-party contractors.",
    fromX: -60,
  },
  {
    num: "02", icon: "⚡", color: "#1a6aab",
    title: "Same-Day Service",
    body: "Book before 2 PM, get service the same day. Across 18+ cities in Odisha, we guarantee fast response times so your home or business is never left without power.",
    fromX: 60,
  },
  {
    num: "03", icon: "🏭", color: "#d97706",
    title: "Made in Odisha",
    body: "Every scooter, battery, and appliance is manufactured locally in Bhubaneswar. Direct factory pricing with no middlemen — 100% quality assured from our own production line.",
    fromX: -60,
  },
  {
    num: "04", icon: "💰", color: "#1a7a4a",
    title: "Best Prices",
    body: "Factory-to-customer pricing means you pay what the product is worth — not what a distributor chain adds on top. Transparent pricing with no hidden fees on any product or service.",
    fromX: 60,
  },
];

const STATS_FALLBACK = [
  { key: "stats_customers", label: "Happy Customers", fallback: "25,000+" },
  { key: "stats_cities", label: "Cities Covered", fallback: "18+" },
  { key: "stats_rating", label: "Average Rating", fallback: "4.8★" },
  { key: null, label: "Years in Odisha", fallback: "10+" },
];

function FeatureCard({ f, index, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: f.fromX }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="why-card"
      style={{
        border: `1px solid ${hovered ? f.color + "50" : "rgba(255,255,255,0.1)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}20` : "none",
      }}
    >
      <span className="why-card-number">{f.num}</span>

      {hovered && (
        <div style={{ position: "absolute", top: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${f.color}10 0%, transparent 70%)`, pointerEvents: "none" }} />
      )}

      <div style={{ width: 48, height: 3, background: f.color, borderRadius: 2, marginBottom: 20, boxShadow: hovered ? `0 0 12px ${f.color}` : "none", transition: "box-shadow 0.3s" }} />

      <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${f.color}18`, border: `2px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20, boxShadow: hovered ? `0 0 20px ${f.color}30` : "none", transition: "box-shadow 0.3s" }}>
        {f.icon}
      </div>

      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.3, position: "relative" }}>
        {f.title}
        <span style={{ display: "block", height: 2, background: f.color, borderRadius: 1, marginTop: 8, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s" }} />
      </h3>

      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.8 }}>{f.body}</p>
    </motion.div>
  );
}

export default function WhyKonark() {
  const settings = useSiteSettings();
  const STATS = STATS_FALLBACK.map((s) => ({
    value: s.key ? (settings?.[s.key] || s.fallback) : s.fallback,
    label: s.label,
  }));
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section className="why-section">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56, padding: "0 24px" }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(193,127,36,0.4)", color: "#c17f24",
            fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(193,127,36,0.1)", marginBottom: 16,
          }}>
            WHY CHOOSE US
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.2 }}>
            <span style={{ color: "#fff" }}>The Konark </span>
            <span style={{ background: "linear-gradient(135deg, #1a6aab, #c17f24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Promise</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            We don&apos;t cut corners. Every product we make and every service we provide carries our name — and we take that seriously.
          </p>
        </motion.div>

        <div ref={gridRef} className="why-grid why-features-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} inView={gridIn} />
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 48, padding: "0 24px" }} className="why-stats-row">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={gridIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              style={{
                background: "rgba(245,240,232,0.06)",
                border: "1px solid rgba(245,240,232,0.1)",
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 900, margin: "0 0 6px", color: "#c17f24", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-features-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .why-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
