"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/components/product/ProductData";
import EnquiryModal from "@/components/forms/EnquiryModal";
import { getProductReviews, submitReview } from "@/lib/api";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";

/* ─── Shared helpers ─────────────────────────────── */

const BADGE_COLORS = {
  "Electric Vehicles": "#00d4ff",
  Batteries: "#7c3aed",
  "Home Appliances": "#10b981",
  "Industrial Equipment": "#f97316",
  "Industrial Components": "#f97316",
  Electronics: "#94a3b8",
  "Industrial Services": "#a78bfa",
};

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: size, height: size }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: size - 1, color: "#94a3b8" }}>({rating})</span>
    </div>
  );
}

function useReviews(slug) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => {
    setLoading(true);
    getProductReviews(slug)
      .then((data) => setReviews(Array.isArray(data) ? data : data?.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, [slug]);
  return { reviews, loading, refresh };
}

function RelatedProducts({ current }) {
  const related = products.filter((p) => p.category === current.category && p.slug !== current.slug).slice(0, 4);
  if (!related.length) return null;
  return (
    <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 24px 60px" }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>Related Products</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {related.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, overflow: "hidden", textDecoration: "none", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d4a6b")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
          >
            <div style={{ background: "#111827", height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={p.image} alt={p.name} loading="lazy" style={{ maxHeight: 120, maxWidth: "90%", objectFit: "contain" }} />
            </div>
            <div style={{ padding: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 4px" }}>{p.name}</p>
              <p style={{ fontSize: 13, color: "#00d4ff", margin: 0, fontWeight: 700 }}>{p.price ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── VEHICLE detail (Tesla / Ola style) ──────────── */

function VehicleDetailPage({ product }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "", date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const specs = product.specifications ? Object.entries(product.specifications) : [];

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
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", alignItems: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "#94a3b8", textDecoration: "none" }}>Products</Link>
        <span>/</span>
        <span style={{ color: "#00d4ff" }}>{product.name}</span>
      </div>

      {/* Cinematic hero image */}
      <div style={{
        maxWidth: 1280, margin: "24px auto 0", padding: "0 24px",
        background: "linear-gradient(145deg, #0d1b2e, #060d1a)",
        borderRadius: 24, overflow: "hidden",
        border: "1px solid rgba(0,212,255,0.15)",
        position: "relative", minHeight: 420,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(0,212,255,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
        {product.isNew && (
          <span style={{ position: "absolute", top: 24, left: 24, background: "#00d4ff", color: "#0a0f1e", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>NEW</span>
        )}
        <span style={{ position: "absolute", top: 24, right: 24, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.35)", color: "#00d4ff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚡ EV Vehicle</span>
        <img
          src={product.image}
          alt={product.name}
          style={{ maxHeight: 380, maxWidth: "70%", objectFit: "contain", filter: "drop-shadow(0 8px 40px rgba(0,212,255,0.2))", position: "relative", zIndex: 1 }}
        />
      </div>

      {/* Spec strip */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
          background: "#1e2d40", borderRadius: 14, overflow: "hidden", marginTop: 24,
        }} className="spec-strip">
          {VEHICLE_HIGHLIGHTS.map((s) => (
            <div key={s.label} style={{ background: "#0f172a", padding: "20px 16px", textAlign: "center" }}>
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
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.15 }}>{product.name}</h1>
          <StarRating rating={product.rating} size={16} />
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, margin: "20px 0" }}>{product.description}</p>

          {product.price > 0 ? (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 2px" }}>Starting from</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: "#00d4ff", margin: 0 }}>₹{product.price.toLocaleString("en-IN")}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>or ₹{Math.round(product.price / 24).toLocaleString("en-IN")}/month over 24 months EMI</p>
            </div>
          ) : (
            <p style={{ fontSize: 20, fontWeight: 700, color: "#64748b", fontStyle: "italic", marginBottom: 24 }}>Price on Request</p>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
            <a href="#book-test-ride" style={{
              padding: "14px 32px", background: "#00d4ff", color: "#0a0f1e",
              fontWeight: 800, fontSize: 15, borderRadius: 10, textDecoration: "none",
              transition: "background 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
            >
              Book Test Ride
            </a>
            <a href="tel:+919437611129" style={{
              padding: "14px 32px", border: "1px solid rgba(0,212,255,0.35)",
              color: "#00d4ff", fontWeight: 700, fontSize: 15, borderRadius: 10,
              textDecoration: "none", transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Get Best Price
            </a>
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
                <div key={f.title} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "16px" }}>
                  <p style={{ fontSize: 22, margin: "0 0 8px" }}>{f.icon}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>What's included</h3>
            {[
              "🔌 Portable charger (home + fast-charge adapter)",
              "📄 Registration assistance & RC support",
              "🛡 2-year motor warranty card",
              "🔧 Free first service (within 3 months)",
              "📱 Digital display & remote anti-theft",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e2d4060", fontSize: 13, color: "#94a3b8" }}>
                {item}
              </div>
            ))}
          </div>

          {/* Full specs accordion */}
          {specs.length > 0 && (
            <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>Full Specifications</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
                {specs.map(([k, v], i) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d40" }}>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Book test ride form */}
        <div id="book-test-ride" style={{ background: "#0f172a", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 20, padding: "28px", position: "sticky", top: 80 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#00d4ff", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Book a Test Ride</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Experience it yourself</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0", lineHeight: 1.6 }}>Come to our Bhubaneswar showroom. No pressure, just drive.</p>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#10b981", margin: "0 0 8px" }}>Booking Confirmed!</p>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
                We'll call <strong style={{ color: "#00d4ff" }}>{form.phone}</strong> to confirm your slot. See you at our showroom!
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
                    style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
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
                  style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", colorScheme: "dark", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{ marginTop: 4, padding: "14px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", opacity: submitting ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#00b8d9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#00d4ff"; }}
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

/* ─── PRODUCT detail (Flipkart style) ─────────────── */

function ReviewsTab({ slug }) {
  const { reviews, loading, refresh } = useReviews(slug);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("konark_token");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await submitReview(slug, rating, comment);
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit review. Please log in first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
      {/* Submit form */}
      {isLoggedIn && (
        <div style={{ background: "#0f172a", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12, padding: 20, marginBottom: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 14px" }}>Write a Review</p>
          <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg viewBox="0 0 20 20" fill={s <= rating ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 24, height: 24 }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={3} placeholder="Share your experience with this product..." style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")} onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
            <button type="submit" disabled={submitting} style={{ padding: "10px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 8, border: "none", cursor: submitting ? "not-allowed" : "pointer", width: "fit-content", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 24px" }}>
          <p style={{ fontSize: 20, marginBottom: 8 }}>⭐</p>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>No reviews yet. Be the first to review this product!</p>
          {!isLoggedIn && <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}><Link href="/login" style={{ color: "#00d4ff" }}>Sign in</Link> to write a review.</p>}
        </div>
      ) : (
        reviews.map((r, i) => (
          <div key={r.id || i} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{r.reviewer_name || r.name || "Customer"}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
              </span>
            </div>
            <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} viewBox="0 0 20 20" fill={s <= (r.rating || 5) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 13, height: 13 }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>{r.comment || r.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

function ProductDetailPage({ product }) {
  const [qty, setQty] = useState(1);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";
  const formattedPrice = product.price ? `₹${product.price.toLocaleString("en-IN")}` : null;
  const specs = product.specifications ? Object.entries(product.specifications) : [];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id || product.slug,
        slug: product.slug,
        name: product.name,
        price: product.price || 0,
        image: product.images?.[0] || product.image || "",
        category: product.category || "",
        type: product.type || "product",
      });
    }
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", alignItems: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "#94a3b8", textDecoration: "none" }}>Products</Link>
        <span>/</span>
        <span style={{ color: "#00d4ff" }}>{product.name}</span>
      </div>

      {/* Main two-col */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "45% 55%", gap: 40, alignItems: "start" }} className="detail-grid">
        {/* LEFT: image */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340, position: "relative" }}>
            {product.isNew && (
              <span style={{ position: "absolute", top: 16, left: 16, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, textTransform: "uppercase" }}>NEW</span>
            )}
            {/* In Stock */}
            <span style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>● In Stock</span>
            <img src={product.image} alt={product.name} style={{ maxHeight: 280, maxWidth: "85%", objectFit: "contain", filter: "drop-shadow(0 4px 20px rgba(0,212,255,0.15))" }} />
          </div>
        </div>

        {/* RIGHT: details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: "uppercase", letterSpacing: "0.08em", width: "fit-content" }}>
            {product.category}
          </span>

          <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "#f1f5f9", margin: 0, lineHeight: 1.2 }}>{product.name}</h1>

          <StarRating rating={product.rating} />

          {/* Price block */}
          <div>
            <p style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, color: formattedPrice ? "#00d4ff" : "#94a3b8", margin: 0, fontStyle: formattedPrice ? "normal" : "italic" }}>
              {formattedPrice || "Price on Request"}
            </p>
            {product.price > 0 && (
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>or ₹{Math.round(product.price / 12).toLocaleString("en-IN")}/mo on EMI</p>
            )}
          </div>

          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{product.shortDescription || product.description}</p>

          {/* Delivery estimate */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8 }}>
            <span style={{ fontSize: 14 }}>🚚</span>
            <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>Estimated delivery in <strong>5–7 business days</strong></p>
          </div>

          {/* Offers */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#f97316", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Available Offers</p>
            {[
              "✦ 10% off on first order with code KONARK10",
              "✦ Free delivery on orders above ₹5,000",
              "✦ 2-year warranty included",
            ].map((o) => <p key={o} style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{o}</p>)}
          </div>

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Qty:</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #1e2d40", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleAddToCart}
                style={{ flex: 1, padding: "14px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 15, borderRadius: 10, border: "none", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
              >
                Add to Cart 🛒
              </button>
              <button
                onClick={() => { toggle(product.slug); toast(isInWishlist(product.slug) ? "Removed from wishlist" : "Saved to wishlist ❤️"); }}
                style={{ width: 48, height: 48, borderRadius: 10, border: "1px solid #1e2d40", background: isInWishlist(product.slug) ? "rgba(239,68,68,0.1)" : "transparent", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {isInWishlist(product.slug) ? "❤️" : "🤍"}
              </button>
            </div>
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{ padding: "14px", background: "transparent", color: "#f1f5f9", fontWeight: 600, fontSize: 15, borderRadius: 10, border: "1px solid #1e2d40", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
            >
              Buy Now / Enquire
            </button>
          </div>

          {/* Trust pills */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["🛡 2-Year Warranty", "🚚 Free Delivery", "↩ Easy Returns"].map((t) => (
              <span key={t} style={{ fontSize: 12, color: "#94a3b8", background: "#0f172a", border: "1px solid #1e2d40", padding: "5px 10px", borderRadius: 6 }}>{t}</span>
            ))}
          </div>

          {/* Key specs */}
          {specs.length > 0 && (
            <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Key Highlights</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {specs.slice(0, 6).map(([k, v]) => (
                  <li key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ color: "#10b981", flexShrink: 0 }}>✓</span>
                    <span><strong style={{ color: "#f1f5f9" }}>{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs accordion */}
          {specs.length > 0 && (
            <div style={{ border: "1px solid #1e2d40", borderRadius: 10 }}>
              <button
                onClick={() => setSpecsOpen((o) => !o)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "transparent", border: "none", color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Full Specifications
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, transform: specsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </button>
              {specsOpen && (
                <div style={{ borderTop: "1px solid #1e2d40", padding: "0 16px 16px" }}>
                  {specs.map(([k, v], i) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < specs.length - 1 ? "1px solid #1e2d40" : "none" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #1e2d40", gap: 0, marginBottom: 28 }}>
          {["description", "specifications", "reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#00d4ff" : "transparent"}`, color: activeTab === tab ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "description" && <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, maxWidth: 720 }}>{product.description}</p>}
        {activeTab === "specifications" && specs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px", maxWidth: 720 }}>
            {specs.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d40" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "reviews" && <ReviewsTab slug={product.slug} />}
      </div>

      <RelatedProducts current={product} />
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} product={product} />
      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── SERVICE detail (Urban Company style) ─────────── */

function ServiceDetailPage({ product }) {
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

/* ─── Router ─────────────────────────────────────── */

export default function ProductPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 20, color: "#ef4444", fontWeight: 600 }}>Product not found</p>
        <Link href="/products" style={{ color: "#00d4ff", textDecoration: "none", fontSize: 14 }}>← Back to Products</Link>
      </div>
    );
  }

  if (product.type === "vehicle") return <VehicleDetailPage product={product} />;
  if (product.type === "service") return <ServiceDetailPage product={product} />;
  return <ProductDetailPage product={product} />;
}
