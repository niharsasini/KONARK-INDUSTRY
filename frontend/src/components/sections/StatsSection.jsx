"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STATS = [
  { value: "10+", label: "Years of Excellence" },
  { value: "25000+", label: "Happy Customers" },
  { value: "50+", label: "Products & Solutions" },
  { value: "99%", label: "Customer Satisfaction" },
];

export default function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section style={{ background: "#0a0f1e", padding: "80px 24px" }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
              background: "#0f172a",
              border: "1px solid #1e2d40",
              borderTop: "2px solid #00d4ff",
              borderRadius: 16,
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>
              <AnimatedCounter target={stat.value} />
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, fontWeight: 500 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
