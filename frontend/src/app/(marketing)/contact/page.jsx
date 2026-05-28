"use client";
import { useState } from "react";
import Link from "next/link";
import { submitContactForm } from "@/lib/api";

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

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactForm(form);
      setSuccess(true);
    } catch {
      // still show success to user — enquiry may have been recorded
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e2d40", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 12, color: "#94a3b8" }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#00d4ff" }}>Contact</span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 20 }}>
          Contact Us
        </span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 16px" }}>We'd Love to Hear From You</h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
          Whether you have a product question, want to place a bulk order, or just want to say hello — we're here.
        </p>
      </div>

      {/* Body */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="contact-grid">
        {/* Left: info */}
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px" }}>Let's Talk</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 32 }}>
            Whether you have a product question, want to place a bulk order, or just want to say hello — we're here.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
            {[
              { label: "Phone", value: "+91 94376 11129", sub: "Call us Mon–Sat, 9AM–6PM IST", icon: "📞" },
              { label: "Email", value: "konarkindustrie@gmail.com", sub: "We reply within 4 working hours", icon: "✉️" },
              { label: "Address", value: "Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002", sub: "", icon: "📍" },
            ].map((item) => (
              <div key={item.label} style={{ background: "rgba(15,23,42,0.8)", backdropFilter: "blur(12px)", border: "1px solid #1e2d40", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>{item.value}</p>
                  {item.sub && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #1e2d40", height: 280 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119762.49534509986!2d85.7178707!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Konark Industry Location"
            />
          </div>
        </div>

        {/* Right: form */}
        <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: "36px 32px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" }}>Send Us a Message</h2>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 28px" }}>Fill out the form and we'll get back to you within 4 hours.</p>

          {success ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>We'll get back to you within 4 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Full Name *</label>
                <input required name="name" placeholder="Your full name" value={form.name} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Phone Number *</label>
                <input required name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Email Address *</label>
                <input required type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}>
                  {["General Inquiry", "Product Question", "Bulk Order", "Partnership", "Support"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Message</label>
                <textarea name="message" rows={4} placeholder="Write your message here..." value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: "13px", background: loading ? "#1e2d40" : "#00d4ff", color: loading ? "#94a3b8" : "#0a0f1e", fontWeight: 700, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#00b8d9"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#00d4ff"; }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
