"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FEATURES = [
  {
    num: "01", icon: "⚡", color: "#00d4ff",
    title: "Odisha's Own EV Brand",
    body: "We design, manufacture, and service our own electric vehicles right here in Bhubaneswar. No middlemen. No import markup. Just honest Odisha-made technology at fair prices.",
    fromX: -60,
  },
  {
    num: "02", icon: "🔋", color: "#7c3aed",
    title: "Complete Energy Ecosystem",
    body: "From manufacturing LFP batteries to installing solar and wind power plants — we cover the full energy chain. One company handles everything from production to installation to maintenance.",
    fromX: 60,
  },
  {
    num: "03", icon: "🏭", color: "#f97316",
    title: "Factory Direct Pricing",
    body: "Because we make what we sell, you get factory prices without distributor markups. Our Bhubaneswar factory produces EV scooters, rickshaws, batteries, fans and ACs under one roof.",
    fromX: -60,
  },
  {
    num: "04", icon: "🤝", color: "#10b981",
    title: "Trusted by Govt. Bodies",
    body: "Recognised by Startup India (DIPP182913), Startup Odisha (OSP/SP/02193), and registered under MSME (UDYAM-OD-19-0064755). Our credentials are public and verifiable.",
    fromX: 60,
  },
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
        border: `1px solid ${hovered ? f.color + "50" : "#1e2d40"}`,
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

      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 14px", lineHeight: 1.3, position: "relative" }}>
        {f.title}
        <span style={{ display: "block", height: 2, background: f.color, borderRadius: 1, marginTop: 8, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s" }} />
      </h3>

      <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.8 }}>{f.body}</p>
    </motion.div>
  );
}

export default function WhyKonark() {
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
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff",
            fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 16,
          }}>
            WHY CHOOSE US
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.2 }}>
            <span style={{ color: "#f1f5f9" }}>The Konark </span>
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Promise</span>
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            We don&apos;t cut corners. Every product we make and every service we provide carries our name — and we take that seriously.
          </p>
        </motion.div>

        <div ref={gridRef} className="why-grid why-features-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} inView={gridIn} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-features-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </section>
  );
}
