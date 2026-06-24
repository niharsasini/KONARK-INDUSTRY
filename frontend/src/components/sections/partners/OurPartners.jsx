"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const PARTNERS = [
  { name: "OPTCL", full: "Odisha Power Transmission Corporation Ltd.", color: "#0f4c81" },
  { name: "NALCO", full: "National Aluminium Company Limited", color: "#c17f24" },
  { name: "NTPC", full: "National Thermal Power Corporation", color: "#f97316" },
  { name: "SAIL", full: "Steel Authority of India — Rourkela", color: "#10b981" },
  { name: "GRIDCO", full: "Grid Corporation of Odisha Ltd.", color: "#f59e0b" },
  { name: "CESCO", full: "Central Electricity Supply Utility of Odisha", color: "#ec4899" },
];

function PartnerCard({ partner, index, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="partner-card"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? partner.color + "60" : "var(--border-light)"}`,
        borderRadius: 16,
        textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        transform: hovered ? "translateY(-4px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 16px 40px rgba(26,15,0,0.12), 0 0 20px ${partner.color}15` : "none",
        transition: "all 0.25s", cursor: "default",
        padding: "28px 20px",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: `${partner.color}18`, border: `2px solid ${partner.color}${hovered ? "60" : "30"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: partner.name.length > 4 ? 10 : 15, fontWeight: 900, color: partner.color,
        letterSpacing: "0.04em", boxShadow: hovered ? `0 0 20px ${partner.color}30` : "none",
        transition: "all 0.25s",
      }}>
        {partner.name}
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5, maxWidth: 140 }}>{partner.full}</p>
    </motion.div>
  );
}

export default function OurPartners() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{ background: "transparent", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(15,76,129,0.3)", color: "var(--navy)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(15,76,129,0.08)", marginBottom: 16 }}>Our Partners</span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
            <span style={{ color: "var(--text-heading)" }}>Trusted by </span>
            <span style={{ background: "linear-gradient(135deg, var(--navy), #c17f24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Industry Leaders</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            We supply to and collaborate with leading institutions, corporations, and government bodies across Odisha and eastern India.
          </p>
        </motion.div>

        <div ref={gridRef} className="partners-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {PARTNERS.map((p, i) => <PartnerCard key={p.name} partner={p} index={i} inView={gridIn} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={gridIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}
        >
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px" }}>Want to distribute Konark products in your area?</p>
            <p style={{ fontSize: 14, color: "var(--text-subtle)", margin: 0 }}>Join our growing network of distributors and service partners across Odisha.</p>
          </div>
          <Link href="/partner" style={{ padding: "12px 26px", background: "var(--navy)", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.2s", minHeight: 44, display: "inline-flex", alignItems: "center" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0ea5e9")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--navy)")}
          >
            Become a Partner →
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .partners-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .partners-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; padding: 0 !important; } }
      `}</style>
    </section>
  );
}
