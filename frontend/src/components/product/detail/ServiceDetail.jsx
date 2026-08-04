"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { submitServiceBooking } from "@/lib/api";
import { RelatedProducts } from "./shared";

/* ─── SERVICE detail (Urban Company style) ─────────── */

const TIME_SLOTS = [
  { value: "morning", label: "Morning (9AM–12PM)" },
  { value: "afternoon", label: "Afternoon (12PM–4PM)" },
  { value: "evening", label: "Evening (4PM–7PM)" },
];

export default function ServiceDetail({ product }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", date: "", slot: TIME_SLOTS[0].value, problem: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".service-content", {
        y: 40, opacity: 0, blur: 4,
        duration: 0.7, start: "top 90%",
      });
      await animateIn(".related-card", {
        y: 24, opacity: 0, stagger: 0.06, duration: 0.5, start: "top 90%",
      });
    };
    run();
  }, [product?.slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitServiceBooking({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        service_type: product.name,
        city: form.city,
        preferred_date: form.date || undefined,
        time_slot: form.slot,
        problem_description: form.problem,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit booking. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "var(--text-muted)", alignItems: "center" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/services" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Services</Link>
        <span>/</span>
        <span style={{ color: "var(--gold)" }}>{product.name}</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "32px auto 0", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }} className="service-grid">
        {/* Left: service info */}
        <div className="service-content">
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: "rgba(217,119,6,0.12)", color: "var(--gold)", border: "1px solid rgba(217,119,6,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Service
          </span>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 900, color: "var(--text-heading)", margin: "0 0 12px", lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--gold)" }}>⏱ Response within 2 hrs</span>
            <span style={{ fontSize: 13, color: "var(--green)" }}>✓ Free Inspection</span>
            <span style={{ fontSize: 13, color: "var(--navy)" }}>🛡 Service Warranty</span>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>

          {/* What's included */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-heading)", marginBottom: 16 }}>What's included</h3>
            {[
              "🔍 Free inspection & diagnosis",
              "🧰 Skilled certified technician",
              "📦 Genuine spare parts (if needed)",
              "✅ Post-service quality check",
              "📄 Service report & 30-day warranty",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-light)60", fontSize: 13, color: "var(--text-muted)" }}>
                {item}
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-heading)", marginBottom: 16 }}>How it works</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { step: "1", title: "Book Online", desc: "Fill the form or call us — we confirm within 2 hours" },
                { step: "2", title: "Technician Visit", desc: "Our certified technician visits your location on the preferred date" },
                { step: "3", title: "Service & Report", desc: "Work completed with full transparency. You receive a service report." },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--gold)" }}>{s.step}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 2px" }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service areas */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", marginBottom: 10 }}>Service Areas</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Bhubaneswar", "Cuttack", "Puri", "Berhampur", "Sambalpur", "Rourkela"].map((city) => (
                <span key={city} style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--bg-surface)", border: "1px solid var(--border-light)", padding: "4px 10px", borderRadius: 100 }}>{city}</span>
              ))}
            </div>
          </div>

          {/* Pricing note */}
          <div style={{ padding: "16px 20px", background: "rgba(52,199,138,0.08)", border: "1px solid rgba(52,199,138,0.2)", borderRadius: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", margin: "0 0 4px" }}>💰 Transparent Pricing</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Free inspection visit. Final quote given on-site before any work begins. No hidden charges.</p>
          </div>
        </div>

        {/* Right: booking form */}
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 20, padding: "28px", position: "sticky", top: 80 }}>
          {product.externalLink ? (
            <>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Delivered by our partner</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Soumya Shi Power</h3>
                <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "6px 0 0" }}>This service is fulfilled by our trusted energy partner.</p>
              </div>
              <a
                href={product.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", background: "var(--grad-gold)", color: "var(--text-heading)", fontWeight: 800, fontSize: 15, borderRadius: 10, textDecoration: "none" }}
              >
                Visit Partner Site →
              </a>
              <p style={{ fontSize: 12, color: "var(--text-subtle)", textAlign: "center", margin: "12px 0 0" }}>
                Or call: <a href="tel:+919437611129" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a>
              </p>
            </>
          ) : product.internalLink ? (
            <>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Battery Swap</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Book a Swap</h3>
                <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "6px 0 0" }}>Track your swap with a real-time token.</p>
              </div>
              <Link
                href={product.internalLink}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", background: "var(--grad-gold)", color: "var(--text-heading)", fontWeight: 800, fontSize: 15, borderRadius: 10, textDecoration: "none" }}
              >
                Book a Swap →
              </Link>
            </>
          ) : (
          <>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Book This Service</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Get a Free Quote</h3>
            <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "6px 0 0" }}>We'll call you within 2 hours to confirm.</p>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", margin: "0 0 8px" }}>Booking Confirmed!</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                We'll call <strong style={{ color: "var(--gold)" }}>{form.phone}</strong> within 2 hours to schedule your service.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {error && (
                <p style={{ fontSize: 12, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 8, padding: "8px 12px", margin: 0 }}>
                  {error}
                </p>
              )}
              {[
                { k: "name", label: "Your Name", placeholder: "Rajesh Kumar", type: "text", required: true },
                { k: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel", required: true },
                { k: "email", label: "Email", placeholder: "you@example.com", type: "email", required: false },
                { k: "city", label: "City / Area", placeholder: "Bhubaneswar", type: "text", required: true },
              ].map((f) => (
                <div key={f.k}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.k]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.k]: e.target.value }))}
                    required={f.required}
                    placeholder={f.placeholder}
                    style={{ width: "100%", background: "#F5F7FF", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 10, padding: "12px 16px", color: "var(--text-heading)", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,119,6,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Preferred Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    style={{ width: "100%", background: "#F5F7FF", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 10, padding: "12px 16px", color: "var(--text-heading)", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,119,6,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Time Slot</label>
                  <select
                    value={form.slot}
                    onChange={(e) => setForm((prev) => ({ ...prev, slot: e.target.value }))}
                    style={{ width: "100%", background: "#F5F7FF", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 10, padding: "12px 16px", color: "var(--text-heading)", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,119,6,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {TIME_SLOTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Describe the problem</label>
                <textarea
                  value={form.problem}
                  onChange={(e) => setForm((prev) => ({ ...prev, problem: e.target.value }))}
                  rows={3}
                  placeholder="e.g. PCB not working, need soldering for 5 units..."
                  style={{ width: "100%", background: "#F5F7FF", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 10, padding: "12px 16px", color: "var(--text-heading)", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,119,6,0.1)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{ marginTop: 4, padding: "14px", background: "var(--grad-gold)", color: "var(--text-heading)", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", opacity: submitting ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "var(--gold-dark)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--grad-gold)"; }}
              >
                {submitting ? "Booking..." : "Book This Service →"}
              </button>
              <p style={{ fontSize: 12, color: "var(--text-subtle)", textAlign: "center", margin: 0 }}>
                Or call: <a href="tel:+919437611129" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a>
              </p>
            </form>
          )}
          </>
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
