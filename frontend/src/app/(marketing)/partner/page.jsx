"use client";

import { useState } from "react";
import Link from "next/link";
import { submitEnquiry } from "@/lib/api";

const BENEFITS = [
  { title: "High Margins", desc: "Competitive pricing models with sustainable long-term profitability.", color: "var(--navy)" },
  { title: "Exclusive Territory", desc: "Protected dealer territories so you're not competing with other Konark partners.", color: "#5b21b6" },
  { title: "Marketing Support", desc: "Co-branded marketing materials, social assets, and product training.", color: "var(--gold)" },
  { title: "Technical Training", desc: "End-to-end technical support, installation training, and documentation.", color: "#1a7a4a" },
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
  background: "var(--bg-page)",
  border: "1px solid var(--border-default)",
  color: "var(--text-heading)",
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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      {/* Hero */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-light)", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 12, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "var(--navy)" }}>Partner With Us</span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid var(--border-navy)", color: "var(--navy)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "var(--navy-bg)", marginBottom: 20 }}>
          Partner Program
        </span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 16px", lineHeight: 1.15 }}>
          Partner With KONARK
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Join hands with KONARK to deliver innovative energy, automation, and industrial solutions that power sustainable growth and future-ready infrastructure.
        </p>
      </div>

      {/* Benefits */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 12px" }}>Why Partner With Us</h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto" }}>Long-term collaborations that create real value for both partners and customers.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderTop: `2px solid ${b.color}`, borderRadius: 16, padding: "28px 24px", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 10px" }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner types */}
      <section style={{ background: "var(--bg-section)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>Who Can Partner With Us</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {PARTNER_TYPES.map((p) => (
              <div key={p.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12, padding: "18px 20px", transition: "border-color 0.2s", boxShadow: "var(--shadow-sm)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px" }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
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
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>Partnership Process</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, position: "relative" }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 14, padding: "28px 20px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--navy-bg)", border: "2px solid var(--border-navy)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 18, fontWeight: 800, color: "var(--navy)" }}>
                  {s.num}
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section style={{ background: "var(--bg-section)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 10px" }}>Apply for Partnership</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Fill out the form and our partnerships team will contact you within 2 business days.</p>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "36px 32px", boxShadow: "var(--shadow-md)" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-heading)", marginBottom: 8 }}>Application Submitted!</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Our team will reach out within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {error && (
                  <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", color: "var(--red)", fontSize: 13, padding: "10px 14px", borderRadius: 8 }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Company Name *</label>
                    <input required name="company" placeholder="Your company" value={form.company} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Contact Person *</label>
                    <input required name="contact" placeholder="Your name" value={form.contact} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Phone *</label>
                    <input required name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Email *</label>
                    <input required type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>City</label>
                    <input name="city" placeholder="City" value={form.city} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>State</label>
                    <input name="state" placeholder="State" value={form.state} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Partner Type</label>
                  <select name="partnerType" value={form.partnerType} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}>
                    {PARTNER_TYPES.map((p) => <option key={p.title}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Message</label>
                  <textarea name="message" rows={3} placeholder="Tell us about your business..." value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: "13px", background: loading ? "var(--border-default)" : "var(--grad-navy)", color: loading ? "var(--text-muted)" : "#ffffff", fontWeight: 700, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "var(--shadow-navy)" }}
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
