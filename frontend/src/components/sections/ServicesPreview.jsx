"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SERVICES = [
  {
    icon: "❄️",
    iconBg: "rgba(0,212,255,0.1)",
    color: "#00d4ff",
    title: "AC Repair & Service",
    desc: "AC not cooling, making noise, or leaking? We diagnose and fix all brands — same day if booked before noon.",
    cta: "Book AC Service →",
  },
  {
    icon: "⚡",
    iconBg: "rgba(0,212,255,0.1)",
    color: "#00d4ff",
    title: "EV Charger Install & Repair",
    desc: "Installing a new EV charger at home or fixing one that's stopped working. Certified technicians, 1-year warranty.",
    cta: "Book EV Service →",
  },
  {
    icon: "🏠",
    iconBg: "rgba(124,58,237,0.1)",
    color: "#7c3aed",
    title: "Home Electrical Work",
    desc: "Wiring, rewiring, fault finding, board upgrades. Full home electrical solutions by licensed electricians.",
    cta: "Book Electrician →",
  },
  {
    icon: "☀️",
    iconBg: "rgba(249,115,22,0.1)",
    color: "#f97316",
    title: "Solar Panel Installation",
    desc: "Rooftop solar from survey to commissioning. We handle everything — panels, inverter, net metering, subsidy paperwork.",
    cta: "Book Solar Visit →",
  },
  {
    icon: "🔋",
    iconBg: "rgba(124,58,237,0.1)",
    color: "#7c3aed",
    title: "Battery System Setup",
    desc: "Custom LFP battery packs for your solar system, EV, or industrial backup. Sized and installed by our engineers.",
    cta: "Book Battery Setup →",
  },
  {
    icon: "🔧",
    iconBg: "rgba(16,185,129,0.1)",
    color: "#10b981",
    title: "Annual Maintenance (AMC)",
    desc: "Keep everything running at peak condition year-round. AMC plans for appliances, EVs, and industrial equipment.",
    cta: "Get AMC Quote →",
  },
];

function ServiceCard({ service, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      style={{
        background: "#0f172a",
        border: "1px solid #1e2d40",
        borderRadius: 16,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = service.color;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 20px ${service.color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e2d40";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: service.iconBg, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>
        {service.icon}
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>
          {service.title}
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.8 }}>
          {service.desc}
        </p>
      </div>
      <ServiceCTA cta={service.cta} color={service.color} />
    </motion.div>
  );
}

function ServiceCTA({ cta, color }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/services/enquiry")}
      style={{
        marginTop: "auto", display: "inline-flex", alignItems: "center",
        fontSize: 13, fontWeight: 600, color, background: "transparent",
        border: "none", cursor: "pointer", padding: 0,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {cta}
    </button>
  );
}

export default function ServicesPreview() {
  const router = useRouter();
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{ background: "#060d1a", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)",
            color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16,
          }}>
            OUR SERVICES
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 14px", lineHeight: 1.2 }}>
            We Come To You.
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            Something not working? Our trained technicians are available across Odisha.
            Book a service visit in under 2 minutes.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 56,
          }}
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={gridIn} />
          ))}
        </div>

        {/* Big CTA */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 20 }}>
            Need a service not listed here? Tell us what's wrong.
          </p>
          <button
            onClick={() => router.push("/services/enquiry")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 40px", background: "#00d4ff", color: "#0a0f1e",
              fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none",
              cursor: "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
          >
            Send Us an Enquiry →
          </button>
        </div>
      </div>
    </section>
  );
}
