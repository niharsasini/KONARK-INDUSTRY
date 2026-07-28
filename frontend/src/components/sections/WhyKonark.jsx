"use client";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const FEATURES = [
  {
    icon: "🔧",
    title: "Expert Technicians",
    desc: "Certified professionals visit your doorstep. No middlemen, no delays.",
  },
  {
    icon: "⚡",
    title: "Same-Day Service",
    desc: "Book before 2 PM, get service same day. Available across Bhubaneswar.",
  },
  {
    icon: "🏭",
    title: "Made in Odisha",
    desc: "Every product manufactured locally. ISI certified, factory-direct pricing.",
  },
  {
    icon: "💰",
    title: "Best Prices Guaranteed",
    desc: "Direct from factory to you. No markup, no hidden charges.",
  },
];

const STATS_FALLBACK = [
  { key: "stats_customers", label: "Happy Customers", fallback: "25,000+" },
  { key: "stats_cities", label: "Cities Covered", fallback: "18+" },
  { key: "stats_rating", label: "Average Rating", fallback: "4.8★" },
  { key: null, label: "Years in Odisha", fallback: "10+" },
];

function FeatureCard({ feature, index, isVisible }) {
  const [hovered, setHovered] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setIconHovered(false); }}
        style={{
          background: "#162952",
          border: `1px solid ${hovered ? "rgba(79,195,247,0.15)" : "rgba(79,195,247,0.06)"}`,
          borderRadius: 20,
          padding: "28px 24px",
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          transition: "all 0.3s ease",
          cursor: "default",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "var(--neu-hover)" : "var(--neu-shadow)",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
          style={{
            width: 52,
            height: 52,
            flexShrink: 0,
            background: iconHovered
              ? "linear-gradient(135deg, #0D518C, #4FC3F7)"
              : "linear-gradient(135deg, rgba(13,81,140,0.25), rgba(92,103,149,0.15))",
            border: "1px solid rgba(13,81,140,0.3)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            transition: "all 0.3s ease",
            transform: iconHovered ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
          }}
        >
          {feature.icon}
        </div>
        <div>
          <div style={{ color: "#E8F4FF", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
            {feature.title}
          </div>
          <p style={{ color: "#4A5880", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            {feature.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WhyKonark() {
  const settings = useSiteSettings();
  const STATS = STATS_FALLBACK.map((s) => ({
    value: s.key ? (settings?.[s.key] || s.fallback) : s.fallback,
    label: s.label,
  }));
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="why-section" style={{ padding: "64px 0" }}>
      <div ref={ref} style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.6s ease",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(13,81,140,0.2)",
              border: "1px solid rgba(79,195,247,0.25)",
              color: "#4FC3F7",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              padding: "5px 16px",
              borderRadius: 20,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            WHY CHOOSE US
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              color: "#E8F4FF",
              margin: "0 0 12px",
            }}
          >
            Built Different. Built for <span style={{ color: "#F4C430" }}>Odisha.</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#4A5880",
              maxWidth: 480,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            From doorstep service to factory-direct pricing — every promise we make, we keep.
          </p>
        </div>

        {/* Features 2×2 grid */}
        <div
          className="why-features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} isVisible={isVisible} />
          ))}
        </div>

        {/* Stats row */}
        <div
          className="why-stats-row"
          style={{
            display: "flex",
            borderTop: "1px solid rgba(92,103,149,0.08)",
            marginTop: 40,
            paddingTop: 40,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.4s",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "0 20px",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(92,103,149,0.08)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  color: "#F4C430",
                  display: "block",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#5C6795",
                  marginTop: 6,
                  display: "block",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-features-grid { grid-template-columns: 1fr !important; }
          .why-stats-row { flex-wrap: wrap !important; }
          .why-stats-row > div {
            flex: 0 0 50% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(92,103,149,0.08);
            padding: 16px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
