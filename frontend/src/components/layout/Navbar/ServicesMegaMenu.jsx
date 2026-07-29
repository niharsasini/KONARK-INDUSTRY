"use client";
import Link from "next/link";
import { useState } from "react";

function SvcItem({ icon, name, desc, href, external }) {
  const [hovered, setHovered] = useState(false);
  const Tag = external ? "a" : Link;
  const extraProps = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
  return (
    <Tag
      {...extraProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px", borderRadius: 10,
        textDecoration: "none",
        background: hovered ? "rgba(217,119,6,0.12)" : "transparent",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: hovered
          ? "linear-gradient(135deg, var(--gold), var(--gold-dark))"
          : "linear-gradient(135deg, var(--bg-surface), var(--bg-card))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, transition: "all 0.15s ease",
      }}>
        <span style={{ filter: hovered ? "brightness(10)" : "none", transition: "filter 0.15s ease" }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)" }}>{name}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 1 }}>{desc}</div>}
      </div>
    </Tag>
  );
}

export default function ServicesMegaMenu({ isOpen, onMouseEnter, onMouseLeave }) {
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
        top: "calc(100% + 4px)",
        left: "50%",
        width: 520,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: 20,
        boxShadow: "0 24px 60px rgba(15,23,42,0.7), 0 0 0 1px rgba(13,81,140,0.05)",
        padding: 8,
        zIndex: 1000,
        ...(isOpen ? visible : hidden),
      }}
    >
      {/* Transparent bridge covers the gap */}
      <div style={{ position: "absolute", top: -8, left: 0, right: 0, height: 8, background: "transparent" }} />

      {/* Header */}
      <div style={{
        background: "rgba(217,119,6,0.12)",
        border: "1px solid rgba(217,119,6,0.2)",
        borderRadius: 14, padding: "16px 20px", marginBottom: 8,
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-heading)", marginBottom: 2 }}>Our Services</div>
        <div style={{ fontSize: 12, color: "var(--slate)" }}>Doorstep service across 18+ cities in Odisha</div>
      </div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 4px 4px" }}>
        {/* Home & EV */}
        <div style={{ paddingRight: 8, borderRight: "1px solid rgba(148,163,184,0.12)" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--gold)",
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
            fontSize: 10, fontWeight: 700, color: "var(--gold)",
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
      <div style={{
        background: "linear-gradient(135deg, rgba(217,119,6,0.08), rgba(13,81,140,0.08))",
        border: "1px solid rgba(217,119,6,0.2)",
        borderRadius: 12, padding: "14px 16px", margin: "4px 4px 8px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
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
            fontSize: 13, fontWeight: 700, color: "var(--gold)",
            textDecoration: "none", whiteSpace: "nowrap",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gold)")}
        >
          Book Now →
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(148,163,184,0.12)",
        padding: "12px 20px 8px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Link
          href="/services"
          style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          View all services →
        </Link>
        <Link
          href="/services/enquiry"
          style={{
            background: "var(--grad-primary)",
            color: "#FFFFFF", padding: "8px 20px", borderRadius: 8,
            textDecoration: "none", fontWeight: 700, fontSize: 13,
            boxShadow: "0 4px 12px rgba(13,81,140,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(13,81,140,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(13,81,140,0.25)";
          }}
        >
          Book a Service →
        </Link>
      </div>
    </div>
  );
}
