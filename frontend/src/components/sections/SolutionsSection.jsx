"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const TABS = [
  {
    id: "ev", icon: "🏍", label: "EV & Mobility",
    color: "#00d4ff", image: "/konark/productevscooty.png",
    stat: "200km", statLabel: "Max Range",
    heading: "Electric Vehicles",
    desc: "Our EVs are built for Indian roads — robust, efficient, and designed to outlast conventional options. From scooters to cargo e-rickshaws.",
    features: [
      "Scooters: 200km range, 4-hour fast charge",
      "E-Rickshaws: carry up to 400kg, 80km range",
      "LFP battery — 3,000 charge cycles, 10-year life",
      "All vehicles ISI certified for Indian roads",
    ],
    products: ["EV Scooter X1", "EV Motorcycle Pro", "E-Rickshaw Standard"],
  },
  {
    id: "battery", icon: "🔋", label: "Energy Storage",
    color: "#7c3aed", image: "/konark/productenergystored.png",
    stat: "3,000+", statLabel: "Charge Cycles",
    heading: "LFP Battery Systems",
    desc: "LFP batteries engineered for longevity and safety. Ideal for solar storage, industrial backup, and EV power systems.",
    features: [
      "Built-in BMS — surge and overcharge protection",
      "Works with any solar inverter brand",
      "Suitable for home, farm, and factory backup",
      "3,000+ cycles = 10+ years daily use",
    ],
    products: ["48V 100Ah LFP", "72V 50Ah LFP", "Industrial 200Ah"],
  },
  {
    id: "home", icon: "🏠", label: "Home Appliances",
    color: "#10b981", image: "/konark/fan.jpeg",
    stat: "60%", statLabel: "Energy Savings",
    heading: "Smart Appliances",
    desc: "Smart home appliances that reduce your electricity bill without sacrificing comfort. Precision-engineered in Bhubaneswar.",
    features: [
      "BLDC fans save 60% electricity vs normal fans",
      "Inverter ACs — 5-star BEE rated",
      "All appliances: 2-year Konark warranty",
      "Smart control — Alexa/Google compatible",
    ],
    products: ["BLDC Fan 5-star", "Inverter AC 1.5T", "Inverter AC 2T"],
  },
  {
    id: "industrial", icon: "🏭", label: "Industrial",
    color: "#f97316", image: "/konark/coldstorage solutions.png",
    stat: "7 days", statLabel: "Fast Delivery",
    heading: "Industrial Solutions",
    desc: "Cold storage, automation systems, and custom motor solutions. We work directly with factories, farms, and large institutions.",
    features: [
      "Industrial motors for pumps & compressors",
      "Cold storage from 1 to 500 ton capacity",
      "PCB design and manufacturing for OEM",
      "ISO 9001:2015 certified production",
    ],
    products: ["Industrial Motors", "Cold Storage", "PCB Services"],
  },
];

function TabContent({ tab, inView }) {
  return (
    <motion.div
      key={tab.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}
      className="solutions-content-grid"
    >
      {/* Left */}
      <div>
        <p style={{
          fontSize: "clamp(52px, 6vw, 72px)", fontWeight: 900, color: tab.color,
          margin: "0 0 4px", lineHeight: 1,
          textShadow: `0 0 40px ${tab.color}50`,
        }}>{tab.stat}</p>
        <p style={{
          fontSize: 11, color: "#64748b", textTransform: "uppercase",
          letterSpacing: "0.12em", marginBottom: 20,
        }}>{tab.statLabel}</p>
        <h3 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px" }}>{tab.heading}</h3>
        <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 24 }}>{tab.desc}</p>

        {/* Features */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {tab.features.map(f => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#f1f5f9" }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: `${tab.color}20`, border: `1px solid ${tab.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
              }}>
                <svg viewBox="0 0 12 12" fill={tab.color} style={{ width: 7, height: 7 }}>
                  <path d="M2 6l3 3 5-6" stroke={tab.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button style={{
          padding: "12px 26px", background: `${tab.color}18`,
          border: `1px solid ${tab.color}50`, color: tab.color,
          borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `${tab.color}30`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${tab.color}18`; }}
        >
          Explore {tab.label} →
        </button>
      </div>

      {/* Right — 3D floating card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <motion.div
          animate={{ y: [0, -12, 0], rotateX: [0, 3, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          style={{
            background: "rgba(15,23,42,0.8)", backdropFilter: "blur(20px)",
            border: `1px solid ${tab.color}25`,
            borderRadius: 24, padding: 32,
            width: "100%", maxWidth: 340,
            boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${tab.color}15`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Product chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {tab.products.map(p => (
              <span key={p} style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 100,
                background: `${tab.color}12`, color: tab.color,
                border: `1px solid ${tab.color}30`, fontWeight: 600,
              }}>{p}</span>
            ))}
          </div>

          {/* Product image */}
          <div style={{
            background: "#060d1a", borderRadius: 16, padding: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, minHeight: 180,
          }}>
            <img src={tab.image} alt={tab.label} loading="lazy"
              style={{ maxWidth: "80%", maxHeight: 160, objectFit: "contain",
                filter: `drop-shadow(0 0 20px ${tab.color}40)` }} />
          </div>

          <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>{tab.heading}</p>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Engineered in Bhubaneswar, Odisha</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SolutionsSection() {
  const [active, setActive] = useState("ev");
  const tab = TABS.find(t => t.id === active);
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section style={{
      background: "linear-gradient(180deg, #060d1a 0%, #0a0f1e 100%)",
      padding: "100px 24px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff",
            fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 16,
          }}>
            WHAT WE MAKE
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
            <span style={{ color: "#f1f5f9" }}>Complete Energy </span>
            <span style={{
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Ecosystem</span>
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            One company. Four pillars. Everything you need to live, work, and move sustainably.
          </p>
        </motion.div>

        {/* Icon tabs */}
        <div style={{
          display: "flex", gap: 10, justifyContent: "center",
          flexWrap: "wrap", marginBottom: 48,
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.25s",
                background: active === t.id
                  ? `linear-gradient(135deg, ${t.color}30, ${t.color}15)`
                  : "transparent",
                color: active === t.id ? t.color : "#64748b",
                border: `1px solid ${active === t.id ? t.color + "60" : "#1e2d40"}`,
                boxShadow: active === t.id ? `0 0 20px ${t.color}20` : "none",
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Animated tab content */}
        <AnimatePresence mode="wait">
          <TabContent key={active} tab={tab} />
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solutions-content-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
