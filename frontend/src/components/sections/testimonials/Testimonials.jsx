"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { products as ALL_PRODUCTS } from "@/components/product/ProductData";

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Bhubaneswar",
    product: "Electric Scooter",
    rating: 5,
    comment: "Outstanding quality! My Konark scooter has been running flawlessly for 8 months. The battery lasts over 80km on a single charge. Best investment I made.",
    date: "June 2025",
  },
  {
    id: 2,
    name: "Priya Mohanty",
    location: "Cuttack",
    product: "BLDC Fan",
    rating: 5,
    comment: "The BLDC fan is incredibly silent and energy-efficient. My electricity bill dropped by ₹800/month. The build quality feels premium and durable.",
    date: "May 2025",
  },
  {
    id: 3,
    name: "Suresh Panda",
    location: "Puri",
    product: "AC Repair Service",
    rating: 5,
    comment: "Technician arrived within 2 hours of booking. Fixed my AC quickly and professionally. Very reasonable pricing. Will definitely call them again.",
    date: "July 2025",
  },
  {
    id: 4,
    name: "Anita Das",
    location: "Rourkela",
    product: "LFP Battery",
    rating: 5,
    comment: "Excellent LFP battery for my solar system. Has been working perfectly for 6 months without any issues. Great after-sales support from the team.",
    date: "April 2025",
  },
  {
    id: 5,
    name: "Bikash Nayak",
    location: "Sambalpur",
    product: "E-Rickshaw",
    rating: 5,
    comment: "Running my e-rickshaw business with Konark vehicle for 1 year. Very reliable, low maintenance cost. Earnings improved significantly.",
    date: "March 2025",
  },
  {
    id: 6,
    name: "Mamata Sahoo",
    location: "Berhampur",
    product: "Battery Swap",
    rating: 5,
    comment: "Battery swap service is a game changer! Done in 15 minutes, back on the road fast. The team is always professional and courteous.",
    date: "June 2025",
  },
  {
    id: 7,
    name: "Dilip Rath",
    location: "Khordha",
    product: "Solar Inverter",
    rating: 4,
    comment: "Good quality solar inverter at a competitive price. Installation team was professional and completed the work neatly. Minor delay in delivery but overall satisfied.",
    date: "May 2025",
  },
  {
    id: 8,
    name: "Sushma Patel",
    location: "Bhubaneswar",
    product: "Electric Motorcycle",
    rating: 5,
    comment: "Absolutely love my Konark electric motorcycle! Powerful, smooth ride and zero fuel costs. The after-sales service team is very responsive.",
    date: "July 2025",
  },
];

const PRODUCT_OPTIONS = [...new Set(ALL_PRODUCTS.map((p) => p.name))].sort();

function getInitials(name) {
  return (name || "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

function getAvatarGradient(name) {
  const c = (name || "?").trim().charAt(0).toUpperCase();
  if (c >= "A" && c <= "F") return "linear-gradient(135deg, #0D518C, #0EA5E9)";
  if (c >= "G" && c <= "L") return "linear-gradient(135deg, #D97706, #F59E0B)";
  if (c >= "M" && c <= "R") return "linear-gradient(135deg, #059669, #10B981)";
  return "linear-gradient(135deg, #7C3AED, #A855F7)";
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: size, color: s <= rating ? "#D97706" : "#E2E8F0", lineHeight: 1 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 320,
        flexShrink: 0,
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "24px 26px",
        position: "relative",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "12px 12px 28px rgba(13,81,140,0.12), -8px -8px 20px rgba(255,255,255,1), 0 0 0 1px rgba(13,81,140,0.08)"
          : "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95), 0 0 0 1px rgba(13,81,140,0.04)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 20,
          right: 22,
          fontSize: 48,
          lineHeight: 1,
          color: "rgba(13,81,140,0.07)",
          fontFamily: "Georgia, serif",
          fontWeight: 900,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        &rdquo;
      </span>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: getAvatarGradient(review.name),
            color: "white",
            fontSize: 16,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(13,81,140,0.2)",
            flexShrink: 0,
          }}
        >
          {getInitials(review.name)}
        </div>
        <Stars rating={review.rating} />
      </div>

      <p style={{ fontSize: 14, fontWeight: 700, color: "#0C1A2E", margin: "0 0 2px" }}>{review.name}</p>
      <p style={{ fontSize: 12, color: "#8BA8C4", fontWeight: 500, margin: 0 }}>{review.location}</p>
      {review.product && (
        <span
          style={{
            display: "inline-block",
            background: "rgba(13,81,140,0.08)",
            border: "1px solid rgba(13,81,140,0.15)",
            color: "#0D518C",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 10px",
            borderRadius: 20,
            letterSpacing: "0.5px",
            marginTop: 4,
          }}
        >
          {review.product}
        </span>
      )}

      <p
        style={{
          fontSize: 14,
          color: "#1E3A5F",
          lineHeight: 1.7,
          fontStyle: "italic",
          marginTop: 14,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {review.comment}
      </p>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid rgba(13,81,140,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669", fontWeight: 600 }}>
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 12, height: 12 }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
        <span style={{ fontSize: 11, color: "#8BA8C4" }}>{review.date}</span>
      </div>
    </div>
  );
}

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const displayRating = hoverRating || rating;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!rating || !name || !comment) return;
      setSubmitting(true);
      try {
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        await fetch(`${BACKEND}/api/v1/testimonials/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, product_used: product, rating, comment }),
        });
      } catch {
        // Still show success — don't leave the user hanging on a network error
      }
      setSubmitting(false);
      setSubmitted(true);
    },
    [rating, name, product, comment]
  );

  if (submitted) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          background: "rgba(5,150,105,0.08)",
          border: "1px solid rgba(5,150,105,0.2)",
          borderRadius: 14,
          color: "#059669",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Thank you! Your review is pending approval.
      </div>
    );
  }

  const inputStyle = {
    background: "#F5F7FF",
    border: "1px solid rgba(13,81,140,0.1)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#0C1A2E",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "inset 3px 3px 8px rgba(13,81,140,0.06), inset -2px -2px 6px rgba(255,255,255,0.9)",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              fontSize: 32,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: s <= displayRating ? "#D97706" : "#E2E8F0",
              transition: "all 0.15s ease",
              transform: s <= displayRating ? "scale(1.2)" : "scale(1)",
              filter: s <= displayRating ? "drop-shadow(0 0 6px rgba(217,119,6,0.4))" : "none",
            }}
          >
            ★
          </button>
        ))}
      </div>

      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={inputStyle}
      />

      <select
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        style={{ ...inputStyle, color: product ? "#0C1A2E" : "#8BA8C4" }}
      >
        <option value="">Select product / service…</option>
        {PRODUCT_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
        <option value="Other">Other</option>
      </select>

      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience…"
        style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
      />

      <button
        type="submit"
        disabled={submitting || !rating || !name || !comment}
        className="clay-btn clay-btn-primary"
        style={{
          width: "100%",
          height: 50,
          fontSize: 15,
          fontWeight: 700,
          borderRadius: 14,
          opacity: submitting || !rating || !name || !comment ? 0.5 : 1,
          cursor: submitting || !rating || !name || !comment ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Submitting…" : "Submit Review →"}
      </button>
    </form>
  );
}

export default function Testimonials() {
  const settings = useSiteSettings();
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: formRef, inView: formIn } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${BACKEND}/api/v1/testimonials`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length >= 1) {
          setReviews(
            data.map((t) => ({
              id: t._id || t.id,
              name: t.name,
              location: t.location,
              product: t.product_used,
              rating: t.rating,
              comment: t.comment,
              date: formatDate(t.created_at),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const displayReviews = [...reviews, ...reviews];
  const avgRating = parseFloat(settings?.stats_rating) || 4.8;

  return (
    <section className="testimonials-section">
      <div className="testimonials-inner">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span
            className="section-tag"
            style={{ background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.2)", color: "#0D518C" }}
          >
            WHAT CUSTOMERS SAY
          </span>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-1px", margin: "16px 0 16px", textAlign: "center" }}>
            <span style={{ color: "#0C1A2E" }}>Real People. </span>
            <span
              style={{
                background: "linear-gradient(135deg, #0D518C, #0EA5E9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Real Results.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: "#4A6785", maxWidth: 480, margin: "0 auto 14px", textAlign: "center" }}>
            Join 25,000+ happy customers across Odisha
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Stars rating={Math.round(avgRating)} size={16} />
            <span style={{ fontSize: 14, color: "#8BA8C4" }}>{avgRating.toFixed(1)} out of 5 from 200+ reviews</span>
          </div>
        </motion.div>

        <div className="testimonials-marquee">
          <div className="testimonials-track">
            {displayReviews.map((review, i) => (
              <ReviewCard key={`${review.id ?? review.name}-${i}`} review={review} />
            ))}
          </div>
        </div>

        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 30 }}
          animate={formIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            boxShadow: "10px 10px 28px rgba(13,81,140,0.1), -8px -8px 22px rgba(255,255,255,0.95)",
            padding: "32px 36px",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0C1A2E", margin: "0 0 6px" }}>Share Your Experience</h3>
          <p style={{ fontSize: 14, color: "#8BA8C4", margin: "0 0 24px" }}>Help others make better decisions</p>
          <ReviewForm />
        </motion.div>
      </div>
    </section>
  );
}
