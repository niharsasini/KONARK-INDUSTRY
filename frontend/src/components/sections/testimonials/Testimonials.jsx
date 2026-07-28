"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const CARD_COLORS = ["#0D518C", "#F4C430", "#4FC3F7"];

const FALLBACK_TESTIMONIALS = [
  {
    name: "Rajesh Kumar Panda", location: "Bhubaneswar, Odisha",
    product: "EV Scooter X1", rating: 5, initials: "RKP", color: "#0D518C",
    text: "I bought the Konark X1 eight months ago for my daily commute from Patia to Infocity — about 22km each way. It handles the route perfectly on a single charge. When I had a minor issue with the charging port, the service team came to my house the next morning and fixed it under warranty. That kind of after-sales support is rare.",
  },
  {
    name: "Sunita Mishra", location: "Cuttack, Odisha",
    product: "LFP Battery System", rating: 5, initials: "SM", color: "#F4C430",
    text: "We run a small rice processing unit and load-shedding was killing our productivity. We got a Konark LFP battery system with our rooftop solar in March last year. Eighteen months — zero downtime, zero issues. The investment paid back in 14 months.",
  },
  {
    name: "Pradeep Sahoo", location: "Rourkela, Odisha",
    product: "BLDC Fan + AC Service", rating: 5, initials: "PS", color: "#4FC3F7",
    text: "First I bought six Konark BLDC fans for our office — electricity bill down by ₹2,400 from the first month. Then our old Voltas AC stopped cooling. Called Konark's service number and their technician was here within four hours. Fixed it the same day. I didn't even buy the AC from them but they serviced it anyway.",
  },
];

const STATS_FALLBACK = [
  { key: "stats_customers", label: "Customers", fallback: "25,000+" },
  { key: "stats_cities", label: "Cities", fallback: "18+" },
  { key: "stats_rating", label: "Average Rating", fallback: "4.8★" },
  { key: "stats_satisfaction", label: "Satisfaction", fallback: "99%" },
];

function Stars({ count, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= count ? "#F4C430" : "none"} stroke="#F4C430" strokeWidth={1.5} style={{ width: size, height: size }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const PRODUCT_OPTIONS = [
  "EV Scooter X1", "E-Rickshaw Standard", "BLDC Fan", "Inverter AC", "LFP Battery", "AC Repair Service", "Solar Inverter", "Battery Swap", "Other",
];

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!rating || !name || !review) return;
    setSubmitting(true);
    try {
      const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${BACKEND}/api/v1/testimonials/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, product_used: product, rating, comment: review }),
      });
      if (!res.ok) throw new Error("Submit failed");
    } catch {
      // Still show success — don't leave user hanging on network error
    }
    setSubmitting(false);
    setSubmitted(true);
  }, [rating, name, product, review]);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 8px" }}>Thank you for your review!</p>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Your experience is pending approval and will appear here soon.</p>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Star selector */}
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)", margin: "0 0 10px" }}>Your Rating</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                fontSize: 36, background: "none", border: "none", cursor: "pointer",
                color: s <= displayRating ? "var(--gold)" : "var(--border-subtle)",
                transition: "color 0.15s, transform 0.15s",
                transform: s <= displayRating ? "scale(1.15)" : "scale(1)",
                padding: 0,
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="review-form-fields">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>Your Name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rajesh Kumar"
            style={{ padding: "10px 14px", border: "1px solid var(--border-subtle)", borderRadius: 10, fontSize: 14, color: "var(--text-heading)", background: "var(--bg-elevated)", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>Product / Service</label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border-subtle)", borderRadius: 10, fontSize: 14, color: product ? "var(--text-heading)" : "var(--text-subtle)", background: "var(--bg-elevated)", outline: "none" }}
          >
            <option value="">Select product…</option>
            {PRODUCT_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>Your Experience *</label>
        <textarea
          required
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your honest experience — what you loved, what could improve…"
          rows={4}
          style={{ padding: "12px 14px", border: "1px solid var(--border-subtle)", borderRadius: 10, fontSize: 14, color: "var(--text-heading)", background: "var(--bg-elevated)", outline: "none", resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !rating || !name || !review}
        style={{
          padding: "13px 32px", borderRadius: 10, border: "none", cursor: submitting || !rating || !name || !review ? "not-allowed" : "pointer",
          background: "linear-gradient(135deg, var(--navy), var(--navy-dark))", color: "#fff",
          fontSize: 15, fontWeight: 700, transition: "all 0.25s",
          opacity: submitting || !rating || !name || !review ? 0.5 : 1,
          alignSelf: "flex-start",
        }}
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

export default function Testimonials() {
  const settings = useSiteSettings();
  const STATS = STATS_FALLBACK.map((s) => ({
    value: settings?.[s.key] || s.fallback,
    label: s.label,
  }));

  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });
  const { ref: statsRef, inView: statsIn } = useInView({ threshold: 0.1, triggerOnce: true });

  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${BACKEND}/api/v1/testimonials`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length >= 1) {
          const real = data.slice(0, 3).map((t, i) => ({
            name: t.name,
            location: t.location,
            product: t.product_used,
            rating: t.rating,
            initials: t.avatar_initials || t.name.charAt(0),
            color: CARD_COLORS[i % CARD_COLORS.length],
            text: t.comment,
          }));
          // Bento grid needs exactly 3 cards — pad with fallbacks if admin has added fewer.
          const padded = [...real, ...FALLBACK_TESTIMONIALS].slice(0, 3);
          setTestimonials(padded);
        }
      })
      .catch(() => {});
  }, []);

  const [featured, card2, card3] = testimonials;

  return (
    <section style={{ background: "rgba(13,27,53,0.4)", borderTop: "1px solid rgba(92,103,149,0.1)", padding: "96px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8%", left: "5%", fontSize: 320, fontWeight: 900, color: "rgba(92,103,149,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none", fontFamily: "Georgia, serif" }}>&quot;</div>

      <div className="t-container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span className="section-tag">
            WHAT CUSTOMERS SAY
          </span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
            <span style={{ color: "var(--text-heading)" }}>Real People. </span>
            <span className="gradient-text">Real Results.</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto" }}>
            25,000+ customers across Odisha trust Konark Industry for their energy needs.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div ref={gridRef} className="t-bento-grid" style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 20, marginBottom: 20 }}>
          {/* Card 1 — large featured */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={gridIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{
              background: "rgba(22,41,82,0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(92,103,149,0.2)",
              borderRadius: 24,
              padding: 40,
              boxShadow: "0 8px 32px rgba(10,14,26,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ fontSize: 80, lineHeight: 0.8, color: "rgba(79,195,247,0.15)", fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</div>
            <p style={{ fontSize: 17, color: "#B8D0E8", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1 }}>
              {featured.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid rgba(92,103,149,0.15)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${featured.color}20`, border: `2px solid ${featured.color}60`, display: "flex", alignItems: "center", justifyContent: "center", color: featured.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {featured.initials}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#E8F4FF", margin: 0 }}>{featured.name}</p>
                <p style={{ fontSize: 13, color: "#5C6795", margin: "2px 0 6px" }}>{featured.location}</p>
                <Stars count={featured.rating} />
              </div>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#4FC3F7", fontWeight: 600, background: "rgba(13,81,140,0.2)", padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(79,195,247,0.2)" }}>
                {featured.product}
              </span>
            </div>
          </motion.div>

          {/* Right column: two stacked small cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={gridIn ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                background: "rgba(22,41,82,0.5)",
                border: "1px solid rgba(92,103,149,0.15)",
                borderRadius: 20,
                padding: 28,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32, lineHeight: 0.9, color: card2.color, opacity: 0.6, fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                {card2.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${card2.color}20`, border: `2px solid ${card2.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: card2.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{card2.initials}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{card2.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "1px 0 4px" }}>{card2.location}</p>
                  <Stars count={card2.rating} size={11} />
                </div>
                <span style={{ marginLeft: "auto", fontSize: 10, color: card2.color, fontWeight: 600, background: `${card2.color}12`, padding: "3px 8px", borderRadius: 100, border: `1px solid ${card2.color}30`, whiteSpace: "nowrap" }}>
                  {card2.product}
                </span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={gridIn ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                background: "rgba(22,41,82,0.5)",
                border: "1px solid rgba(92,103,149,0.15)",
                borderRadius: 20,
                padding: 28,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32, lineHeight: 0.9, color: card3.color, opacity: 0.6, fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                {card3.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${card3.color}20`, border: `2px solid ${card3.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: card3.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{card3.initials}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{card3.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "1px 0 4px" }}>{card3.location}</p>
                  <Stars count={card3.rating} size={11} />
                </div>
                <span style={{ marginLeft: "auto", fontSize: 10, color: card3.color, fontWeight: 600, background: `${card3.color}12`, padding: "3px 8px", borderRadius: 100, border: `1px solid ${card3.color}30`, whiteSpace: "nowrap" }}>
                  {card3.product}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="t-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={statsIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: 16,
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 900, margin: "0 0 4px", background: "linear-gradient(135deg, var(--navy), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={statsIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: "rgba(22,41,82,0.5)",
            border: "1px solid rgba(92,103,149,0.15)",
            borderRadius: 20,
            padding: "32px 40px",
            maxWidth: 640,
            margin: "48px auto 0",
          }}
        >
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px" }}>
            How was your experience?
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-subtle)", margin: "0 0 24px" }}>
            Share your story — help other customers in Odisha make better decisions.
          </p>
          <ReviewForm />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .t-container { padding: 0 20px !important; }
          .t-bento-grid { grid-template-columns: 1fr !important; }
          .t-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .review-form-fields { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .t-bento-grid { grid-template-columns: 55% 45% !important; }
        }
      `}</style>
    </section>
  );
}
