"use client";
import Link from "next/link";
import { useState } from "react";

function MenuItem({ icon, name, desc, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px", borderRadius: 10,
        textDecoration: "none",
        background: hovered ? "rgba(13,81,140,0.12)" : "transparent",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: hovered
          ? "linear-gradient(135deg, var(--navy), var(--sky))"
          : "linear-gradient(145deg, #F0F5FF, #E8F2FF)",
        border: hovered ? "1px solid transparent" : "1px solid rgba(13,81,140,0.08)",
        boxShadow: hovered ? "0 4px 12px rgba(13,81,140,0.25)" : "2px 2px 6px rgba(13,81,140,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, transition: "all 0.18s ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}>
        <span style={{ filter: hovered ? "brightness(10)" : "none", transition: "filter 0.15s ease" }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)" }}>{name}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 1 }}>{desc}</div>}
      </div>
    </Link>
  );
}

export default function ProductsMegaMenu({ isOpen, onMouseEnter, onMouseLeave }) {
  const visible = {
    opacity: 1,
    transform: "translateX(-50%) translateY(0px) scale(1)",
    visibility: "visible",
    pointerEvents: "auto",
    transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
  };
  const hidden = {
    opacity: 0,
    transform: "translateX(-50%) translateY(-10px) scale(0.97)",
    visibility: "hidden",
    pointerEvents: "none",
    transition: "opacity 0.15s ease, transform 0.15s ease, visibility 0s 0.15s",
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        width: 660,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(13,81,140,0.1)",
        borderRadius: 20,
        boxShadow:
          "0 24px 64px rgba(13,81,140,0.12), 0 8px 24px rgba(13,81,140,0.06), 0 0 0 1px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.9)",
        padding: 8,
        zIndex: 999,
        overflow: "hidden",
        ...(isOpen ? visible : hidden),
      }}
    >
      {/* Transparent bridge covers the gap */}
      <div style={{ position: "absolute", top: -8, left: 0, right: 0, height: 8, background: "transparent" }} />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #F5F7FF, #EEF2FF)",
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
      </div>

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
      <div style={{
        borderTop: "1px solid rgba(13,81,140,0.06)",
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
          className="clay-btn clay-btn-primary"
          style={{
            padding: "8px 20px", fontSize: 13,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none", color: "#FFFFFF",
          }}
        >
          Shop Now →
        </Link>
      </div>
    </div>
  );
}
