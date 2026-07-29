"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SERVICES = [
  {
    icon: "❄️", color: "#0D518C",
    title: "AC Repair & Service",
    desc: "Diagnose and fix all brands, same day if booked before noon.",
    link: "/services/enquiry", external: false, cta: "Book →",
  },
  {
    icon: "⚡", color: "#0D518C",
    title: "EV Charging Station Installation",
    desc: "Install commercial and home EV charging stations. Certified installation, 1-year warranty on all equipment.",
    link: "https://www.soumyashipower.in/", external: true, cta: "Learn More →",
    partner: "Partner Service",
  },
  {
    icon: "🔋", color: "#0EA5E9",
    title: "Battery Swap Service",
    desc: "Exchange your discharged EV battery for a fully charged one. Home pickup available. Get a swap token instantly.",
    link: "/battery-swap", external: false, cta: "Book a Swap →",
  },
  {
    icon: "☀️", color: "#D97706",
    title: "Solar Power Plant Installation",
    desc: "Residential and commercial solar power plants. Rooftop, ground-mount, and captive solar up to 1MW.",
    link: "https://www.soumyashipower.in/", external: true, cta: "Get Solar Quote →",
    partner: "Partner Service",
  },
  {
    icon: "💨", color: "#0D518C",
    title: "Wind Power Plant Installation",
    desc: "Small and large-scale wind energy solutions. Hybrid wind-solar systems for farms, industries, and institutions.",
    link: "https://www.soumyashipower.in/", external: true, cta: "Explore Wind Energy →",
    partner: "Partner Service",
  },
];

function ServiceCard({ service, index, inView }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="service-glass-card"
      style={{
        borderLeft: `3px solid ${hovered ? "#0EA5E9" : service.color}`,
        background: hovered ? "rgba(13,81,140,0.8)" : "rgba(13,81,140,0.5)",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        boxShadow: hovered ? "0 8px 32px rgba(15,23,42,0.4)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "rgba(13,81,140,0.2)", border: "1px solid rgba(13,81,140,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>
          {service.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>{service.title}</p>
          {service.partner && (
            <span style={{ fontSize: 10, color: "var(--text-subtle)", fontWeight: 500 }}>
              ↗ {service.partner}
            </span>
          )}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#94A3B8", margin: "12px 0 0", lineHeight: 1.65, flex: 1 }}>{service.desc}</p>
      {service.external ? (
        <a
          href={service.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", paddingTop: 12, color: service.color, fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {service.cta}
        </a>
      ) : (
        <button
          onClick={() => router.push(service.link)}
          style={{ background: "transparent", border: "none", padding: "12px 0 0", color: service.color, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "opacity 0.2s", minHeight: 44 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {service.cta}
        </button>
      )}
    </motion.div>
  );
}

export default function ServicesPreview() {
  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.05, triggerOnce: true });
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".services-section", {
        opacity: 1, blur: 6, duration: 0.8, start: "top 85%",
      });
    };
    run();
  }, []);

  return (
    <section className="services-section" style={{ overflow: "hidden" }}>
      <div className="services-inner services-layout">
        {/* LEFT */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -40 }}
          animate={leftIn ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="services-left services-left-sticky"
        >
          <span className="section-tag">
            OUR SERVICES
          </span>

          <h2 style={{ fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 16px" }}>
            <span style={{ color: "var(--text-heading)" }}>We Come</span>
            <br />
            <span className="gradient-text">To You.</span>
          </h2>

          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 32 }}>
            Something broken? Our certified technicians reach your home across Odisha — usually the same day you call.
          </p>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 64, fontWeight: 900, color: "#0EA5E9", margin: 0, lineHeight: 1 }}>2 hrs</p>
            <p style={{ fontSize: 12, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>Average response time</p>
          </div>

          <a
            href="tel:+919437611129"
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "rgba(255,255,255,0.5)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 12, textDecoration: "none", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(13,81,140,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)")}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(13,81,140,0.2)", border: "1px solid rgba(13,81,140,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>📞</div>
            <div>
              <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Call Now</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#0EA5E9", margin: 0 }}>+91 94376 11129</p>
            </div>
          </a>
        </motion.div>

        {/* RIGHT */}
        <div ref={rightRef} className="services-grid-right services-right-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} inView={rightIn} />
          ))}
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 48px" }}>
        <div style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 15, color: "var(--text-muted)", margin: 0 }}>Need something not listed? Tell us what&apos;s wrong.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/services/enquiry")}
              style={{ padding: "10px 22px", background: "var(--grad-primary)", color: "#0F172A", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", minHeight: 44 }}
            >
              Send Enquiry →
            </button>
            <Link href="/services" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0EA5E9")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              View all services →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .services-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .services-right-grid { grid-template-columns: 1fr !important; }
          .services-left-sticky { position: static !important; }
        }
        @media (max-width: 1024px) {
          .services-layout { grid-template-columns: 45% 55% !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
