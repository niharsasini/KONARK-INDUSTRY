"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { usePublicStats } from "@/hooks/usePublicStats";
import { parseStatValue } from "@/lib/parseStatValue";

const STATS_FALLBACK = {
  years_experience: "10+",
  customers: "25,000+",
  total_products: 50,
  satisfaction: "99%",
  founding_year: 2014,
};

function buildStats(stats) {
  const s = stats || STATS_FALLBACK;
  const years = parseStatValue(s.years_experience || STATS_FALLBACK.years_experience);
  const customers = parseStatValue(s.customers || STATS_FALLBACK.customers);
  const satisfaction = parseStatValue(s.satisfaction || STATS_FALLBACK.satisfaction);
  const products = s.total_products ?? STATS_FALLBACK.total_products;

  return [
    { icon: "⚡", color: "#0D518C", num: years.num, suffix: years.suffix, label: "Years of Excellence", desc: `Founded ${s.founding_year || STATS_FALLBACK.founding_year} in Bhubaneswar` },
    { icon: "👥", color: "#0EA5E9", num: customers.num, suffix: customers.suffix, label: "Happy Customers", desc: "Homes, farms & factories" },
    { icon: "📦", color: "#D97706", num: products, suffix: "+", label: "Products & Services", desc: "EVs, batteries, appliances" },
    { icon: "⭐", color: "#34C78A", num: satisfaction.num, suffix: satisfaction.suffix, label: "Satisfaction Rate", desc: "Rated by verified buyers" },
  ];
}

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
  const publicStats = usePublicStats();
  const STATS = useMemo(() => buildStats(publicStats), [publicStats]);

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".stats-section", {
        opacity: 1, blur: 6, duration: 0.8, start: "top 85%",
      });
    };
    run();
  }, []);

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
