"use client";

import { useState } from "react";
import Link from "next/link";
import { submitEnquiry } from "@/lib/api";

const BENEFITS = [
  { title: "High Margins", desc: "Competitive pricing models with sustainable long-term profitability.", color: "#00d4ff" },
  { title: "Exclusive Territory", desc: "Protected dealer territories so you're not competing with other Konark partners.", color: "#7c3aed" },
  { title: "Marketing Support", desc: "Co-branded marketing materials, social assets, and product training.", color: "#f97316" },
  { title: "Technical Training", desc: "End-to-end technical support, installation training, and documentation.", color: "#10b981" },
];

const PARTNER_TYPES = [
  { icon: "🏪", title: "Retail Distributor", desc: "Stock and sell Konark products from your shop or showroom." },
  { icon: "🔧", title: "Installation Partner", desc: "Earn per installation — solar, EV chargers, battery systems." },
  { icon: "⚙️", title: "OEM Partner", desc: "Use Konark components (motors, batteries) in your own products." },
  { icon: "🏛️", title: "Institutional Buyer", desc: "Bulk pricing for government bodies, hospitals, and corporates." },
  { icon: "🤝", title: "Referral Partner", desc: "Earn commission per qualified lead you send our way." },
];

const STEPS = [
  { num: 1, label: "Apply Online" },
  { num: 2, label: "Verification Call" },
  { num: 3, label: "Agreement Signing" },
  { num: 4, label: "Onboarding & Training" },
];

const inputStyle = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid #1e2d40",
  color: "#f1f5f9",
  fontSize: 14,
  padding: "11px 14px",
  borderRadius: 8,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function PartnerPage() {
  const [form, setForm] = useState({ company: "", contact: "", phone: "", email: "", city: "", state: "", partnerType: "Retail Distributor", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitEnquiry({
        name: form.contact,
        phone: form.phone,
        email: form.email,
        enquiry_type: "partner",
        message: `Partner Application:\nCompany: ${form.company}\nPartner Type: ${form.partnerType}\nState: ${form.state || ""}\nMessage: ${form.message || ""}`,
        city: form.city,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e2d40", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 12, color: "#94a3b8" }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#00d4ff" }}>Partner With Us</span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 20 }}>
          Partner Program
        </span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.15 }}>
          Partner With KONARK
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Join hands with KONARK to deliver innovative energy, automation, and industrial solutions that power sustainable growth and future-ready infrastructure.
        </p>
      </div>

      {/* Benefits */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px" }}>Why Partner With Us</h2>
            <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 480, margin: "0 auto" }}>Long-term collaborations that create real value for both partners and customers.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderTop: `2px solid ${b.color}`, borderRadius: 16, padding: "28px 24px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner types */}
      <section style={{ background: "#111827", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Who Can Partner With Us</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {PARTNER_TYPES.map((p) => (
              <div key={p.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "18px 20px", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Partnership Process</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, position: "relative" }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,212,255,0.1)", border: "2px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 18, fontWeight: 800, color: "#00d4ff" }}>
                  {s.num}
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section style={{ background: "#111827", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>Apply for Partnership</h2>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>Fill out the form and our partnerships team will contact you within 2 business days.</p>
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: "36px 32px" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Application Submitted!</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Our team will reach out within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {error && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13, padding: "10px 14px", borderRadius: 8 }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Company Name *</label>
                    <input required name="company" placeholder="Your company" value={form.company} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Contact Person *</label>
                    <input required name="contact" placeholder="Your name" value={form.contact} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Phone *</label>
                    <input required name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Email *</label>
                    <input required type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>City</label>
                    <input name="city" placeholder="City" value={form.city} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>State</label>
                    <input name="state" placeholder="State" value={form.state} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Partner Type</label>
                  <select name="partnerType" value={form.partnerType} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}>
                    {PARTNER_TYPES.map((p) => <option key={p.title}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Message</label>
                  <textarea name="message" rows={3} placeholder="Tell us about your business..." value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: "13px", background: loading ? "#1e2d40" : "#00d4ff", color: loading ? "#94a3b8" : "#0a0f1e", fontWeight: 700, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
