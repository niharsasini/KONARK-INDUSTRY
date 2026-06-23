"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATS = [
  { icon: "⚡", color: "#38bdf8", num: 10, suffix: "+", label: "Years of Excellence", desc: "Founded 2014 in Bhubaneswar" },
  { icon: "👥", color: "#818cf8", num: 25000, suffix: "+", label: "Happy Customers", desc: "Homes, farms & factories" },
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
    <section className="stats-section">
      <div ref={ref} className="stats-inner stats-row">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
          >
            <div
              className="stat-icon"
              style={{
                background: `${stat.color}18`,
                border: `1px solid ${stat.color}40`,
                fontSize: 22,
              }}
            >
              {stat.icon}
            </div>

            <p className="stat-number">
              <AnimatedNumber target={stat.num} suffix={stat.suffix} active={inView} />
            </p>

            <p className="stat-label">{stat.label}</p>
            <p className="stat-desc">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0;
          }
        }
      `}</style>
    </section>
  );
}
