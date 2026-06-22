"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CARD_COLORS = ["#00d4ff", "#7c3aed", "#f97316"];

const FALLBACK_TESTIMONIALS = [
  {
    name: "Rajesh Kumar Panda", location: "Bhubaneswar, Odisha",
    product: "EV Scooter X1", rating: 5, initials: "RKP", color: "#00d4ff",
    text: "I bought the Konark X1 eight months ago for my daily commute from Patia to Infocity — about 22km each way. It handles the route perfectly on a single charge. When I had a minor issue with the charging port, the service team came to my house the next morning and fixed it under warranty. That kind of after-sales support is rare.",
  },
  {
    name: "Sunita Mishra", location: "Cuttack, Odisha",
    product: "LFP Battery System", rating: 5, initials: "SM", color: "#7c3aed",
    text: "We run a small rice processing unit and load-shedding was killing our productivity. We got a Konark LFP battery system with our rooftop solar in March last year. Eighteen months — zero downtime, zero issues. The investment paid back in 14 months.",
  },
  {
    name: "Pradeep Sahoo", location: "Rourkela, Odisha",
    product: "BLDC Fan + AC Service", rating: 5, initials: "PS", color: "#f97316",
    text: "First I bought six Konark BLDC fans for our office — electricity bill down by ₹2,400 from the first month. Then our old Voltas AC stopped cooling. Called Konark's service number and their technician was here within four hours. Fixed it the same day. I didn't even buy the AC from them but they serviced it anyway.",
  },
];

const STATS = [
  { value: "25,000+", label: "Customers" },
  { value: "18+", label: "Cities" },
  { value: "4.8★", label: "Average Rating" },
  { value: "99%", label: "Satisfaction" },
];

function Stars({ count, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= count ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: size, height: size }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });
  const { ref: statsRef, inView: statsIn } = useInView({ threshold: 0.1, triggerOnce: true });

  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${BACKEND}/api/v1/testimonials`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length >= 3) {
          setTestimonials(
            data.slice(0, 3).map((t, i) => ({
              name: t.name,
              location: t.location,
              product: t.product_used,
              rating: t.rating,
              initials: t.avatar_initials || t.name.charAt(0),
              color: CARD_COLORS[i % CARD_COLORS.length],
              text: t.comment,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const [featured, card2, card3] = testimonials;

  return (
    <section style={{ background: "#060d1a", padding: "96px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8%", left: "5%", fontSize: 320, fontWeight: 900, color: "rgba(0,212,255,0.015)", lineHeight: 1, pointerEvents: "none", userSelect: "none", fontFamily: "Georgia, serif" }}>&quot;</div>

      <div className="t-container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16 }}>
            WHAT CUSTOMERS SAY
          </span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
            <span style={{ color: "#f1f5f9" }}>Real People. </span>
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Real Results.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 480, margin: "0 auto" }}>
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
              background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: 24,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ fontSize: 80, lineHeight: 0.8, color: "#00d4ff", opacity: 0.3, fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</div>
            <p style={{ fontSize: 18, color: "#f1f5f9", lineHeight: 2, margin: 0, fontStyle: "italic", flex: 1 }}>
              {featured.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid rgba(0,212,255,0.1)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${featured.color}20`, border: `2px solid ${featured.color}60`, display: "flex", alignItems: "center", justifyContent: "center", color: featured.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {featured.initials}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{featured.name}</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "2px 0 6px" }}>{featured.location}</p>
                <Stars count={featured.rating} />
              </div>
              <span style={{ marginLeft: "auto", fontSize: 11, color: featured.color, fontWeight: 600, background: `${featured.color}12`, padding: "4px 12px", borderRadius: 100, border: `1px solid ${featured.color}30` }}>
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
                background: "#0f172a",
                border: "1px solid #1e2d40",
                borderRadius: 20,
                padding: 28,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32, lineHeight: 0.9, color: card2.color, opacity: 0.6, fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                {card2.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${card2.color}20`, border: `2px solid ${card2.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: card2.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{card2.initials}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{card2.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "1px 0 4px" }}>{card2.location}</p>
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
                background: "#0f172a",
                border: "1px solid #1e2d40",
                borderRadius: 20,
                padding: 28,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32, lineHeight: 0.9, color: card3.color, opacity: 0.6, fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                {card3.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${card3.color}20`, border: `2px solid ${card3.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: card3.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{card3.initials}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{card3.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "1px 0 4px" }}>{card3.location}</p>
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
                background: "#0f172a",
                border: "1px solid #1e2d40",
                borderRadius: 16,
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 900, margin: "0 0 4px", background: "linear-gradient(135deg, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .t-container { padding: 0 20px !important; }
          .t-bento-grid { grid-template-columns: 1fr !important; }
          .t-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 1024px) {
          .t-bento-grid { grid-template-columns: 55% 45% !important; }
        }
      `}</style>
    </section>
  );
}
