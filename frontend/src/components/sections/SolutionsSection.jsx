"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const CATEGORIES = [
  {
    icon: "🛵",
    title: "Electric Vehicles",
    borderTop: "#0D518C",
    hoverBorder: "rgba(79,195,247,0.4)",
    color: "#4FC3F7",
    ctaLabel: "Explore EVs →",
    ctaHref: "/products?cat=ev",
    products: ["EV Scooter X1", "E-Rickshaw Standard", "Electric Motorcycle", "EV Car (Upcoming)"],
    desc: "Built for Indian roads. Robust, efficient, and designed to outlast conventional options.",
  },
  {
    icon: "🌀",
    title: "Home Appliances",
    borderTop: "#F4C430",
    hoverBorder: "rgba(244,196,48,0.4)",
    color: "#F4C430",
    ctaLabel: "Shop Appliances →",
    ctaHref: "/products?cat=appliance",
    products: ["BLDC Fan 5-Star", "Inverter AC 1.5T", "Android Smart TV", "Induction Cooker"],
    desc: "Smart appliances that cut your electricity bill by up to 60% without sacrificing comfort.",
  },
  {
    icon: "⚡",
    title: "Energy & Services",
    borderTop: "#34C78A",
    hoverBorder: "rgba(52,199,138,0.4)",
    color: "#34C78A",
    ctaLabel: "View Services →",
    ctaHref: "/services",
    products: ["LFP Battery System", "Solar Inverter", "AC Repair Service", "Battery Swap"],
    desc: "Complete energy solutions from storage to solar — installation, repair, and maintenance.",
  },
];

export default function SolutionsSection() {
  const [hovered, setHovered] = useState(null);
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{ background: "transparent", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span className="section-tag">
            WHAT WE MAKE
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2, color: "var(--text-heading)" }}>
            Built for{" "}
            <span className="gradient-text">
              Odisha.
            </span>{" "}
            Made for India.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            One company. Three pillars. Everything you need to live, work, and move sustainably.
          </p>
        </motion.div>

        <div
          ref={gridRef}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
          className="solutions-col-grid"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={gridIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "rgba(13,27,53,0.6)",
                borderRadius: 20,
                padding: "32px 28px",
                border: `1px solid ${hovered === i ? cat.hoverBorder : "rgba(13,81,140,0.3)"}`,
                borderTop: `3px solid ${cat.borderTop}`,
                transition: "all 0.3s ease",
                transform: hovered === i ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered === i
                  ? "0 16px 48px rgba(10,14,26,0.5)"
                  : "none",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 48, lineHeight: 1 }}>{cat.icon}</div>

              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 8px", lineHeight: 1.3 }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
                  {cat.desc}
                </p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.products.map((p) => (
                  <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#7B8DB8", fontWeight: 500 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      background: `${cat.color}15`, border: `1px solid ${cat.color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg viewBox="0 0 10 10" fill="none" style={{ width: 7, height: 7 }}>
                        <path d="M1.5 5l2.5 2.5 4.5-5" stroke={cat.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                href={cat.ctaHref}
                style={{
                  marginTop: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 14,
                  fontWeight: 700,
                  color: cat.color,
                  textDecoration: "none",
                  transition: "gap 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = "8px")}
                onMouseLeave={(e) => (e.currentTarget.style.gap = "4px")}
              >
                {cat.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .solutions-col-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .solutions-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
