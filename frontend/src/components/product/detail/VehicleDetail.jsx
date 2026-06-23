"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { StarRating, RelatedProducts } from "./shared";

/* ─── VEHICLE detail (Tesla / Ola style) ──────────── */

export default function VehicleDetail({ product }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "", date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${product.name} on Konark Industry`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = `Hi, I'm interested in *${product.name}* from Konark Industry.\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };
  const specs = product.specifications ? Object.entries(product.specifications) : [];
  const isUpcoming = product.isUpcoming === true || product.specifications?.Status === "Upcoming";

  const VEHICLE_HIGHLIGHTS = [
    { icon: "⚡", label: "Range", value: product.specifications?.Range || "Up to 200 km" },
    { icon: "🏎", label: "Motor", value: product.specifications?.Motor || product.specifications?.MotorType || "1000W" },
    { icon: "🔋", label: "Battery", value: product.specifications?.Battery || "Removable" },
    { icon: "🛞", label: "Tyres", value: product.specifications?.Tyre || "12 Inch" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "test_ride", vehicle: product.name }),
      });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #050a14 0%, #080f1e 40%, #050a14 100%)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", alignItems: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "#94a3b8", textDecoration: "none" }}>Products</Link>
        <span>/</span>
        <span style={{ color: "#38bdf8" }}>{product.name}</span>
      </div>

      {/* Cinematic hero image */}
      <div style={{
        maxWidth: 1280, margin: "24px auto 0", padding: "0 24px",
        background: "linear-gradient(145deg, #0d1b2e, #050a14)",
        borderRadius: 24, overflow: "hidden",
        border: "1px solid rgba(56,189,248,0.15)",
        position: "relative", minHeight: 420,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(56,189,248,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
        {product.isNew && (
          <span style={{ position: "absolute", top: 24, left: 24, background: "#38bdf8", color: "#080f1e", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>NEW</span>
        )}
        <span style={{ position: "absolute", top: 24, right: 24, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.35)", color: "#38bdf8", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚡ EV Vehicle</span>
        {product.image?.startsWith("http") ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "contain", padding: "40px 15%", filter: "drop-shadow(0 8px 40px rgba(56,189,248,0.2))", zIndex: 1 }}
            sizes="(max-width: 768px) 90vw, 600px"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            style={{ maxHeight: 380, maxWidth: "70%", objectFit: "contain", filter: "drop-shadow(0 8px 40px rgba(56,189,248,0.2))", position: "relative", zIndex: 1 }}
          />
        )}
      </div>

      {/* Spec strip */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
          background: "#1c3050", borderRadius: 14, overflow: "hidden", marginTop: 24,
        }} className="spec-strip">
          {VEHICLE_HIGHLIGHTS.map((s) => (
            <div key={s.label} style={{ background: "#0c1525", padding: "20px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 22, margin: "0 0 4px" }}>{s.icon}</p>
              <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{s.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 400px", gap: 48, alignItems: "start" }} className="vehicle-grid">
        {/* Left: info */}
        <div>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.15 }}>{product.name}</h1>
          <StarRating rating={product.rating} size={16} />
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, margin: "20px 0" }}>{product.description}</p>

          {product.price > 0 ? (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 2px" }}>Starting from</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: "#38bdf8", margin: 0 }}>₹{product.price.toLocaleString("en-IN")}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>or ₹{Math.round(product.price / 24).toLocaleString("en-IN")}/month over 24 months EMI</p>
            </div>
          ) : (
            <p style={{ fontSize: 20, fontWeight: 700, color: "#64748b", fontStyle: "italic", marginBottom: 24 }}>Price on Request</p>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
            <a href={isUpcoming ? "/contact?interest=upcoming" : "#book-test-ride"} style={{
              padding: "14px 32px", background: "#38bdf8", color: "#080f1e",
              fontWeight: 800, fontSize: 15, borderRadius: 10, textDecoration: "none",
              transition: "background 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0ea5e9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#38bdf8")}
            >
              {isUpcoming ? "Register Interest" : "Book Test Ride"}
            </a>
            <a href="tel:+919437611129" style={{
              padding: "14px 32px", border: "1px solid rgba(56,189,248,0.35)",
              color: "#38bdf8", fontWeight: 700, fontSize: 15, borderRadius: 10,
              textDecoration: "none", transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Get Best Price
            </a>
          </div>

          {/* Share buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            <button
              onClick={handleShare}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "transparent", border: "1px solid #1c3050", color: "#94a3b8", fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: "pointer" }}
            >
              🔗 Share
            </button>
            <button
              onClick={handleWhatsAppShare}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#25D366", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer" }}
            >
              📱 WhatsApp
            </button>
          </div>

          {/* Why choose */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Why choose this vehicle</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "🇮🇳", title: "Made in India", desc: "Manufactured at our Bhubaneswar facility" },
                { icon: "🔋", title: "Long Battery Life", desc: "Removable LFP battery for convenience" },
                { icon: "🛡", title: "2-Year Warranty", desc: "Full warranty on motor and battery" },
                { icon: "🔧", title: "Service Network", desc: "Doorstep service across Odisha" },
              ].map((f) => (
                <div key={f.title} style={{ background: "#0c1525", border: "1px solid #1c3050", borderRadius: 12, padding: "16px" }}>
                  <p style={{ fontSize: 22, margin: "0 0 8px" }}>{f.icon}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div style={{ background: "#0c1525", border: "1px solid #1c3050", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>What's included</h3>
            {[
              "🔌 Portable charger (home + fast-charge adapter)",
              "📄 Registration assistance & RC support",
              "🛡 2-year motor warranty card",
              "🔧 Free first service (within 3 months)",
              "📱 Digital display & remote anti-theft",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1c305060", fontSize: 13, color: "#94a3b8" }}>
                {item}
              </div>
            ))}
          </div>

          {/* Upcoming model banner */}
          {isUpcoming && (
            <div style={{
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.3)",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", gap: 12, marginBottom: 28,
              alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 22 }}>⚡</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#a5b4fc", margin: "0 0 4px" }}>New Model Coming Soon</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.6 }}>
                  This is an upcoming Konark product. Register your interest to be notified when it launches.
                </p>
                <Link
                  href="/contact?interest=upcoming"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.4)", color: "#a5b4fc", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(129,140,248,0.3)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(129,140,248,0.2)")}
                >
                  Register Interest →
                </Link>
              </div>
            </div>
          )}

          {/* Full specs accordion */}
          {specs.length > 0 && (
            <div style={{ borderTop: "1px solid #1c3050", paddingTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>
                {isUpcoming ? "🚀 Upcoming New Model — Specifications" : "Full Specifications"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
                {specs.map(([k, v], i) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1c3050" }}>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Book test ride form */}
        <div id="book-test-ride" style={{ background: "#0c1525", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 20, padding: "28px", position: "sticky", top: 80 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
              {isUpcoming ? "Register Your Interest" : "Book a Test Ride"}
            </p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{isUpcoming ? "Be the first to know" : "Experience it yourself"}</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0", lineHeight: 1.6 }}>
              {isUpcoming ? "We'll notify you the moment it launches and bookings open." : "Come to our Bhubaneswar showroom. No pressure, just drive."}
            </p>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#10b981", margin: "0 0 8px" }}>Booking Confirmed!</p>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
                We'll call <strong style={{ color: "#38bdf8" }}>{form.phone}</strong> to confirm your slot. See you at our showroom!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { k: "name", label: "Full Name", placeholder: "Rajesh Kumar", type: "text" },
                { k: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                { k: "city", label: "Your City", placeholder: "Bhubaneswar", type: "text" },
              ].map((f) => (
                <div key={f.k}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.k]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.k]: e.target.value }))}
                    required
                    placeholder={f.placeholder}
                    style={{ width: "100%", background: "#080f1e", border: "1px solid #1c3050", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1c3050")}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Preferred Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  style={{ width: "100%", background: "#080f1e", border: "1px solid #1c3050", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", colorScheme: "dark", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1c3050")}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{ marginTop: 4, padding: "14px", background: "#38bdf8", color: "#080f1e", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", opacity: submitting ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#0ea5e9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#38bdf8"; }}
              >
                {submitting ? "Booking..." : "Confirm Test Ride →"}
              </button>
              <p style={{ fontSize: 11, color: "#475569", textAlign: "center", margin: 0 }}>
                📍 Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002
              </p>
            </form>
          )}
        </div>
      </div>

      <RelatedProducts current={product} />

      <style>{`
        @media (max-width: 900px) {
          .vehicle-grid { grid-template-columns: 1fr !important; }
          .spec-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .spec-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
