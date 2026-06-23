"use client";

import Link from "next/link";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import FAQSection from "@/components/sections/FAQSection";

const TIMELINE = [
  { year: "2014", text: "Founded in Bhubaneswar with 12 employees and a single product line" },
  { year: "2016", text: "Launched LFP battery systems — first Odisha-based manufacturer" },
  { year: "2018", text: "Crossed 5,000 customers and expanded to pan-India delivery" },
  { year: "2020", text: "Entered EV space with Konark X1 scooter" },
  { year: "2022", text: "Opened second factory, launched BLDC appliance line" },
  { year: "2024", text: "25,000+ customers, 28+ products, 8+ states" },
];

const VALUES = [
  { title: "Honesty", desc: "We say what we mean and stand behind every product we sell." },
  { title: "Quality", desc: "47 quality checks on every product before it leaves our factory." },
  { title: "Innovation", desc: "Constantly improving to stay ahead of India's energy needs." },
  { title: "Sustainability", desc: "Building a cleaner future, one product at a time." },
];

const STATS = [
  { value: "10+", label: "Years of Experience" },
  { value: "25000+", label: "Customers Served" },
  { value: "28+", label: "Products & Solutions" },
  { value: "99%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      {/* Hero */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e2d40", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 12, color: "#94a3b8" }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#00d4ff" }}>About</span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 20 }}>
          About Our Company
        </span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.15 }}>Our Story</h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          We design, manufacture, and deliver future-ready energy and technology solutions that empower homes, businesses, and industries.
        </p>
      </div>

      {/* Who we are */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="about-grid">
          <div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>
              Born in Bhubaneswar.<br />Built for Bharat.
            </h2>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16 }}>
              Konark Industry started in 2014 with one simple belief: Indian families and businesses deserve world-class electronics at honest prices. Our founders — engineers who grew up in Odisha — were tired of watching quality products sit out of reach behind import markups.
            </p>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16 }}>
              We started with industrial motors. Then came batteries. Then fans, air conditioners, and electric vehicles. Today, from our 40,000 sq ft factory in Bhubaneswar, we make over 50 products that power homes, farms, factories, and the roads of eastern India.
            </p>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8 }}>
              Every wire, every cell, every motor that carries the Konark name has been tested to outlast the alternatives. That's not a marketing claim — it's the standard we hold ourselves to every single day.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderTop: "2px solid #00d4ff", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>
                  <AnimatedCounter target={s.value} />
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: "#111827", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16 }}>
              Our journey
            </span>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>A Decade of Progress</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", maxWidth: 680, margin: "0 auto" }}>
            <div style={{ position: "absolute", left: 47, top: 0, bottom: 0, width: 2, background: "#1e2d40" }} />
            {TIMELINE.map((item, i) => (
              <div key={item.year} style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 28, position: "relative" }}>
                <div style={{ flexShrink: 0, width: 96, display: "flex", justifyContent: "flex-end", paddingTop: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00d4ff" }}>{item.year}</span>
                </div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00d4ff", border: "2px solid #0a0f1e", flexShrink: 0, marginTop: 4, zIndex: 1 }} />
                <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="mv-grid">
          {[
            { title: "Our Mission", text: "To make clean, affordable energy accessible to every Indian home and business — starting from Odisha." },
            { title: "Our Vision", text: "To be India's most trusted homegrown energy brand by 2030." },
          ].map((item) => (
            <div key={item.title} style={{ background: "rgba(15,23,42,0.8)", backdropFilter: "blur(12px)", border: "1px solid #1e2d40", borderRadius: 20, padding: "32px 28px" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "#111827", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Team Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px 20px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#00d4ff", marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Come work with us</h2>
        <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>We're always looking for passionate people who want to build something meaningful.</p>
        <Link
          href="/contact"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid #1e2d40", borderRadius: 8, color: "#f1f5f9", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
        >
          Get in Touch
        </Link>
      </section>

      <FAQSection />

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .mv-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
