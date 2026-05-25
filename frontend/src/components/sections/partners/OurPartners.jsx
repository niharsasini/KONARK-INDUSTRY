"use client";
import Link from "next/link";

const PARTNERS = [
  "Odisha Power Corp",
  "NALCO",
  "NTPC",
  "SAIL Rourkela",
  "GRIDCO Odisha",
  "CESCO Odisha",
];

export default function OurPartners() {
  return (
    <section style={{ background: "#111827", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16 }}>
            Our partners
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.2 }}>
            Trusted by Industry Leaders
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 480, margin: "0 auto" }}>
            We work with distributors, contractors, and institutions across India.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
          {PARTNERS.map((name) => (
            <div
              key={name}
              style={{
                background: "#0f172a",
                border: "1px solid #1e2d40",
                borderRadius: 12,
                padding: "24px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                transition: "border-color 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d4a6b")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{name}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/partner"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              border: "1px solid #1e2d40",
              borderRadius: 8,
              color: "#f1f5f9",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
          >
            Become a Distribution Partner →
          </Link>
        </div>
      </div>
    </section>
  );
}
