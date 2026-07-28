"use client";

import { useState } from "react";
import Link from "next/link";
import { submitEnquiry } from "@/lib/api";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SERVICE_OPTIONS = [
  "AC Repair & Service",
  "AC Installation (New)",
  "EV Charger Installation",
  "EV Charger Repair",
  "Home Electrical Wiring",
  "Electrical Fault Finding",
  "Solar Panel Installation",
  "Battery System Setup",
  "Annual Maintenance (AMC)",
  "Other — Please describe",
];

const INPUT_STYLE: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-default)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "var(--text-body)",
  fontSize: 15,
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const LABEL_STYLE: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={LABEL_STYLE}>
        {label} {required && <span style={{ color: "var(--navy)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EnquiryPage() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "",
    city: "", date: "", problem: "", urgency: "moderate",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--navy)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border-default)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitEnquiry({ ...form, enquiry_type: "service" });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      {/* Hero */}
      <div style={{
        background: "var(--grad-section)",
        borderBottom: "1px solid var(--border-light)",
        padding: "60px 24px 48px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "var(--text-subtle)" }}>
            <Link href="/" style={{ color: "var(--text-subtle)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
            >Home</Link>
            <span>›</span>
            <Link href="/services" style={{ color: "var(--text-subtle)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
            >Services</Link>
            <span>›</span>
            <span style={{ color: "var(--text-muted)" }}>Book a Service</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "var(--text-heading)", margin: "0 0 14px", lineHeight: 1.15 }}>
            Book a Service
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
            Tell us what's wrong. We'll send the right person.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="enquiry-grid">

          {/* LEFT — Form */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 28px" }}>
              What do you need help with?
            </h2>

            {success ? (
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-light)",
                borderRadius: 16, padding: "48px 32px", textAlign: "center", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 14px" }}>
                  Enquiry Sent!
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 28 }}>
                  We've received your request. Our team will call you on{" "}
                  <strong style={{ color: "var(--navy)" }}>{form.phone}</strong> within 2 hours to confirm your service slot.
                </p>
                <button
                  onClick={() => { setSuccess(false); setForm({ name: "", phone: "", email: "", service: "", city: "", date: "", problem: "", urgency: "moderate" }); }}
                  style={{
                    background: "var(--grad-navy)", color: "#ffffff", padding: "12px 28px",
                    borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none",
                    cursor: "pointer", boxShadow: "var(--shadow-navy)",
                  }}
                >
                  Book Another Service
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field label="Your Name" required>
                  <input
                    type="text" value={form.name} onChange={set("name")} required
                    style={INPUT_STYLE} placeholder="e.g. Rajesh Kumar"
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </Field>

                <Field label="Phone Number" required>
                  <input
                    type="tel" value={form.phone} onChange={set("phone")} required
                    style={INPUT_STYLE} placeholder="+91 98765 43210"
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 4 }}>We'll call to confirm your slot</span>
                </Field>

                <Field label="Email Address">
                  <input
                    type="email" value={form.email} onChange={set("email")}
                    style={INPUT_STYLE} placeholder="Optional"
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </Field>

                <Field label="Service Type" required>
                  <select
                    value={form.service} onChange={set("service")} required
                    style={{ ...INPUT_STYLE, appearance: "none" as const }}
                    onFocus={focusStyle} onBlur={blurStyle}
                  >
                    <option value="" disabled>Select a service...</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s} style={{ background: "var(--bg-card)" }}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Your City / Area" required>
                  <input
                    type="text" value={form.city} onChange={set("city")} required
                    style={INPUT_STYLE} placeholder="e.g. Bhubaneswar, Cuttack, Rourkela"
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </Field>

                <Field label="Preferred Date">
                  <input
                    type="date" value={form.date} onChange={set("date")}
                    style={{ ...INPUT_STYLE, colorScheme: "light" }}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </Field>

                <Field label="Describe the Problem" required>
                  <textarea
                    value={form.problem} onChange={set("problem")} required
                    rows={4}
                    style={{ ...INPUT_STYLE, resize: "vertical", fontFamily: "inherit" }}
                    placeholder="e.g. My AC is running but not cooling. It was installed 3 years ago. The brand is Voltas 1.5 ton."
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </Field>

                <Field label="How urgent is this?">
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 0" }}>
                    {[
                      { value: "low", label: "Not urgent — book in advance" },
                      { value: "moderate", label: "Moderate — within 2–3 days" },
                      { value: "urgent", label: "Urgent — as soon as possible" },
                    ].map((opt) => (
                      <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: form.urgency === opt.value ? "var(--text-heading)" : "var(--text-muted)" }}>
                        <input
                          type="radio" name="urgency" value={opt.value}
                          checked={form.urgency === opt.value}
                          onChange={set("urgency")}
                          style={{ accentColor: "var(--navy)", width: 16, height: 16 }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </Field>

                {error && (
                  <p style={{ fontSize: 13, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 8, padding: "10px 14px", margin: 0 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: 16, background: loading ? "var(--navy-light)" : "var(--grad-navy)",
                    color: "#ffffff", fontWeight: 800, fontSize: 16,
                    borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s", boxShadow: "var(--shadow-navy)",
                  }}
                >
                  {loading ? "Sending..." : "Send Enquiry →"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — Info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: "⏱",
                title: "Fast Response",
                body: "We call back within 2 hours of every enquiry. For urgent requests before noon, we aim for same-day visits.",
              },
              {
                icon: "📍",
                title: "We Cover All of Odisha",
                body: "Bhubaneswar · Cuttack · Puri · Rourkela · Berhampur · Sambalpur · Balasore · Brahmapur and 50+ more cities",
              },
              {
                icon: "🛡",
                title: "Trained & Verified Technicians",
                body: "All our service engineers are certified, background-verified, and carry Konark ID cards. You'll know exactly who is coming.",
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-light)",
                borderRadius: 14, padding: "20px 22px", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 22, lineHeight: 1.3 }}>{card.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px" }}>{card.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>{card.body}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Direct contact */}
            <div style={{
              background: "var(--navy-bg)", border: "1px solid var(--border-navy)",
              borderRadius: 14, padding: "20px 22px",
            }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>Prefer to call directly?</p>
              <a href="tel:+919437611129" style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", textDecoration: "none", display: "block", marginBottom: 4 }}>
                +91 94376 11129
              </a>
              <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>Mon–Sat, 8AM–8PM</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .enquiry-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
