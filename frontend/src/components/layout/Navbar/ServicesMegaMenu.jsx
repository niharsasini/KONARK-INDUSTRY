"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import MegaPanel, { useMegaItem } from "./MegaPanel";

function SvcItem({ icon, name, desc, href, external }) {
  const [hovered, setHovered] = useState(false);
  const Tag = external ? "a" : Link;
  const extraProps = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
  const item = useMegaItem();
  return (
    <motion.div variants={item}>
    <Tag
      {...extraProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px", borderRadius: 10,
        textDecoration: "none",
        background: hovered ? "rgba(245,194,107,0.10)" : "transparent",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: hovered
          ? "linear-gradient(135deg, #F5C26B, #D97706)"
          : "rgba(255,255,255,0.05)",
        border: hovered ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered ? "0 4px 14px rgba(217,119,6,0.35)" : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, transition: "all 0.18s ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}>
        <span style={{ filter: "none" }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)" }}>{name}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 1 }}>{desc}</div>}
      </div>
    </Tag>
    </motion.div>
  );
}

export default function ServicesMegaMenu({ isOpen, onMouseEnter, onMouseLeave }) {
  const item = useMegaItem();
  return (
    <MegaPanel isOpen={isOpen} width={560} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Header */}
      <motion.div variants={item} style={{
        background: "linear-gradient(135deg, rgba(245,194,107,0.10), rgba(255,255,255,0.03))",
        borderRadius: 14, padding: "16px 20px", marginBottom: 6,
      }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-heading)", marginBottom: 2 }}>Our Services</div>
        <div style={{ fontSize: 12, color: "var(--text-subtle)" }}>Doorstep service across Odisha</div>
      </motion.div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 4px 4px" }}>
        {/* Home & EV */}
        <div style={{ paddingRight: 8, borderRight: "1px solid rgba(148,163,184,0.12)" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--navy)",
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "8px 12px 4px",
          }}>
            🏠 Home & EV
          </div>
          <SvcItem icon="❄️" name="AC Repair & Service" desc="All brands, same day" href="/services/enquiry" />
          <SvcItem icon="⚡" name="EV Charging Install" desc="Home & commercial" href="https://www.soumyashipower.in/" external />
          <SvcItem icon="🔋" name="Battery Swap" desc="Fast swap, home pickup" href="/battery-swap" />
        </div>

        {/* Energy & Power */}
        <div style={{ paddingLeft: 8 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--navy)",
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "8px 12px 4px",
          }}>
            🌿 Energy & Power
          </div>
          <SvcItem icon="☀️" name="Solar Power Plant" desc="Rooftop & captive up to 1MW" href="https://www.soumyashipower.in/" external />
          <SvcItem icon="💨" name="Wind Power Plant" desc="Hybrid wind-solar systems" href="https://www.soumyashipower.in/" external />
          <SvcItem icon="🔧" name="All Services" desc="View the full list" href="/services" />
        </div>
      </div>

      {/* Featured card */}
      <motion.div variants={item} style={{
        background: "linear-gradient(135deg, rgba(245,194,107,0.10), rgba(255,255,255,0.03))",
        border: "1px solid rgba(245,194,107,0.22)",
        borderRadius: 12, padding: "14px 16px", margin: "4px 4px 8px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #F5C26B, #D97706)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          ⚡
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>Battery Swap Service</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Same day swap from ₹150 · Home pickup available</div>
        </div>
        <Link
          href="/battery-swap"
          style={{
            fontSize: 13, fontWeight: 700, color: "var(--navy)",
            textDecoration: "none", whiteSpace: "nowrap",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navy)")}
        >
          Book Now →
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div variants={item} style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 16px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Link
          href="/services"
          style={{ fontSize: 12, color: "var(--text-subtle)", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
        >
          View all services →
        </Link>
        <Link
          href="/services/enquiry"
          className="nb-mega-cta"
        >
          Book a Service →
        </Link>
      </motion.div>
    </MegaPanel>
  );
}
