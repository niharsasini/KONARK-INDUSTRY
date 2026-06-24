"use client";
import { useState } from "react";

const inputStyle = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border-light)",
  color: "var(--text-heading)",
  fontSize: 14,
  padding: "10px 14px",
  borderRadius: 8,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function EnquiryModal({ open, onClose, product }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", quantity: "1" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: product?.name }),
      });
      setSuccess(true);
    } catch {}
    setLoading(false);
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, position: "relative", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px" }}>Enquire Now</h2>
        {product && <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 24px" }}>Product: <strong style={{ color: "var(--navy)" }}>{product.name}</strong></p>}

        {success ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-heading)", marginBottom: 8 }}>Enquiry Sent!</h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>We'll call you back within 2 hours.</p>
            <button onClick={onClose} style={{ marginTop: 20, padding: "10px 24px", background: "var(--navy)", color: "#fff", fontWeight: 700, border: "none", borderRadius: 8, cursor: "pointer" }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              required
              name="name"
              placeholder="Full Name *"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
            />
            <input
              required
              name="phone"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
            />
            <input
              name="quantity"
              placeholder="Quantity needed"
              value={form.quantity}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
            />
            <textarea
              name="message"
              placeholder="Your message..."
              rows={3}
              value={form.message}
              onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "13px", background: loading ? "var(--border-light)" : "var(--navy)", color: loading ? "var(--text-muted)" : "#fff", fontWeight: 700, fontSize: 15, borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
            >
              {loading ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
