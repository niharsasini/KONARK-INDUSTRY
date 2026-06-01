"use client";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section
      className="cta-banner"
      style={{
        background: "#0a0f1e",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px",
        textAlign: "center",
        borderTop: "1px solid #1e2d40",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(30,45,64,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,64,0.4) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", top: "50%", left: "-5%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 20px", lineHeight: 1.2 }}>
          One call. Every power need.
        </h2>
        <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.8, marginBottom: 40 }}>
          Whether you need a new EV scooter, a battery for your solar system,
          or just want someone to fix your AC —
          we're the one number to call in Odisha.
        </p>
        <div className="cta-banner-buttons">
          <Link
            href="/products"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 36px", background: "#00d4ff", color: "#0a0f1e",
              fontWeight: 800, fontSize: 15, borderRadius: 10, textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
          >
            Shop Products
          </Link>
          <Link
            href="/services/enquiry"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 36px", background: "transparent", color: "#f1f5f9",
              fontWeight: 700, fontSize: 15, borderRadius: 10, textDecoration: "none",
              border: "1px solid rgba(241,245,249,0.2)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(241,245,249,0.2)"; e.currentTarget.style.color = "#f1f5f9"; }}
          >
            Book a Service
          </Link>
          <Link
            href="/battery-swap"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 36px", background: "rgba(124,58,237,0.12)", color: "#a78bfa",
              fontWeight: 700, fontSize: 15, borderRadius: 10, textDecoration: "none",
              border: "1px solid rgba(124,58,237,0.3)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.borderColor = "#7c3aed"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.12)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; }}
          >
            🔋 Battery Swap
          </Link>
        </div>
      </div>
    </section>
  );
}
