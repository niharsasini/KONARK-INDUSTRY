"use client";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const FEATURES = [
  {
    icon: "🔧",
    title: "Expert Technicians",
    desc: "ISI-certified professionals trained for EV and home appliances. Background verified. Always on time.",
    accent: "#4FC3F7",
  },
  {
    icon: "⚡",
    title: "Same-Day Service",
    desc: "Book before 2 PM, get service the same day. Available 7 days across Bhubaneswar and nearby.",
    accent: "#F4C430",
  },
  {
    icon: "🏭",
    title: "Made in Odisha",
    desc: "Every product manufactured locally in Bhubaneswar. ISI certified. Factory-direct pricing.",
    accent: "#34C78A",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    desc: "Direct from factory to you. No middlemen, no markups. We match any lower quote, guaranteed.",
    accent: "#FF7043",
  },
];

const STATS_FALLBACK = [
  { key: "stats_customers", label: "Happy Customers", fallback: "25,000+", gradient: "linear-gradient(135deg, #4FC3F7, #0EA5E9)" },
  { key: "stats_cities", label: "Cities Covered", fallback: "18+", gradient: "linear-gradient(135deg, #F4C430, #FF8F00)" },
  { key: "stats_rating", label: "Average Rating", fallback: "4.8★", gradient: "linear-gradient(135deg, #34C78A, #059669)" },
  { key: null, label: "Years in Odisha", fallback: "10+", gradient: "linear-gradient(135deg, #FF7043, #DC2626)" },
];

function parseStatValue(raw) {
  const str = String(raw).replace(/,/g, "");
  const match = str.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, suffix: str, decimal: false };
  return { num: parseFloat(match[1]), suffix: match[2], decimal: match[1].includes(".") };
}

function StatNumber({ value, gradient, active }) {
  const ref = useRef(null);
  const { num, suffix, decimal } = parseStatValue(value);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const start = Date.now();
    const duration = 2500;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      el.textContent = (decimal ? current.toFixed(1) : Math.floor(current).toLocaleString("en-IN")) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, num, suffix, decimal]);

  return (
    <span
      ref={ref}
      style={{
        fontSize: 42,
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: "-1px",
        marginBottom: 6,
        display: "block",
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      className="why-stat-number"
    >
      {decimal ? "0.0" : "0"}
      {suffix}
    </span>
  );
}

function FeatureCard({ feature, index, isVisible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#132040",
        borderRadius: 24,
        border: `1px solid ${hovered ? "rgba(79,195,247,0.12)" : "rgba(255,255,255,0.04)"}`,
        padding: "32px 26px",
        position: "relative",
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? (hovered ? "translateY(-6px)" : "translateY(0)") : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease`,
        boxShadow: hovered
          ? "10px 10px 26px #0A1628, -8px -8px 20px #1C3058, inset 0 1px 0 rgba(255,255,255,0.06)"
          : "8px 8px 20px #0A1628, -6px -6px 16px #1C3058, inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
        }}
      />

      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "#0F1A2E",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "inset 4px 4px 10px #0A1628, inset -3px -3px 8px #1C3058",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          marginBottom: 20,
        }}
      >
        <span style={{ filter: `drop-shadow(0 0 8px ${feature.accent}66)` }}>{feature.icon}</span>
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#E8F4FF", letterSpacing: "-0.2px", margin: "0 0 10px" }}>
        {feature.title}
      </h3>
      <p style={{ fontSize: 13, color: "rgba(232,244,255,0.55)", lineHeight: 1.7, margin: 0 }}>
        {feature.desc}
      </p>
    </div>
  );
}

export default function WhyKonark() {
  const settings = useSiteSettings();
  const STATS = STATS_FALLBACK.map((s) => ({
    value: s.key ? settings?.[s.key] || s.fallback : s.fallback,
    label: s.label,
    gradient: s.gradient,
  }));
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="why-section">
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,81,140,0.15) 0%, transparent 65%)",
          top: -150,
          right: -150,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%)",
          bottom: -100,
          left: -100,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div ref={ref} style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 52,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(13,81,140,0.2)",
              border: "1px solid rgba(79,195,247,0.25)",
              color: "#4FC3F7",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "2px",
              padding: "5px 16px",
              borderRadius: 999,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            WHY CHOOSE US
          </span>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "-1px",
              lineHeight: 1.1,
              margin: "0 0 16px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#E8F4FF" }}>Built Different.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #4FC3F7, #F4C430)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built for Odisha.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(232,244,255,0.55)",
              maxWidth: 480,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            More than 10 years. 25,000+ customers. One promise — we show up, we fix it, we make it right.
          </p>
        </div>

        {/* Feature cards */}
        <div className="why-features-grid">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} isVisible={isVisible} />
          ))}
        </div>

        {/* Stats row - dark neumorphic inset */}
        <div
          style={{
            background: "#0F1A2E",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.03)",
            boxShadow: "inset 5px 5px 14px #0A1628, inset -4px -4px 12px #1C3058",
            padding: "32px 40px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.3s",
          }}
        >
          <div className="why-stats-grid">
            {STATS.map((stat, i) => (
              <div key={stat.label} style={{ textAlign: "center", padding: "0 24px", position: "relative" }}>
                {i < STATS.length - 1 && (
                  <div
                    className="why-stat-divider"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 1,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                )}
                <StatNumber value={stat.value} gradient={stat.gradient} active={isVisible} />
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(232,244,255,0.45)",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
