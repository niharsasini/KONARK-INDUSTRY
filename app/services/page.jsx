"use client";

import React from "react";
import { motion } from "framer-motion";

const SERVICES = [
  {
    title: "Solar Power Systems",
    desc: "End-to-end solar solutions tailored for residential, commercial, and industrial applications.",
    points: ["Rooftop & Utility Scale", "On-grid & Off-grid", "Solar EPC"],
  },
  {
    title: "Industrial Machinery",
    desc: "Robust and high-performance machinery designed for demanding industrial environments.",
    points: [
      "Heavy Equipment",
      "Process Automation",
      "Energy Efficient Design",
    ],
  },
  {
    title: "Energy Audits",
    desc: "Comprehensive audits to identify inefficiencies and reduce operational energy costs.",
    points: ["Consumption Analysis", "Cost Optimization", "Compliance Reports"],
  },
  {
    title: "Power Plant Setup",
    desc: "Turnkey execution of power generation plants from concept to commissioning.",
    points: ["Thermal & Solar", "Turnkey Projects", "Grid Integration"],
  },
  {
    title: "Automation Solutions",
    desc: "Smart automation to improve productivity, safety, and monitoring.",
    points: ["PLC & SCADA", "IoT Integration", "Smart Dashboards"],
  },
  {
    title: "Maintenance & AMC",
    desc: "Reliable maintenance services ensuring uninterrupted and optimized operations.",
    points: ["Preventive Maintenance", "24/7 Support", "Annual Contracts"],
  },
  {
    title: "Battery Storage",
    desc: "Advanced battery systems for backup power, load balancing, and grid stability.",
    points: ["Li-ion Systems", "Grid Storage", "UPS Solutions"],
  },
  {
    title: "EV Infrastructure",
    desc: "Scalable EV charging solutions for commercial and fleet operations.",
    points: ["Fast Chargers", "Fleet Charging", "Smart Billing"],
  },
  {
    title: "Smart Grid Solutions",
    desc: "Digital grid technologies for efficient power distribution and monitoring.",
    points: ["Grid Automation", "Demand Response", "Energy Analytics"],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function ServicePage() {
  return (
    <main className="w-full overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative bg-gray-900 text-white py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Powering Industries with <br /> Smart Energy Solutions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-3xl text-lg text-gray-300"
          >
            We design, build, and maintain future-ready energy and automation
            systems that enhance efficiency, sustainability, and long-term
            performance.
          </motion.p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#services"
            className="inline-block mt-10 bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition"
          >
            Explore Our Services
          </motion.a>
        </div>
      </section>

      {/* ================= TRUST / VALUE ================= */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Industry Expertise",
              desc: "Years of experience across energy & automation domains.",
            },
            {
              title: "Turnkey Execution",
              desc: "From planning to commissioning, we handle it all.",
            },
            {
              title: "Future Ready",
              desc: "Solutions built for scalability, compliance, and sustainability.",
            },
          ].map((v) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6"
            >
              <h3 className="text-xl font-bold text-gray-800">{v.title}</h3>
              <p className="mt-3 text-gray-600">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="bg-gradient-to-b from-sky-50 to-white px-6 py-28"
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              whileHover={{ y: -10 }}
              className="relative bg-white p-10 rounded-3xl shadow-xl transition cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-800 text-center">
                {service.title}
              </h3>

              <p className="mt-4 text-sm text-gray-600 text-center">
                {service.desc}
              </p>

              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                {service.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-sky-500 font-bold">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gray-900 text-white py-24 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          Ready to Power Your Next Project?
        </motion.h2>

        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Connect with our experts to design efficient, scalable, and
          future-ready energy solutions for your business.
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/contact"
          className="inline-block mt-8 bg-yellow-500 text-gray-900 font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition"
        >
          Get in Touch
        </motion.a>
      </section>
    </main>
  );
}
