"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const benefits = [
  {
    title: "Strong Brand Association",
    desc: "Partner with a trusted name in energy, automation, and industrial solutions.",
  },
  {
    title: "Attractive Margins",
    desc: "Competitive pricing models with sustainable long-term profitability.",
  },
  {
    title: "Technical Support",
    desc: "End-to-end technical assistance, training, and documentation.",
  },
  {
    title: "Growth Opportunities",
    desc: "Access new markets, projects, and large-scale enterprise clients.",
  },
];

const partnerTypes = [
  "Dealers & Distributors",
  "EPC Contractors",
  "System Integrators",
  "Industrial Consultants",
  "Technology Providers",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function PartnerWithUsPage() {
  return (
    <main className="w-full overflow-hidden">
      {/* HERO */}
      <section className="bg-gray-900 text-white py-28 px-6 md:px-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Partner With KONARK
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto"
        >
          Join hands with KONARK to deliver innovative energy, automation, and
          industrial solutions that power sustainable growth and future-ready
          infrastructure.
        </motion.p>
      </section>

      {/* WHY PARTNER */}
      <section className="bg-white py-24 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Why Partner With Us
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-4 text-gray-600 max-w-3xl mx-auto"
          >
            We believe in long-term collaborations that create value for both
            partners and customers through innovation, reliability, and trust.
          </motion.p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={item}
                whileHover={{ y: -8 }}
                className="p-8 rounded-2xl shadow-xl border bg-white transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHO CAN PARTNER */}
      <section className="bg-gradient-to-b from-sky-50 to-white py-24 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center"
          >
            Who Can Partner With Us
          </motion.h2>

          <motion.ul
            variants={item}
            className="mt-12 grid sm:grid-cols-2 gap-6 text-gray-700"
          >
            {partnerTypes.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-md"
              >
                <span className="text-sky-500 font-bold text-xl">✓</span>
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* PARTNERSHIP PROCESS */}
      <section className="bg-white py-24 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center"
          >
            Partnership Process
          </motion.h2>

          <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
            {[
              "Submit Application",
              "Evaluation & Discussion",
              "Agreement & Onboarding",
              "Go-to-Market Execution",
            ].map((step, i) => (
              <motion.div
                key={step}
                variants={item}
                className="p-6 rounded-xl border shadow-sm bg-white"
              >
                <div className="text-3xl font-bold text-sky-500 mb-4">
                  {i + 1}
                </div>
                <p className="font-medium text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-24 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          Let’s Build the Future Together
        </motion.h2>

        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Become a KONARK partner and unlock new opportunities in energy,
          automation, and industrial innovation.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10"
        >
          <Link
            href="/contactus"
            className="inline-block bg-yellow-500 text-gray-900 font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition"
          >
            Apply for Partnership
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
