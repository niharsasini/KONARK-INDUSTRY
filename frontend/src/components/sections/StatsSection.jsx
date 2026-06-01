"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATS = [
  { icon: "⚡", color: "#00d4ff", num: 10, suffix: "+", label: "Years of Excellence", desc: "Founded 2014 in Bhubaneswar" },
  { icon: "👥", color: "#7c3aed", num: 25000, suffix: "+", label: "Happy Customers", desc: "Homes, farms & factories" },
  { icon: "📦", color: "#f97316", num: 50, suffix: "+", label: "Products & Services", desc: "EVs, batteries, appliances" },
  { icon: "⭐", color: "#f59e0b", num: 99, suffix: "%", label: "Satisfaction Rate", desc: "Rated by verified buyers" },
];

function AnimatedNumber({ target, suffix, active }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(target, Math.round(increment * step));
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  const display = target >= 1000 ? count.toLocaleString("en-IN") : count;
  return <>{display}{suffix}</>;
}

export default function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section style={{
      background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)",
      padding: "64px 24px",
    }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          position: "relative",
        }}
        className="stats-row"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            style={{
              padding: "32px 28px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Vertical divider (not on last item) */}
            {i < 3 && (
              <div style={{
                position: "absolute", right: 0, top: "20%", bottom: "20%",
                width: 1, background: "rgba(30,45,64,0.8)",
              }} />
            )}

            {/* Icon circle */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: `${stat.color}18`,
              border: `1px solid ${stat.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, margin: "0 auto 16px",
            }}>
              {stat.icon}
            </div>

            {/* Number with gradient */}
            <p style={{
              fontSize: "clamp(40px, 4vw, 56px)",
              fontWeight: 900,
              lineHeight: 1,
              margin: "0 0 8px",
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              <AnimatedNumber target={stat.num} suffix={stat.suffix} active={inView} />
            </p>

            {/* Label */}
            <p style={{
              fontSize: 13, fontWeight: 700, color: "#f1f5f9",
              textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px",
            }}>
              {stat.label}
            </p>

            {/* Description */}
            <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0;
          }
          .stats-row > div {
            border-bottom: 1px solid #1e2d40;
          }
          .stats-row > div:nth-child(odd) {
            border-right: 1px solid #1e2d40;
          }
        }
      `}</style>
    </section>
  );
}
