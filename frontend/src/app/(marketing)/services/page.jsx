"use client";
import Link from "next/link";

const SERVICES = [
  {
    color: "#f97316",
    icon: "☀️",
    title: "Solar Installation",
    desc: "End-to-end solar solutions from site survey to commissioning.",
    points: ["Rooftop & ground-mount systems", "On-grid and off-grid options", "Subsidy & financing support"],
  },
  {
    color: "#00d4ff",
    icon: "⚡",
    title: "EV Charging Infrastructure",
    desc: "Complete EV charger setup for homes, offices, and commercial stations.",
    points: ["Home charger installation", "Commercial station setup", "Smart billing system"],
  },
  {
    color: "#7c3aed",
    icon: "🤖",
    title: "Industrial Automation",
    desc: "SCADA, PLC, and motor control systems for industrial facilities.",
    points: ["PLC & SCADA integration", "Motor drive systems", "Remote monitoring & control"],
  },
  {
    color: "#10b981",
    icon: "📊",
    title: "Energy Audits",
    desc: "Identify savings opportunities with a full ROI report within 48 hours.",
    points: ["Consumption analysis", "Cost optimisation roadmap", "Compliance documentation"],
  },
  {
    color: "#7c3aed",
    icon: "🔋",
    title: "Battery System Design",
    desc: "Custom LFP battery packs engineered for your exact application.",
    points: ["5kWh to 500kWh capacity", "BMS integration", "10-year design life"],
  },
  {
    color: "#f97316",
    icon: "🏭",
    title: "Power Plant Setup",
    desc: "Turnkey captive solar and hybrid power systems up to 1MW.",
    points: ["Captive solar plants", "Hybrid grid integration", "Full EPC execution"],
  },
  {
    color: "#00d4ff",
    icon: "🔧",
    title: "Preventive Maintenance",
    desc: "AMC contracts keeping your equipment running at peak performance.",
    points: ["Scheduled preventive visits", "24/7 emergency hotline", "Annual contract pricing"],
  },
  {
    color: "#10b981",
    icon: "❄️",
    title: "Cold Chain Solutions",
    desc: "Industrial refrigeration and controlled atmosphere storage systems.",
    points: ["Custom capacity planning", "IoT temperature monitoring", "7-day installation SLA"],
  },
  {
    color: "#7c3aed",
    icon: "🌐",
    title: "Smart Grid Integration",
    desc: "Demand response, load management, and grid analytics solutions.",
    points: ["Demand response systems", "Load balancing automation", "Energy analytics dashboard"],
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e2d40", padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20, fontSize: 12, color: "#94a3b8" }}>
            <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#00d4ff" }}>Services</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 20 }}>
            Our Services
          </span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.15 }}>
            Powering Industries with<br />Smart Energy Solutions
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 580, lineHeight: 1.7 }}>
            We design, build, and maintain future-ready energy and automation systems that enhance efficiency, sustainability, and long-term performance.
          </p>
        </div>
      </div>

      {/* Intro */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="services-intro-grid">
          <div>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px" }}>
              We don't just sell products.<br />We solve energy problems.
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>
              From a single rooftop solar installation to a complete 1MW captive power plant — our team of certified engineers handles the full project lifecycle. We're not resellers; we're builders.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { num: "500+", label: "Projects completed" },
              { num: "48h", label: "Audit turnaround" },
              { num: "7d", label: "Installation SLA" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#00d4ff", margin: "0 0 4px" }}>{s.num}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section id="services" style={{ background: "#111827", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <div
                key={s.title}
                style={{ background: "#0f172a", border: "1px solid #1e2d40", borderTop: `2px solid ${s.color}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.borderTopColor = s.color; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.6 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {s.points.map((p) => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
                      <span style={{ color: s.color, fontSize: 14 }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" style={{ fontSize: 12, color: s.color, textDecoration: "none", fontWeight: 600 }}>
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px" }}>
          Ready to Power Your Next Project?
        </h2>
        <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 520, margin: "0 auto 32px" }}>
          Connect with our experts to design efficient, scalable, and future-ready energy solutions for your business.
        </p>
        <Link
          href="/contact"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 15, borderRadius: 8, textDecoration: "none", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
        >
          Get in Touch
        </Link>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .services-intro-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
