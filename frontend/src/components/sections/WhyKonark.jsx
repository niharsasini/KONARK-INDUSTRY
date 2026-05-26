"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FEATURES = [
  {
    icon: "🛡️",
    color: "#00d4ff",
    title: "ISI & BIS Certified",
    desc: "Every product meets strict Indian Bureau of Standards requirements. We don't ship anything we wouldn't put in our own homes.",
  },
  {
    icon: "🚚",
    color: "#7c3aed",
    title: "Doorstep Service Across Odisha",
    desc: "AC not cooling? EV charger acting up? We send our trained technicians to your home or business — usually within 24 hours.",
  },
  {
    icon: "🔋",
    color: "#10b981",
    title: "2-Year Product Warranty",
    desc: "Every scooter, rickshaw, battery, and appliance comes with a full 2-year warranty. 50+ authorised service points in Odisha.",
  },
  {
    icon: "⚡",
    color: "#f97316",
    title: "Energy Efficient by Design",
    desc: "All appliances carry 4-star or 5-star BEE ratings. Our EVs cut your transport costs by up to 80% vs petrol vehicles.",
  },
];

export default function WhyKonark() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{
      background: "linear-gradient(180deg, #060d1a 0%, #0a0f1e 100%)",
      padding: "100px 24px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
            WHY CHOOSE US
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 14px", lineHeight: 1.2 }}>
            The Konark Promise
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            We don't cut corners. Every product we make and every service we provide carries
            our name — and we take that seriously.
          </p>
        </motion.div>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={gridIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              style={{
                background: "#0f172a",
                border: "1px solid #1e2d40",
                borderRadius: 16,
                padding: "36px 32px",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.25)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e2d40";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ width: 48, height: 3, background: f.color, marginBottom: 20, borderRadius: 2 }} />
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `${f.color}18`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 18,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.8 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
