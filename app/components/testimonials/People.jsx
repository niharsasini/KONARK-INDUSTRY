"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, memo } from "react";
import { testimonials } from "./testimonials.data";
import StatCard from "./StatCard";
import TestimonialCard from "./TestimonialCard";

const stats = [
  { label: "EVs Powered", value: "10,000+" },
  { label: "Energy Deployed", value: "120+ MWh" },
  { label: "Cities Served", value: "18+" },
  { label: "Industry Partners", value: "40+" },
];

function People() {
  const [[index, dir], setIndex] = useState([0, 0]);

  const paginate = useCallback((direction) => {
    setIndex(([prev]) => [
      (prev + direction + testimonials.length) % testimonials.length,
      direction,
    ]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6500);
    return () => clearInterval(timer);
  }, [paginate]);

  return (
    <section className="relative bg-gray-50 py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50" />

      {/* Floating blobs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Client Trust
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-gray-900">
            Proven by Real-World Impact
          </h2>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">
            Trusted by EV startups, fleet operators, and clean-energy leaders.
          </p>
        </motion.header>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </motion.div>

        {/* Testimonial */}
        <div className="mt-28 flex justify-center">
          <AnimatePresence mode="wait" custom={dir}>
            <TestimonialCard
              key={index}
              testimonial={testimonials[index]}
              index={index}
              dir={dir}
            />
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-blue-600"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(People);
