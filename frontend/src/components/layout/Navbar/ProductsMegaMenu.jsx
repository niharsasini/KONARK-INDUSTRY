"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import MegaPanel, { useMegaItem } from "./MegaPanel";

function MenuItem({ icon, name, desc, href }) {
  const [hovered, setHovered] = useState(false);
  const item = useMegaItem();
  return (
    <motion.div variants={item}>
    <Link
      href={href}
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
    </Link>
    </motion.div>
  );
}

export default function ProductsMegaMenu({ isOpen, onMouseEnter, onMouseLeave }) {
  const item = useMegaItem();
  return (
    <MegaPanel isOpen={isOpen} width={660} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Header */}
      <motion.div variants={item} style={{
        background: "linear-gradient(135deg, rgba(245,194,107,0.10), rgba(255,255,255,0.03))",
        borderRadius: 14, padding: "16px 20px", marginBottom: 6,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-heading)" }}>Our Products</div>
          <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 2 }}>29 Products Available</div>
        </div>
        <Link
          href="/products"
          style={{ fontSize: 13, color: "var(--navy)", textDecoration: "none", fontWeight: 600, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navy)")}
        >
          View All →
        </Link>
      </motion.div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 4px 4px" }}>
        {/* EV Vehicles */}
        <div style={{ paddingRight: 8, borderRight: "1px solid rgba(148,163,184,0.12)" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--text-subtle)",
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "8px 12px 4px",
          }}>
            ⚡ Electric Vehicles
          </div>
          <MenuItem icon="🛵" name="EV Scooters" desc="City & long-range models" href="/products?cat=ev-scooter" />
          <MenuItem icon="🛺" name="E-Rickshaws" desc="Commercial & passenger" href="/products?cat=e-rickshaw" />
          <MenuItem icon="🏍" name="Electric Motorcycles" desc="High-performance EVs" href="/products?cat=electric-motorcycle" />
          <MenuItem icon="🎯" name="Book Test Ride" desc="Try before you buy" href="/test-ride" />
        </div>

        {/* Home & Industrial */}
        <div style={{ paddingLeft: 8 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--text-subtle)",
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "8px 12px 4px",
          }}>
            🏠 Home & Industrial
          </div>
          <MenuItem icon="💨" name="BLDC Fans" desc="Energy-saving ceiling fans" href="/products?cat=fan" />
          <MenuItem icon="❄️" name="Air Conditioners" desc="Inverter AC units" href="/products?cat=ac" />
          <MenuItem icon="🔋" name="LFP Batteries" desc="Long-life storage systems" href="/products?cat=battery" />
          <MenuItem icon="⚙️" name="Industrial Motors" desc="High-torque wiper motors" href="/products?cat=industrial" />
        </div>
      </div>

      {/* Footer */}
      <motion.div variants={item} style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 16px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 4,
      }}>
        <Link
          href="/products"
          style={{ fontSize: 12, color: "var(--text-subtle)", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
        >
          View all products →
        </Link>
        <Link
          href="/products"
          className="nb-mega-cta"
        >
          Shop Now →
        </Link>
      </motion.div>
    </MegaPanel>
  );
}
