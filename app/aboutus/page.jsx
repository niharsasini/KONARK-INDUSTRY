"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Page() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm uppercase tracking-widest text-gray-400"
          >
            About Our Company
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-snug sm:leading-tight"
          >
            Powering a Smarter & Sustainable Tomorrow
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 sm:mt-6 max-w-xl sm:max-w-2xl mx-auto text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            We design, manufacture, and deliver future-ready energy and
            technology solutions that empower homes, businesses, and industries.
          </motion.p>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold">Who We Are</h2>
            <p className="mt-4 sm:mt-6 text-gray-600 leading-relaxed text-sm sm:text-base">
              We are a technology-driven organization specializing in electric
              vehicles, advanced batteries, energy-efficient appliances, and
              intelligent power solutions.
            </p>
            <p className="mt-2 sm:mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              By combining innovation, engineering excellence, and
              customer-first thinking, we help accelerate the transition towards
              cleaner, smarter, and more reliable energy systems.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl bg-gray-100 p-6 sm:p-10"
          >
            <h3 className="text-lg sm:text-xl font-semibold">Our Journey</h3>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              Founded with a clear vision to redefine energy accessibility, we
              have evolved into a trusted provider of EV solutions, smart
              appliances, and energy storage systems across multiple sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center">
          {[
            { value: "10+", label: "Years of Experience" },
            { value: "25K+", label: "Customers Served" },
            { value: "50+", label: "Products & Solutions" },
            { value: "99%", label: "Client Satisfaction" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MISSION / VISION ================= */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {[
            {
              title: "Our Mission",
              text: "To deliver innovative, energy-efficient, and sustainable solutions that reduce environmental impact while maximizing value for our customers.",
            },
            {
              title: "Our Vision",
              text: "To become a global leader in smart energy and mobility solutions, shaping a cleaner, connected, and energy-secure future.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border"
            >
              <h3 className="text-xl sm:text-2xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gray-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">Why Choose Us</h2>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {[
              ["Innovation", "Future-ready technology built to scale."],
              ["Efficiency", "Designed to minimize energy waste and cost."],
              ["Quality", "Strict standards in safety and performance."],
              ["Support", "Long-term service & dedicated customer care."],
            ].map(([title, desc]) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-xl p-6 sm:p-8"
              >
                <h3 className="font-semibold text-lg sm:text-xl">{title}</h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-300">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 sm:py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl sm:max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Let’s Build a Smarter Energy Future
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Partner with us to unlock innovative energy and technology solutions
            tailored to your needs.
          </p>
          <button className="mt-6 sm:mt-8 rounded-full bg-gray-900 px-8 sm:px-10 py-2 sm:py-3 text-white font-medium hover:bg-gray-800 transition">
            Get in Touch
          </button>
        </motion.div>
      </section>
    </div>
  );
}
