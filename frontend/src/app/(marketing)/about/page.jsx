"use client";

import { useEffect } from "react";
import Link from "next/link";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import FAQSection from "@/components/sections/FAQSection";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TIMELINE = [
  { year: "2014", title: "Founded", desc: "Started in Bhubaneswar with 12 employees and a single product line." },
  { year: "2016", title: "LFP Battery Systems", desc: "Became one of Odisha's first LFP battery manufacturers." },
  { year: "2018", title: "5,000 Customers", desc: "Crossed 5,000 customers and expanded to pan-India delivery." },
  { year: "2020", title: "Entered the EV Space", desc: "Launched the Konark X1 electric scooter." },
  { year: "2022", title: "Second Factory", desc: "Opened our second manufacturing facility and launched the BLDC appliance line." },
  { year: "2024", title: "25,000+ Customers", desc: "Reached 25,000+ customers across 18+ cities in Odisha and beyond." },
  { year: "2025", title: "EV Cars Coming", desc: "Unveiled the Konark EV Car X1 — our upcoming 5-seater electric sedan." },
];

const CATEGORIES = [
  {
    title: "EV Vehicles",
    icon: "🏍️",
    gradient: "linear-gradient(135deg, #0D518C, #0EA5E9)",
    items: [
      { name: "Electric Scooter", price: "₹27,000" },
      { name: "Electric Bike", price: "₹32,000" },
      { name: "Electric Motor Cycle", price: "₹45,000" },
      { name: "Utility Vehicle", price: "₹55,000" },
      { name: "E-Rickshaw", price: "₹85,000" },
    ],
    cta: "Shop EV Vehicles →",
  },
  {
    title: "Home Appliances",
    icon: "🏠",
    gradient: "linear-gradient(135deg, #D97706, #F59E0B)",
    items: [
      { name: "Induction Cooker", price: "₹1,650" },
      { name: "BLDC Fan", price: "₹2,200" },
      { name: "Water Purifier", price: "₹4,800" },
      { name: "BLDC Motor", price: "₹6,500" },
      { name: "Air Conditioner", price: "₹26,000" },
    ],
    cta: "Shop Appliances →",
  },
  {
    title: "Energy & Power",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #059669, #10B981)",
    items: [
      { name: "Solar Inverter", price: "₹8,500" },
      { name: "LFP Battery", price: "₹14,000" },
      { name: "Hybrid Cold Storage", price: "₹250/sq.ft" },
      { name: "Solar Power Plant Install", price: "Free Quote" },
      { name: "EV Charging Station Install", price: "Free Quote" },
    ],
    cta: "Explore Energy →",
  },
];

const VALUES = [
  { icon: "🌱", title: "Sustainability", desc: "Every product designed for a greener Odisha.", accent: "#34C78A" },
  { icon: "🤝", title: "Trust", desc: "Honest pricing, quality products, no compromises.", accent: "#4FC3F7" },
  { icon: "⚡", title: "Innovation", desc: "Always pushing boundaries in EV and clean energy.", accent: "#F4C430" },
  { icon: "❤️", title: "Community", desc: "Built for Odisha, by people who live here.", accent: "#FF7043" },
];

export default function AboutPage() {
  const settings = useSiteSettings();
  const customers = settings?.stats_customers || "25,000+";
  const cities = settings?.stats_cities || "18+";
  const rating = settings?.stats_rating || "4.8★";

  const STATS = [
    { icon: "📅", value: "2014", label: "Founded" },
    { icon: "👥", value: customers, label: "Customers" },
    { icon: "🏙️", value: cities, label: "Cities" },
    { icon: "⭐", value: rating, label: "Rating" },
  ];

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".abt-hero-tag", { y: 20, opacity: 0, duration: 0.6 });
      await animateIn(".abt-hero-title", { y: 32, opacity: 0, duration: 0.7, delay: 0.1 });
      await animateIn(".abt-hero-sub", { y: 24, opacity: 0, duration: 0.6, delay: 0.2 });
      await animateIn(".abt-stat-pill", { y: 16, scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.5, delay: 0.3 });
      await animateIn(".abt-story-text", { y: 32, opacity: 0, duration: 0.7, start: "top 82%" });
      await animateIn(".abt-timeline-item", { x: 24, opacity: 0, stagger: 0.15, duration: 0.5, start: "top 85%" });
      await animateIn(".abt-cat-card", { y: 48, opacity: 0, scale: 0.96, stagger: 0.1, duration: 0.6, start: "top 85%" });
      await animateIn(".abt-value-card", { y: 32, opacity: 0, stagger: 0.08, duration: 0.55, start: "top 85%" });
      await animateIn(".abt-cta-content", { y: 32, opacity: 0, duration: 0.7, start: "top 88%" });
    };
    run();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* SECTION 1 — HERO (LIGHT) */}
      <div
        style={{
          background: "linear-gradient(160deg, #EEF2FF 0%, #F0F5FF 30%, #F5F7FF 60%, #EEF4FF 100%)",
          paddingTop: "calc(68px + var(--banner-h,0px) + 60px)",
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,81,140,0.07) 0%, transparent 65%)", top: -100, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)", bottom: -80, left: -80, pointerEvents: "none" }} />
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(13,81,140,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px", pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <span
            className="abt-hero-tag"
            style={{
              display: "inline-block", background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.2)",
              color: "#0D518C", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
              padding: "5px 16px", borderRadius: 999, marginBottom: 20,
            }}
          >
            About Us
          </span>

          <h1 className="abt-hero-title" style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 20px", textAlign: "center" }}>
            <span style={{ color: "#0C1A2E" }}>Powering Odisha</span>
            <br />
            <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Since 2014.
            </span>
          </h1>

          <p className="abt-hero-sub" style={{ color: "#4A6785", fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px", textAlign: "center" }}>
            From a small workshop in Bhubaneswar to Odisha's most trusted EV and electronics brand. Here's our story.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                className="abt-stat-pill"
                style={{
                  background: "#FFFFFF", borderRadius: 999,
                  boxShadow: "5px 5px 12px rgba(13,81,140,0.09), -4px -4px 10px rgba(255,255,255,0.95)",
                  border: "1px solid rgba(13,81,140,0.06)", padding: "12px 24px",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#0C1A2E", margin: 0, lineHeight: 1.2 }}>
                    <AnimatedCounter target={s.value} />
                  </p>
                  <p style={{ fontSize: 12, color: "#8BA8C4", fontWeight: 500, margin: 0 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2 — OUR STORY */}
      <section style={{ background: "#F5F7FF", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="abt-story-grid">
          <div className="abt-story-text">
            <span className="section-tag" style={{ marginBottom: 16, display: "inline-flex" }}>Our Story</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-1px", margin: "16px 0 24px" }}>
              <span style={{ color: "#0C1A2E" }}>Built in Bhubaneswar.</span>
              <br />
              <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Made for Odisha.
              </span>
            </h2>

            <p style={{ color: "#4A6785", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              Konark Industry was founded in 2014 in a small workshop in Bhubaneswar with a simple mission: bring affordable, reliable electric vehicles and electronics to the people of Odisha. We started with just 12 people and a single product line.
            </p>
            <p style={{ color: "#4A6785", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              Today we manufacture electric scooters, e-rickshaws, BLDC fans, LFP batteries and more — all under one roof in Bhubaneswar. Every product is quality-tested and ISI certified before it leaves our facility.
            </p>
            <p style={{ color: "#4A6785", fontSize: 15, lineHeight: 1.8 }}>
              We also offer doorstep service across {cities} cities. Whether you need your AC fixed or a solar plant installed, our certified technicians come to you — usually the same day.
            </p>
          </div>

          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, #0D518C, #0EA5E9, rgba(14,165,233,0.1))" }} />
            {TIMELINE.map((item) => (
              <div key={item.year} className="abt-timeline-item" style={{ position: "relative", paddingBottom: 32, paddingLeft: 20 }}>
                <div style={{ position: "absolute", left: -27, top: 4, width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg, #0D518C, #0EA5E9)", boxShadow: "0 0 0 3px rgba(13,81,140,0.15)" }} />
                <span style={{ background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.2)", color: "#0D518C", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "inline-block", marginBottom: 6 }}>
                  {item.year}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0C1A2E", margin: "0 0 4px" }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#4A6785", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT WE DO */}
      <section style={{ background: "#EEF2FF", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-tag" style={{ marginBottom: 16 }}>What We Do</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-1px", margin: "16px 0 0" }}>
              <span style={{ color: "#0C1A2E" }}>One Company. </span>
              <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Every Power Need.
              </span>
            </h2>
          </div>

          <div className="abt-cat-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="abt-cat-card"
                style={{
                  background: "#FFFFFF", borderRadius: 24,
                  boxShadow: "8px 8px 22px rgba(13,81,140,0.09), -6px -6px 18px rgba(255,255,255,0.95)",
                  overflow: "hidden", transition: "all 0.35s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "12px 12px 32px rgba(13,81,140,0.13), -8px -8px 24px rgba(255,255,255,1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "8px 8px 22px rgba(13,81,140,0.09), -6px -6px 18px rgba(255,255,255,0.95)"; }}
              >
                <div style={{ height: 120, background: cat.gradient, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "0 24px 16px" }}>
                  <span style={{ position: "absolute", fontSize: 80, right: -10, top: -10, opacity: 0.18, transform: "rotate(-12deg)" }}>{cat.icon}</span>
                  <h3 style={{ position: "relative", color: "#FFFFFF", fontSize: 20, fontWeight: 800, margin: 0 }}>{cat.title}</h3>
                </div>

                <div style={{ padding: "22px 24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {cat.items.map((item) => (
                      <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#0C1A2E" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8BA8C4", flexShrink: 0 }} />
                          {item.name}
                        </span>
                        <span style={{ color: "#4A6785", fontWeight: 600, flexShrink: 0 }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/products" style={{ fontSize: 13, fontWeight: 700, color: "#0D518C", textDecoration: "none" }}>
                    {cat.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — OUR VALUES */}
      <section style={{ background: "#F5F7FF", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-tag" style={{ marginBottom: 16 }}>Our Values</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#0C1A2E", margin: "16px 0 0", letterSpacing: "-1px" }}>
              What drives us every day.
            </h2>
          </div>

          <div className="abt-value-grid">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="abt-value-card"
                style={{
                  background: "#FFFFFF", borderRadius: 20, boxShadow: "var(--neu-shadow)",
                  padding: "28px 24px", position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }} />
                <div
                  style={{
                    width: 56, height: 56, background: "#F5F7FF",
                    boxShadow: "inset 4px 4px 10px rgba(13,81,140,0.08), inset -3px -3px 8px rgba(255,255,255,0.9)",
                    borderRadius: 16, fontSize: 26, margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0C1A2E", margin: "0 0 8px", textAlign: "center" }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: "#4A6785", lineHeight: 1.6, margin: 0, textAlign: "center" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* SECTION 6 — CTA */}
      <section style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", padding: "64px 24px", textAlign: "center" }}>
        <div className="abt-cta-content" style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "clamp(28px,4vw,36px)", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Ready to experience Konark?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, margin: "0 0 32px", lineHeight: 1.6 }}>
            Shop our full range of EVs and electronics, or book a doorstep service today.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/products"
              className="clay-btn"
              style={{ background: "#FFFFFF", color: "#0D518C", padding: "16px 32px", fontSize: 15, fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Shop Products →
            </Link>
            <Link
              href="/services/enquiry"
              style={{
                padding: "16px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.5)",
                color: "#FFFFFF", fontSize: 15, fontWeight: 700, textDecoration: "none", background: "transparent",
              }}
            >
              Book Service
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .abt-cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .abt-value-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .abt-story-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .abt-cat-grid { grid-template-columns: repeat(2, 1fr); }
          .abt-value-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .abt-cat-grid { grid-template-columns: 1fr; }
          .abt-value-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
