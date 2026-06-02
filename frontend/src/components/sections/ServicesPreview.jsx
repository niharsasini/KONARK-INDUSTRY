"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SERVICES = [
  { icon: "❄️", color: "#00d4ff", title: "AC Repair & Service", desc: "Diagnose and fix all brands, same day if booked before noon." },
  { icon: "⚡", color: "#00d4ff", title: "EV Charger Install", desc: "Certified installation at home or commercial premises. 1-year warranty." },
  { icon: "🏠", color: "#7c3aed", title: "Home Electrical", desc: "Wiring, rewiring, fault finding, board upgrades by licensed electricians." },
  { icon: "☀️", color: "#f97316", title: "Solar Installation", desc: "Survey to commissioning — panels, inverter, net metering, subsidy paperwork." },
  { icon: "🔋", color: "#7c3aed", title: "Battery Setup", desc: "Custom LFP battery packs for solar, EV, or industrial backup. Installed." },
  { icon: "🔧", color: "#10b981", title: "Annual AMC", desc: "AMC plans for appliances, EVs, and industrial equipment. Peak condition." },
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
        borderLeft: `3px solid ${hovered ? service.color : service.color + "80"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `${service.color}18`, border: `1px solid ${service.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>
          {service.icon}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{service.title}</p>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", margin: "12px 0 0", lineHeight: 1.65, flex: 1 }}>{service.desc}</p>
      <button
        onClick={() => router.push("/services/enquiry")}
        style={{ background: "transparent", border: "none", padding: "12px 0 0", color: service.color, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "opacity 0.2s", minHeight: 44 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Book →
      </button>
    </motion.div>
  );
}

export default function ServicesPreview() {
  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.05, triggerOnce: true });
  const router = useRouter();

  return (
    <section className="services-section" style={{ background: "#060d1a", overflow: "hidden" }}>
      <div className="services-inner services-layout">
        {/* LEFT */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -40 }}
          animate={leftIn ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="services-left services-left-sticky"
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff",
            fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 20,
          }}>
            OUR SERVICES
          </span>

          <h2 style={{ fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 16px" }}>
            <span style={{ color: "#f1f5f9" }}>We Come</span>
            <br />
            <span style={{
              background: "linear-gradient(270deg, #00d4ff, #7c3aed, #f97316, #00d4ff)",
              backgroundSize: "300% 300%",
              animation: "gradient-shift 4s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>To You.</span>
          </h2>

          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 32 }}>
            Something broken? Our certified technicians reach your home across Odisha — usually the same day you call.
          </p>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 64, fontWeight: 900, color: "#00d4ff", margin: 0, lineHeight: 1, textShadow: "0 0 30px rgba(0,212,255,0.4)" }}>2 hrs</p>
            <p style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>Average response time</p>
          </div>

          <a
            href="tel:+919437611129"
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, textDecoration: "none", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#00d4ff")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e2d40")}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>📞</div>
            <div>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Call Now</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#00d4ff", margin: 0 }}>+91 94376 11129</p>
            </div>
          </a>
        </motion.div>

        {/* RIGHT */}
        <div ref={rightRef} className="services-grid-right services-right-grid">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} inView={rightIn} />
          ))}
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 48px" }}>
        <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: 0 }}>Need something not listed? Tell us what&apos;s wrong.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/services/enquiry")}
              style={{ padding: "10px 22px", background: "#00d4ff", color: "#0a0f1e", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", minHeight: 44 }}
            >
              Send Enquiry →
            </button>
            <Link href="/services" style={{ fontSize: 14, color: "#64748b", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
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
