"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SERVICES = [
  {
    id: 1,
    icon: "❄️",
    accent: "#0EA5E9",
    accentDark: "#0284C7",
    title: "AC Repair & Service",
    desc: "All brands repaired at your doorstep. AC installation, gas refilling, deep cleaning and maintenance.",
    cta: "Book Repair",
    href: "/services/enquiry",
    startingFrom: "₹299",
    external: false,
  },
  {
    id: 2,
    icon: "⚡",
    accent: "#F59E0B",
    accentDark: "#D97706",
    title: "EV Charging Station Install",
    desc: "Home and commercial EV charger installation, 3.3kW to 22kW options, certified installation with 1-year warranty.",
    cta: "Get Quote",
    href: "https://www.soumyashipower.in/",
    startingFrom: "Free Quote",
    external: true,
    partner: "Partner Service",
  },
  {
    id: 3,
    icon: "🔋",
    accent: "#10B981",
    accentDark: "#059669",
    title: "Battery Swap Service",
    desc: "Same-day battery swap for your EV. Home pickup available. Get a swap token instantly, LFP batteries only.",
    cta: "Book a Swap",
    href: "/battery-swap",
    startingFrom: "₹150",
    external: false,
  },
  {
    id: 4,
    icon: "☀️",
    accent: "#F97316",
    accentDark: "#EA580C",
    title: "Solar Power Plant",
    desc: "Residential and commercial solar power plants. Rooftop, ground-mount, and captive solar up to 1MW.",
    cta: "Get Solar Quote",
    href: "https://www.soumyashipower.in/",
    startingFrom: "Free Quote",
    external: true,
    partner: "Partner Service",
  },
  {
    id: 5,
    icon: "🌀",
    accent: "#6366F1",
    accentDark: "#4F46E5",
    title: "Wind Power Plant",
    desc: "Hybrid wind-solar systems for farms, industries and institutions. Custom design and installation.",
    cta: "Explore Wind Energy",
    href: "https://www.soumyashipower.in/",
    startingFrom: "Free Quote",
    external: true,
    partner: "Partner Service",
  },
  {
    id: 6,
    icon: "🔌",
    accent: "#EC4899",
    accentDark: "#DB2777",
    title: "Home Electrical Services",
    desc: "Complete home wiring, PCB repair, inverter installation and all electrical fault fixing.",
    cta: "Book Service",
    href: "/services/enquiry",
    startingFrom: "₹199",
    external: false,
  },
];

function ServiceCTA({ service, style }) {
  const router = useRouter();
  return service.external ? (
    <a
      href={service.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={style}
    >
      {service.cta} →
    </a>
  ) : (
    <button
      onClick={(e) => { e.stopPropagation(); router.push(service.href); }}
      style={{ ...style, border: `1px solid rgba(255,255,255,0.3)`, fontFamily: "inherit", cursor: "pointer" }}
    >
      {service.cta} →
    </button>
  );
}

function FlipCard({ service, index, inView }) {
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // MOBILE: tap-to-expand accordion — sidesteps the 3D-flip's touch/hover
  // state conflicts and cross-browser backface-visibility hit-testing quirks.
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)",
          border: "1px solid rgba(13,81,140,0.04)",
          borderTop: `4px solid ${service.accent}`,
        }}
      >
        <div
          onClick={() => setFlipped((f) => !f)}
          style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
        >
          <div
            style={{
              width: 48, height: 48, background: `${service.accent}18`, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
              boxShadow: `3px 3px 8px ${service.accent}20, -2px -2px 6px rgba(255,255,255,0.9)`,
            }}
          >
            {service.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {service.partner && (
              <span style={{ fontSize: 10, color: "#8BA8C4", fontWeight: 600, display: "block", marginBottom: 2 }}>
                ↗ {service.partner}
              </span>
            )}
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0C1A2E", lineHeight: 1.3 }}>{service.title}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: service.accent, marginTop: 2 }}>From {service.startingFrom}</div>
          </div>
          <div style={{ fontSize: 16, color: service.accent, transform: flipped ? "rotate(180deg)" : "none", transition: "transform 0.3s ease", flexShrink: 0 }}>
            ↓
          </div>
        </div>

        <div style={{ maxHeight: flipped ? 300 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
          <div style={{ padding: "0 18px 18px", borderTop: "1px solid rgba(13,81,140,0.06)" }}>
            <p style={{ fontSize: 13, color: "#4A6785", lineHeight: 1.65, margin: "14px 0 16px" }}>
              {service.desc}
            </p>
            <ServiceCTA
              service={service}
              style={{
                background: `linear-gradient(135deg, ${service.accentDark}, ${service.accent})`,
                color: "white",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // DESKTOP: 3D flip, hover to preview / click to pin open.
  return (
    <motion.div
      className="flip-card"
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="flip-card-inner"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* FRONT */}
        <div
          className="flip-card-front"
          style={{
            background: "#FFFFFF",
            borderTop: `4px solid ${service.accent}`,
            boxShadow: "8px 8px 20px rgba(13,81,140,0.08), -6px -6px 16px rgba(255,255,255,0.95), 0 0 0 1px rgba(13,81,140,0.04)",
            padding: 22,
            display: "flex",
            flexDirection: "column",
            pointerEvents: flipped ? "none" : "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div
              style={{
                width: 50,
                height: 50,
                background: `${service.accent}18`,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                boxShadow: `3px 3px 8px ${service.accent}20, -2px -2px 6px rgba(255,255,255,0.9)`,
              }}
            >
              {service.icon}
            </div>
            <span style={{ fontSize: 10, color: "#8BA8C4", fontWeight: 500, letterSpacing: "0.3px" }}>
              hover →
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            {service.partner && (
              <span style={{ fontSize: 10, color: "#8BA8C4", fontWeight: 600, display: "block", marginBottom: 4 }}>
                ↗ {service.partner}
              </span>
            )}
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0C1A2E", lineHeight: 1.25, marginBottom: 10, letterSpacing: "-0.2px" }}>
              {service.title}
            </h3>
            <span style={{ color: service.accent, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              {service.cta} →
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="flip-card-back"
          style={{
            background: `linear-gradient(145deg, ${service.accentDark}, ${service.accent})`,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{service.icon}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Service Details
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.65, margin: 0 }}>
              {service.desc}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", margin: "0 0 2px", letterSpacing: "0.5px" }}>
                STARTING FROM
              </p>
              <p style={{ fontSize: 18, fontWeight: 900, color: "white", margin: 0, letterSpacing: "-0.3px" }}>
                {service.startingFrom}
              </p>
            </div>

            <ServiceCTA service={service} style={backCtaStyle} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const backCtaStyle = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "white",
  padding: "9px 18px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
};

export default function ServicesPreview() {
  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.05, triggerOnce: true });
  const router = useRouter();

  return (
    <section id="services" className="services-section">
      <div
        className="services-section-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: 60,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -40 }}
          animate={leftIn ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="section-tag" style={{ marginBottom: 20, display: "inline-flex" }}>
            OUR SERVICES
          </span>

          <h2 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, color: "#0C1A2E", lineHeight: 1.1, letterSpacing: "-1px", margin: "16px 0 16px" }}>
            We Come<br />
            <span className="gradient-text">To You.</span>
          </h2>

          <p style={{ fontSize: 15, color: "#4A6785", lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
            Something broken? Our certified technicians reach your home across Odisha — usually the same day you call.
          </p>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#0D518C", lineHeight: 1, letterSpacing: "-2px" }}>
              2 hrs
            </div>
            <div style={{ fontSize: 11, color: "#8BA8C4", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>
              Average Response Time
            </div>
          </div>

          <a
            href="tel:+919437611129"
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              boxShadow: "var(--neu-shadow)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              maxWidth: 280,
              textDecoration: "none",
            }}
          >
            <div style={{ width: 44, height: 44, background: "rgba(220,38,38,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              📞
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#8BA8C4", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3 }}>
                Call Now
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0D518C", letterSpacing: "-0.3px" }}>
                +91 94376 11129
              </span>
            </div>
          </a>
        </motion.div>

        {/* RIGHT */}
        <div ref={rightRef} className="services-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {SERVICES.map((service, i) => (
            <FlipCard key={service.id} service={service} index={i} inView={rightIn} />
          ))}
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 48px" }}>
        <div style={{ background: "#FFFFFF", boxShadow: "var(--neu-shadow)", borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 15, color: "var(--text-muted)", margin: 0 }}>Need something not listed? Tell us what&apos;s wrong.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/services/enquiry")}
              className="clay-btn clay-btn-primary"
              style={{ padding: "10px 22px", fontSize: 14, minHeight: 44 }}
            >
              Send Enquiry →
            </button>
            <Link
              href="/services"
              style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", fontWeight: 600 }}
            >
              View all services →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
