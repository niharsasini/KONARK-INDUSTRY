"use client";
import { useState } from "react";

const TABS = [
  {
    id: "ev",
    label: "EV & Mobility",
    image: "/konark/scooty.png",
    color: "#00d4ff",
    features: [
      "Range up to 200km on a single charge",
      "Fast-charge in under 4 hours",
      "Regenerative braking system",
      "App-connected digital dashboard",
    ],
    desc: "Our electric vehicles are built for Indian roads — robust, efficient, and designed to outlast conventional options. From scooters to cargo e-rickshaws, we cover every mobility need.",
  },
  {
    id: "battery",
    label: "Energy Storage",
    image: "/konark/productenergystored.png",
    color: "#7c3aed",
    features: [
      "3000+ charge cycles guaranteed",
      "Integrated BMS protection",
      "Scalable from 5kWh to 500kWh",
      "10-year design life",
    ],
    desc: "LFP (Lithium Iron Phosphate) batteries engineered for longevity and safety. Ideal for solar storage, industrial backup, and EV power systems.",
  },
  {
    id: "home",
    label: "Home Appliances",
    image: "/konark/fan.jpeg",
    color: "#10b981",
    features: [
      "5-star BEE rated energy efficiency",
      "BLDC motor saves 60% energy vs regular fans",
      "Smart control compatible",
      "5-year motor warranty",
    ],
    desc: "Smart home appliances that reduce your electricity bill without sacrificing comfort. Every unit is precision-engineered at our Bhubaneswar facility.",
  },
  {
    id: "industrial",
    label: "Industrial",
    image: "/konark/coldstorage solutions.png",
    color: "#f97316",
    features: [
      "Custom capacity from 1 ton to 500 ton",
      "IoT remote monitoring included",
      "7-day installation SLA",
      "Dedicated account manager",
    ],
    desc: "Industrial-grade cold storage, automation systems, and custom motor solutions. We work directly with factories, farms, and large institutions across eastern India.",
  },
];

export default function SolutionsSection() {
  const [active, setActive] = useState("ev");
  const tab = TABS.find((t) => t.id === active);

  return (
    <section style={{ background: "#111827", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16 }}>
            What we make
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.2 }}>
            Complete Energy Ecosystem
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 520, margin: "0 auto" }}>
            One company. Four pillars. Everything you need to live, work, and move sustainably.
          </p>
        </div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: active === t.id ? t.color : "#1e2d40",
                background: active === t.id ? `${t.color}15` : "transparent",
                color: active === t.id ? t.color : "#94a3b8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="solutions-grid">
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #1e2d40", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
            <img src={tab.image} alt={tab.label} loading="lazy" style={{ maxWidth: "80%", maxHeight: 280, objectFit: "contain" }} />
          </div>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{tab.label}</h3>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>{tab.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {tab.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#f1f5f9" }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${tab.color}20`, border: `1px solid ${tab.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 20 20" fill={tab.color} style={{ width: 10, height: 10 }}>
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .solutions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
