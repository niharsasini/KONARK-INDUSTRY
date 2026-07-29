"use client";

import { useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SERVICES = [
  {
    color: "var(--navy)",
    icon: "❄️",
    title: "AC Repair & Service",
    desc: "Diagnose and fix all brands, same day if booked before noon.",
    points: ["All brands serviced", "Same-day response", "Certified technicians"],
    href: "/services/enquiry", external: false,
  },
  {
    color: "var(--navy)",
    icon: "⚡",
    title: "EV Charging Station Installation",
    desc: "Install commercial and home EV charging stations. Certified installation, 1-year warranty on all equipment.",
    points: ["Home & commercial setup", "Smart billing system", "1-year equipment warranty"],
    href: "https://www.soumyashipower.in/", external: true,
  },
  {
    color: "#5b21b6",
    icon: "🔋",
    title: "Battery Swap Service",
    desc: "Exchange your discharged EV battery for a fully charged one. Home pickup available.",
    points: ["Home pickup available", "Instant swap token", "All Konark EV models"],
    href: "/battery-swap", external: false,
  },
  {
    color: "var(--gold)",
    icon: "☀️",
    title: "Solar Power Plant Installation",
    desc: "Residential and commercial solar power plants. Rooftop, ground-mount, and captive solar up to 1MW.",
    points: ["Rooftop & ground-mount", "On-grid and off-grid", "Subsidy & financing support"],
    href: "https://www.soumyashipower.in/", external: true,
  },
  {
    color: "var(--navy)",
    icon: "💨",
    title: "Wind Power Plant Installation",
    desc: "Small and large-scale wind energy solutions. Hybrid wind-solar systems for farms, industries, and institutions.",
    points: ["Hybrid wind-solar systems", "Farm, industrial & institutional", "Full EPC execution"],
    href: "https://www.soumyashipower.in/", external: true,
  },
  {
    color: "#1a7a4a",
    icon: "🏠",
    title: "Home Electrical Work",
    desc: "Wiring, rewiring, fault finding, board upgrades by licensed electricians.",
    points: ["Licensed electricians", "Fault finding & repair", "Board upgrades"],
    href: "/services/enquiry", external: false,
  },
];

export default function ServicesPage() {
  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".services-hero", {
        y: 48, opacity: 0, blur: 8, duration: 0.8,
      });
      await animateIn(".service-card-item", {
        y: 56, opacity: 0, scale: 0.94,
        stagger: 0.1, duration: 0.65,
        start: "top 80%",
      });
    };
    run();
  }, []);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      {/* Hero */}
      <div className="services-hero" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-light)", padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid var(--border-navy)", color: "var(--navy)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "var(--navy-bg)", marginBottom: 20 }}>
            Our Services
          </span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 16px", lineHeight: 1.15 }}>
            Powering Industries with<br />Smart Energy Solutions
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 580, lineHeight: 1.7 }}>
            We design, build, and maintain future-ready energy and automation systems that enhance efficiency, sustainability, and long-term performance.
          </p>
        </div>
      </div>

      {/* Intro */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="services-intro-grid">
          <div>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px" }}>
              We don't just sell products.<br />We solve energy problems.
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>
              From a single rooftop solar installation to a complete 1MW captive power plant — our team of certified engineers handles the full project lifecycle. We're not resellers; we're builders.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { num: "500+", label: "Projects completed" },
              { num: "48h", label: "Audit turnaround" },
              { num: "7d", label: "Installation SLA" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12, padding: "20px 16px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)", margin: "0 0 4px" }}>{s.num}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section id="services" style={{ background: "var(--bg-section)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="service-card-item"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderTop: `2px solid ${s.color}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.2s", boxShadow: "var(--shadow-sm)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.borderTopColor = s.color; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {s.points.map((p) => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                      <span style={{ color: s.color, fontSize: 14 }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
                {s.external ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: s.color, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Learn More ↗
                    <span style={{ fontSize: 9, background: s.color + "20", border: `1px solid ${s.color}40`, color: s.color, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>External Partner</span>
                  </a>
                ) : (
                  <Link href={s.href} style={{ fontSize: 12, color: s.color, textDecoration: "none", fontWeight: 600 }}>
                    Book Now →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 12px" }}>
          Ready to Power Your Next Project?
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 32px" }}>
          Connect with our experts to design efficient, scalable, and future-ready energy solutions for your business.
        </p>
        <Link
          href="/contact"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "var(--grad-navy)", color: "#ffffff", fontWeight: 700, fontSize: 15, borderRadius: 8, textDecoration: "none", transition: "background 0.2s", boxShadow: "var(--shadow-navy)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--navy-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--grad-navy)")}
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
