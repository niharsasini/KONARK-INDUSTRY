"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATS = [
  { num: 10, suffix: "+", label: "Years in Business", desc: "Founded 2014 in Bhubaneswar" },
  { num: 25000, suffix: "+", label: "Happy Customers", desc: "Homes, farms & factories" },
  { num: 50, suffix: "+", label: "Products & Services", desc: "EVs, batteries, appliances" },
  { num: 99, suffix: "%", label: "Satisfaction Rate", desc: "Rated by verified buyers" },
];

function CountUp({ target, suffix, active }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);

  const display = target >= 1000 ? count.toLocaleString("en-IN") : count;
  return <>{display}{suffix}</>;
}

export default function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section style={{ background: "#060d1a", padding: "80px 24px" }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
            style={{
              background: "#0a0f1e",
              border: "1px solid #1e2d40",
              borderRadius: 16,
              padding: "32px 28px",
              transition: "border-color 300ms, transform 300ms",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e2d40";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ width: 40, height: 3, background: "#00d4ff", marginBottom: 16, borderRadius: 2 }} />
            <p style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#00d4ff", margin: "0 0 6px", lineHeight: 1 }}>
              <CountUp target={stat.num} suffix={stat.suffix} active={inView} />
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>{stat.label}</p>
            <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>{stat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
