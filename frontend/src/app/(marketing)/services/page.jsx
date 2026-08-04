"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const SERVICES = [
  {
    name: "AC Repair & Service",
    description: "All brands repaired at your doorstep. Installation, gas refilling, deep cleaning.",
    icon: "❄️",
    accent: "#0EA5E9",
    accentDark: "#0284C7",
    category: "Home & EV",
    startingFrom: "₹299",
    href: "/services/enquiry?service=ac-repair",
    external: false,
  },
  {
    name: "EV Charging Station Install",
    description: "Home and commercial EV charger installation. 3.3kW to 22kW. Certified electricians.",
    icon: "⚡",
    accent: "#F59E0B",
    accentDark: "#D97706",
    category: "Home & EV",
    startingFrom: "Free Quote",
    href: "https://www.soumyashipower.in/",
    external: true,
  },
  {
    name: "Battery Swap Service",
    description: "Same-day battery swap for your EV. Home pickup. LFP batteries with warranty.",
    icon: "🔋",
    accent: "#10B981",
    accentDark: "#059669",
    category: "Home & EV",
    startingFrom: "₹150",
    href: "/battery-swap",
    external: false,
  },
  {
    name: "Home Electrical Services",
    description: "Complete home wiring, PCB repair, inverter installation, electrical fault fixing.",
    icon: "🔌",
    accent: "#EC4899",
    accentDark: "#DB2777",
    category: "Home & EV",
    startingFrom: "₹199",
    href: "/services/enquiry?service=electrical",
    external: false,
  },
  {
    name: "Solar Power Plant",
    description: "Rooftop solar from 1kW to 1MW. Grid-tied and off-grid systems, 25-year panel warranty.",
    icon: "☀️",
    accent: "#F97316",
    accentDark: "#EA580C",
    category: "Energy & Power",
    startingFrom: "Free Quote",
    href: "https://www.soumyashipower.in/",
    external: true,
  },
  {
    name: "Wind Power Plant",
    description: "Hybrid wind-solar systems for commercial and industrial use. Custom design and installation.",
    icon: "🌀",
    accent: "#6366F1",
    accentDark: "#4F46E5",
    category: "Energy & Power",
    startingFrom: "Free Quote",
    href: "https://www.soumyashipower.in/",
    external: true,
  },
  {
    name: "Cold Storage Setup",
    description: "Commercial cold storage units, installation and maintenance for agriculture and food.",
    icon: "🧊",
    accent: "#06B6D4",
    accentDark: "#0891B2",
    category: "Energy & Power",
    startingFrom: "Free Quote",
    href: "/services/enquiry?service=cold-storage",
    external: false,
  },
  {
    name: "PCB Repair & Testing",
    description: "Circuit board repair for EVs, inverters, appliances. Component-level diagnosis and repair.",
    icon: "🔬",
    accent: "#8B5CF6",
    accentDark: "#7C3AED",
    category: "Home & EV",
    startingFrom: "Free Quote",
    href: "/services/enquiry?service=pcb-repair",
    external: false,
  },
];

const CATEGORIES = ["All", "Home & EV", "Energy & Power"];

const STEPS = [
  { icon: "📱", title: "Choose Service", desc: "Select from our full list of home, EV and energy services." },
  { icon: "📅", title: "Pick Time", desc: "Choose the date and time slot that works best for you." },
  { icon: "✅", title: "Confirm Booking", desc: "We call to confirm. Pay online or pay on service." },
  { icon: "🚀", title: "We Arrive", desc: "Our certified technician is at your door, on time." },
];

const WHY_FEATURES = [
  { icon: "🔧", title: "Certified Techs", desc: "Background-verified, trained professionals for every job.", accent: "#4FC3F7" },
  { icon: "⚡", title: "2-Hr Response", desc: "We call back within 2 hours of every service enquiry.", accent: "#F4C430" },
  { icon: "🛡️", title: "Service Warranty", desc: "Every repair and install is backed by a service warranty.", accent: "#34C78A" },
  { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges. You know the cost before we start.", accent: "#FF7043" },
];

function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false);
  const isInternal = !service.external;

  return (
    <div
      className="service-card-item svc-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 24,
        boxShadow: hovered
          ? "12px 12px 32px rgba(13,81,140,0.13), -8px -8px 24px rgba(255,255,255,1)"
          : "8px 8px 22px rgba(13,81,140,0.09), -6px -6px 18px rgba(255,255,255,0.95)",
        border: "1px solid rgba(13,81,140,0.04)",
        overflow: "hidden",
        transition: "all 0.35s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(135deg, ${service.accent}, ${service.accentDark})` }} />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              width: 54,
              height: 54,
              background: "#F5F7FF",
              boxShadow: "inset 4px 4px 10px rgba(13,81,140,0.08), inset -3px -3px 8px rgba(255,255,255,0.9)",
              borderRadius: 16,
              fontSize: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {service.icon}
          </div>
          <span
            style={{
              background: `${service.accent}18`,
              color: service.accentDark,
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "4px 10px",
              borderRadius: 999,
            }}
          >
            {service.category}
          </span>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0C1A2E", margin: "14px 0 8px", letterSpacing: "-0.2px" }}>
          {service.name}
        </h3>
        <p style={{ fontSize: 13, color: "#4A6785", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
          {service.description}
        </p>

        {service.external && (
          <span style={{ fontSize: 10, color: "#8BA8C4", fontWeight: 600, marginBottom: 10, display: "block" }}>
            ↗ Partner Service — soumyashipower.in
          </span>
        )}

        <div>
          <p style={{ fontSize: 11, color: "#8BA8C4", margin: "0 0 2px" }}>Starting from</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: service.accentDark, margin: 0 }}>{service.startingFrom}</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 14,
            marginTop: 14,
            borderTop: "1px solid rgba(13,81,140,0.06)",
          }}
        >
          {isInternal ? (
            <Link
              href={service.href}
              className="svc-book-link"
              style={{ color: service.accentDark, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
            >
              Book Now <span className="svc-arrow">→</span>
            </Link>
          ) : (
            <a
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              className="svc-book-link"
              style={{ color: service.accentDark, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
            >
              Get Quote <span className="svc-arrow">→</span>
            </a>
          )}

          {isInternal ? (
            <Link
              href={service.href}
              style={{
                width: 36, height: 36, background: service.accent, borderRadius: 10, color: "white",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                boxShadow: `0 4px 12px ${service.accent}40`, transition: "transform 0.2s ease",
                transform: hovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              →
            </Link>
          ) : (
            <a
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36, height: 36, background: service.accent, borderRadius: 10, color: "white",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                boxShadow: `0 4px 12px ${service.accent}40`, transition: "transform 0.2s ease",
                transform: hovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const settings = useSiteSettings();
  const phone = settings?.company_phone || "+91 94376 11129";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? SERVICES : SERVICES.filter((s) => s.category === activeCategory);

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".svc-hero-tag", { y: 24, opacity: 0, duration: 0.6 });
      await animateIn(".svc-hero-title", { y: 32, opacity: 0, duration: 0.7, delay: 0.1 });
      await animateIn(".svc-hero-sub", { y: 24, opacity: 0, duration: 0.6, delay: 0.2 });
      await animateIn(".svc-hero-pill", { y: 16, opacity: 0, stagger: 0.1, duration: 0.5, delay: 0.3 });
      await animateIn(".svc-hero-phone", { y: 24, opacity: 0, duration: 0.6, delay: 0.4 });
      await animateIn(".svc-step-card", { y: 40, opacity: 0, stagger: 0.1, duration: 0.6, start: "top 82%" });
      await animateIn(".svc-card", { y: 48, opacity: 0, scale: 0.96, stagger: 0.06, duration: 0.6, start: "top 85%" });
      await animateIn(".svc-why-card", { y: 32, opacity: 0, stagger: 0.1, duration: 0.6, start: "top 85%" });
      await animateIn(".svc-cta-content", { y: 32, opacity: 0, duration: 0.7, start: "top 88%" });
    };
    run();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* SECTION 1 — HERO */}
      <div
        style={{
          background: "linear-gradient(135deg, #0B1729 0%, #0F1E35 40%, #132040 70%, #0B1729 100%)",
          padding: "calc(68px + var(--banner-h,0px) + 60px) 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,195,247,0.15) 0%, transparent 65%)", top: -200, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px", pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <span
            className="svc-hero-tag"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 16px", borderRadius: 999,
              background: "rgba(13,81,140,0.2)", border: "1px solid rgba(79,195,247,0.25)", color: "#4FC3F7",
              fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 20,
            }}
          >
            Our Services
          </span>

          <h1 className="svc-hero-title" style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, color: "#E8F4FF", letterSpacing: "-2px", lineHeight: 1.1, margin: "0 0 16px" }}>
            We Come To You.
          </h1>

          <p className="svc-hero-sub" style={{ color: "rgba(232,244,255,0.55)", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Book any service online. Our certified technicians reach your doorstep — usually the same day you call.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            {["⚡ Same Day Service", "🔧 Certified Technicians", "💰 Best Price Guarantee"].map((pill) => (
              <span
                key={pill}
                className="svc-hero-pill"
                style={{
                  background: "#132040", boxShadow: "4px 4px 10px #0A1628, -3px -3px 8px #1C3058",
                  border: "1px solid rgba(255,255,255,0.05)", borderRadius: 999, padding: "8px 18px",
                  color: "rgba(232,244,255,0.7)", fontSize: 13, fontWeight: 500,
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          <div
            className="svc-hero-phone"
            style={{
              background: "rgba(19,32,64,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(79,195,247,0.1)", borderRadius: 20, padding: "20px 32px",
              display: "inline-flex", gap: 24, alignItems: "center", marginTop: 40, flexWrap: "wrap", justifyContent: "center",
            }}
          >
            <a href={phoneHref} style={{ color: "#4FC3F7", fontSize: 20, fontWeight: 800, textDecoration: "none" }}>
              📞 {phone}
            </a>
            <span style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(232,244,255,0.4)", fontSize: 13 }}>Mon–Sat · 8AM–8PM IST</span>
          </div>
        </div>
      </div>

      {/* SECTION 2 — HOW IT WORKS */}
      <section style={{ background: "#F5F7FF", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="section-tag" style={{ marginBottom: 16 }}>How It Works</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, margin: "16px 0 0", letterSpacing: "-1px" }}>
              <span style={{ color: "#0C1A2E" }}>Book in </span>
              <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="svc-steps-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="svc-step-card"
                style={{
                  background: "#FFFFFF", borderRadius: 20,
                  boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)",
                  padding: "28px 24px", textAlign: "center", position: "relative",
                }}
              >
                {i < STEPS.length - 1 && (
                  <div
                    className="svc-step-line"
                    style={{
                      position: "absolute", top: 42, right: "-50%", width: "100%", height: 2,
                      background: "linear-gradient(90deg, #0D518C, rgba(13,81,140,0.1))", zIndex: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    position: "relative", zIndex: 1, width: 52, height: 52,
                    background: "linear-gradient(135deg, #0D518C, #0EA5E9)", borderRadius: "50%",
                    color: "white", fontSize: 20, fontWeight: 900, margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 6px 16px rgba(13,81,140,0.3)",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{step.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0C1A2E", margin: "0 0 8px" }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#4A6785", lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — ALL SERVICES */}
      <section style={{ background: "#EEF2FF", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: "#0C1A2E", margin: "0 0 24px", letterSpacing: "-1px" }}>
              All Services
            </h2>
            <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "10px 22px", borderRadius: 999, border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                      background: active ? "linear-gradient(135deg, #0D518C, #0A3D6B)" : "#FFFFFF",
                      color: active ? "#FFFFFF" : "#0C1A2E",
                      boxShadow: active
                        ? "0 6px 16px rgba(13,81,140,0.3)"
                        : "4px 4px 10px rgba(13,81,140,0.08), -3px -3px 8px rgba(255,255,255,0.9)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="svc-cards-grid">
            {filtered.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY BOOK WITH US */}
      <section style={{ background: "#0B1729", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ display: "inline-block", background: "rgba(13,81,140,0.2)", border: "1px solid rgba(79,195,247,0.25)", color: "#4FC3F7", fontSize: 10, fontWeight: 700, letterSpacing: "2px", padding: "5px 16px", borderRadius: 999, marginBottom: 16, textTransform: "uppercase" }}>
              Why Book With Us
            </span>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 900, color: "#E8F4FF", margin: 0, letterSpacing: "-1px" }}>
              Service You Can Trust
            </h2>
          </div>

          <div className="svc-why-grid">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="svc-why-card"
                style={{
                  background: "#132040", borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)",
                  padding: "26px 22px", boxShadow: "8px 8px 20px #0A1628, -6px -6px 16px #1C3058",
                }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 14, background: "#0F1A2E",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "inset 4px 4px 10px #0A1628, inset -3px -3px 8px #1C3058",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16,
                  }}
                >
                  <span style={{ filter: `drop-shadow(0 0 8px ${f.accent}66)` }}>{f.icon}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#E8F4FF", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(232,244,255,0.55)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", padding: "64px 24px", textAlign: "center" }}>
        <div className="svc-cta-content" style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "clamp(28px,4vw,36px)", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Ready for doorstep service?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, margin: "0 0 32px", lineHeight: 1.6 }}>
            Book now and our technician will be at your door — usually within 2 hours.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/services/enquiry"
              className="clay-btn"
              style={{ background: "#FFFFFF", color: "#0D518C", padding: "16px 32px", fontSize: 15, fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Book a Service →
            </Link>
            <a
              href={phoneHref}
              style={{
                padding: "16px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.5)",
                color: "#FFFFFF", fontSize: 15, fontWeight: 700, textDecoration: "none", background: "transparent",
              }}
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .svc-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .svc-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .svc-why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .svc-book-link .svc-arrow { transition: transform 0.2s ease; display: inline-block; }
        .svc-book-link:hover .svc-arrow { transform: translateX(3px); }

        @media (max-width: 1024px) {
          .svc-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .svc-steps-grid { grid-template-columns: repeat(2, 1fr); }
          .svc-step-line { display: none; }
          .svc-why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .svc-cards-grid { grid-template-columns: 1fr; }
          .svc-steps-grid { grid-template-columns: 1fr; }
          .svc-why-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
