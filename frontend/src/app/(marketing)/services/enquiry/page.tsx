"use client";
import { useState } from "react";
import Link from "next/link";
import { submitEnquiry } from "@/lib/api";

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
  background: "#0f172a",
  border: "1px solid #1e2d40",
  borderRadius: 10,
  padding: "12px 16px",
  color: "#f1f5f9",
  fontSize: 15,
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const LABEL_STYLE: React.CSSProperties = {
  color: "#94a3b8",
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
        {label} {required && <span style={{ color: "#00d4ff" }}>*</span>}
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
    e.currentTarget.style.borderColor = "#00d4ff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#1e2d40";
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
    <main style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(180deg, #060d1a 0%, #0a0f1e 100%)",
        borderBottom: "1px solid #1e2d40",
        padding: "60px 24px 48px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#475569" }}>
            <Link href="/" style={{ color: "#475569", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >Home</Link>
            <span>›</span>
            <Link href="/services" style={{ color: "#475569", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >Services</Link>
            <span>›</span>
            <span style={{ color: "#94a3b8" }}>Book a Service</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 14px", lineHeight: 1.15 }}>
            Book a Service
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
            Tell us what's wrong. We'll send the right person.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="enquiry-grid">

          {/* LEFT — Form */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 28px" }}>
              What do you need help with?
            </h2>

            {success ? (
              <div style={{
                background: "#0f172a", border: "1px solid #1e2d40",
                borderRadius: 16, padding: "48px 32px", textAlign: "center",
              }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 14px" }}>
                  Enquiry Sent!
                </h3>
                <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 28 }}>
                  We've received your request. Our team will call you on{" "}
                  <strong style={{ color: "#00d4ff" }}>{form.phone}</strong> within 2 hours to confirm your service slot.
                </p>
                <button
                  onClick={() => { setSuccess(false); setForm({ name: "", phone: "", email: "", service: "", city: "", date: "", problem: "", urgency: "moderate" }); }}
                  style={{
                    background: "#00d4ff", color: "#0a0f1e", padding: "12px 28px",
                    borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none",
                    cursor: "pointer",
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
                  <span style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>We'll call to confirm your slot</span>
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
                      <option key={s} value={s} style={{ background: "#0f172a" }}>{s}</option>
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
                    style={{ ...INPUT_STYLE, colorScheme: "dark" }}
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
                      <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: form.urgency === opt.value ? "#f1f5f9" : "#94a3b8" }}>
                        <input
                          type="radio" name="urgency" value={opt.value}
                          checked={form.urgency === opt.value}
                          onChange={set("urgency")}
                          style={{ accentColor: "#00d4ff", width: 16, height: 16 }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </Field>

                {error && (
                  <p style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", margin: 0 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: 16, background: loading ? "#0891b2" : "#00d4ff",
                    color: "#0a0f1e", fontWeight: 800, fontSize: 16,
                    borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
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
                background: "#0f172a", border: "1px solid #1e2d40",
                borderRadius: 14, padding: "20px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 22, lineHeight: 1.3 }}>{card.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" }}>{card.title}</p>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.7 }}>{card.body}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Direct contact */}
            <div style={{
              background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: 14, padding: "20px 22px",
            }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 8px" }}>Prefer to call directly?</p>
              <a href="tel:+919437611129" style={{ fontSize: 18, fontWeight: 800, color: "#00d4ff", textDecoration: "none", display: "block", marginBottom: 4 }}>
                +91 94376 11129
              </a>
              <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>Mon–Sat, 8AM–8PM</p>
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
