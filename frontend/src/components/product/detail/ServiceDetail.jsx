"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { RelatedProducts } from "./shared";

/* ─── SERVICE detail (Urban Company style) ─────────── */

export default function ServiceDetail({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", city: "", problem: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "service", service: product.name }),
      });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", alignItems: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/services" style={{ color: "#94a3b8", textDecoration: "none" }}>Services</Link>
        <span>/</span>
        <span style={{ color: "#a78bfa" }}>{product.name}</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "32px auto 0", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }} className="service-grid">
        {/* Left: service info */}
        <div>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Service
          </span>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#a78bfa" }}>⏱ Response within 2 hrs</span>
            <span style={{ fontSize: 13, color: "#10b981" }}>✓ Free Inspection</span>
            <span style={{ fontSize: 13, color: "#00d4ff" }}>🛡 Service Warranty</span>
          </div>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>

          {/* What's included */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>What's included</h3>
            {[
              "🔍 Free inspection & diagnosis",
              "🧰 Skilled certified technician",
              "📦 Genuine spare parts (if needed)",
              "✅ Post-service quality check",
              "📄 Service report & 30-day warranty",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e2d4060", fontSize: 13, color: "#94a3b8" }}>
                {item}
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>How it works</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { step: "1", title: "Book Online", desc: "Fill the form or call us — we confirm within 2 hours" },
                { step: "2", title: "Technician Visit", desc: "Our certified technician visits your location on the preferred date" },
                { step: "3", title: "Service & Report", desc: "Work completed with full transparency. You receive a service report." },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#a78bfa" }}>{s.step}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service areas */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Service Areas</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Bhubaneswar", "Cuttack", "Puri", "Berhampur", "Sambalpur", "Rourkela"].map((city) => (
                <span key={city} style={{ fontSize: 12, color: "#94a3b8", background: "#111827", border: "1px solid #1e2d40", padding: "4px 10px", borderRadius: 100 }}>{city}</span>
              ))}
            </div>
          </div>

          {/* Pricing note */}
          <div style={{ padding: "16px 20px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#10b981", margin: "0 0 4px" }}>💰 Transparent Pricing</p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Free inspection visit. Final quote given on-site before any work begins. No hidden charges.</p>
          </div>
        </div>

        {/* Right: booking form */}
        <div style={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 20, padding: "28px", position: "sticky", top: 80 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Book This Service</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Get a Free Quote</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0" }}>We'll call you within 2 hours to confirm.</p>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#10b981", margin: "0 0 8px" }}>Booking Confirmed!</p>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
                We'll call <strong style={{ color: "#a78bfa" }}>{form.phone}</strong> within 2 hours to schedule your service.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { k: "name", label: "Your Name", placeholder: "Rajesh Kumar", type: "text" },
                { k: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                { k: "city", label: "City", placeholder: "Bhubaneswar", type: "text" },
              ].map((f) => (
                <div key={f.k}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.k]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.k]: e.target.value }))}
                    required
                    placeholder={f.placeholder}
                    style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Describe the problem</label>
                <textarea
                  value={form.problem}
                  onChange={(e) => setForm((prev) => ({ ...prev, problem: e.target.value }))}
                  rows={3}
                  placeholder="e.g. PCB not working, need soldering for 5 units..."
                  style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{ marginTop: 4, padding: "14px", background: "#7c3aed", color: "#fff", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", opacity: submitting ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#6d28d9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#7c3aed"; }}
              >
                {submitting ? "Booking..." : "Book This Service →"}
              </button>
              <p style={{ fontSize: 12, color: "#475569", textAlign: "center", margin: 0 }}>
                Or call: <a href="tel:+919437611129" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a>
              </p>
            </form>
          )}
        </div>
      </div>

      <RelatedProducts current={product} />
      <style>{`
        @media (max-width: 900px) {
          .service-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
