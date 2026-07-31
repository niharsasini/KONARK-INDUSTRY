"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ROW1_PARTNERS = [
  { icon: "🏭", name: "EV Component Supplier", type: "Manufacturing Partner" },
  { icon: "☀️", name: "Solar Equipment Partner", type: "Energy Partner" },
  { icon: "🔋", name: "Battery Cell Partner", type: "Component Supplier" },
  { icon: "⚡", name: "Electrical Hardware Partner", type: "Supply Partner" },
  { icon: "🌱", name: "Renewable Energy Partner", type: "Energy Partner" },
  { icon: "🏗️", name: "Installation & Infra Partner", type: "Service Partner" },
];

const ROW2_PARTNERS = [
  { icon: "🔌", name: "Power Systems Partner", type: "Technical Partner" },
  { icon: "💡", name: "Lighting Solutions Partner", type: "Supply Partner" },
  { icon: "🏪", name: "Retail Distribution Partner", type: "Distribution" },
  { icon: "🚗", name: "EV Charging Partner", type: "Infrastructure" },
  { icon: "📦", name: "Logistics Partner", type: "Supply Chain" },
  { icon: "🛠️", name: "Spare Parts Partner", type: "Service Partner" },
];

const TRUST_STATS_BASE = [
  { icon: "📅", value: "10+", label: "Years Active", color: "#0D518C" },
  { key: "stats_customers", icon: "📦", fallback: "25,000+", label: "Customers Served", color: "#D97706" },
  { key: "stats_satisfaction", icon: "⭐", fallback: "99%", label: "Satisfaction", color: "#059669" },
  { key: "stats_cities", icon: "📍", fallback: "18+", label: "Cities Covered", color: "#7C3AED" },
];

function PartnerCard({ partner }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: `1px solid ${hovered ? "rgba(13,81,140,0.15)" : "rgba(13,81,140,0.06)"}`,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transform: hovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "7px 7px 18px rgba(13,81,140,0.1), -5px -5px 14px rgba(255,255,255,1)"
          : "5px 5px 14px rgba(13,81,140,0.07), -4px -4px 12px rgba(255,255,255,0.95)",
        transition: "all 0.25s ease",
      }}
    >
      <span style={{ fontSize: 22 }}>{partner.icon}</span>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0C1A2E", margin: 0 }}>{partner.name}</p>
        <p style={{ fontSize: 11, color: "#8BA8C4", fontWeight: 500, margin: 0 }}>{partner.type}</p>
      </div>
    </div>
  );
}

export default function OurPartners() {
  const settings = useSiteSettings();
  const TRUST_STATS = TRUST_STATS_BASE.map((s) => ({
    ...s,
    value: s.key ? settings?.[s.key] || s.fallback : s.value,
  }));

  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: rowsRef, inView: rowsIn } = useInView({ threshold: 0.05, triggerOnce: true });
  const { ref: barRef, inView: barIn } = useInView({ threshold: 0.1, triggerOnce: true });

  const row1 = [...ROW1_PARTNERS, ...ROW1_PARTNERS];
  const row2 = [...ROW2_PARTNERS, ...ROW2_PARTNERS];

  return (
    <section style={{ background: "#F5F7FF", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <motion.h3
          ref={headRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: "#0C1A2E", marginBottom: 32 }}
        >
          Trusted Partners
        </motion.h3>

        <motion.div
          ref={rowsRef}
          initial={{ opacity: 0 }}
          animate={rowsIn ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="partners-marquee"
        >
          <div className="partners-row partners-row-left">
            {row1.map((p, i) => (
              <PartnerCard key={`${p.name}-${i}`} partner={p} />
            ))}
          </div>
          <div className="partners-row partners-row-right">
            {row2.map((p, i) => (
              <PartnerCard key={`${p.name}-${i}`} partner={p} />
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 30 }}
          animate={barIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="partners-trust-bar"
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: "8px 8px 22px rgba(13,81,140,0.09), -6px -6px 18px rgba(255,255,255,0.95)",
            padding: "24px 40px",
          }}
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: `${stat.color}1A`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "inset 2px 2px 6px rgba(13,81,140,0.06), inset -2px -2px 5px rgba(255,255,255,0.9)",
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 900, color: stat.color, margin: 0, lineHeight: 1.1 }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: "#8BA8C4", fontWeight: 500, margin: 0 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={barIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            background: "#FFFFFF",
            boxShadow: "8px 8px 20px rgba(13,81,140,0.08), -6px -6px 16px rgba(255,255,255,0.95)",
            borderRadius: 16,
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            maxWidth: 900,
            margin: "32px auto 0",
          }}
        >
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#0C1A2E", margin: "0 0 4px" }}>Want to distribute Konark products in your area?</p>
            <p style={{ fontSize: 14, color: "#8BA8C4", margin: 0 }}>Join our growing network of distributors and service partners across Odisha.</p>
          </div>
          <Link
            href="/partner"
            style={{
              padding: "12px 26px",
              background: "linear-gradient(135deg, #0D518C, #0EA5E9)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 10,
              textDecoration: "none",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
            }}
          >
            Become a Partner →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
