"use client";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section
      style={{
        background: "#0a0f1e",
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px",
        textAlign: "center",
        borderTop: "1px solid #1e2d40",
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(30,45,64,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,64,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Bokeh */}
      <div style={{ position: "absolute", top: "50%", left: "-5%", transform: "translateY(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.2 }}>
          Ready to power your future?
        </h2>
        <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36 }}>
          Join 25,000+ homes, businesses, and industries already running on Konark.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "#00d4ff",
              color: "#0a0f1e",
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
          >
            Shop Products
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "transparent",
              color: "#f1f5f9",
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 8,
              textDecoration: "none",
              border: "1px solid #1e2d40",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
