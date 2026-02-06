"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { PRODUCTS } from "./solutions.data";
import { CAROUSEL_RESPONSIVE, TRUST_ITEMS } from "./solutions.constants";

const stats = [
  { label: "Energy Solutions", value: "15+" },
  { label: "Industries Served", value: "10+" },
  { label: "Deployments", value: "100+" },
  { label: "Years of Innovation", value: "8+" },
];

export default function OurSolutionsPage() {
  return (
    <main className="w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* ================= HEADER ================= */}
      <section className="pt-24 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base font-semibold text-blue-600 uppercase tracking-wide"
          >
            Our Solutions
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
          >
            Advanced Battery & Energy Systems
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl sm:max-w-2xl mx-auto text-gray-600 text-base sm:text-lg"
          >
            We design reliable, efficient, and future-ready energy storage
            solutions that support electric mobility and sustainable
            infrastructure worldwide.
          </motion.p>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {item.value}
              </h3>
              <p className="mt-2 text-gray-500 text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel
            responsive={CAROUSEL_RESPONSIVE}
            infinite
            autoPlay
            autoPlaySpeed={5000}
            arrows={false}
            showDots={false}
          >
            {PRODUCTS.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mx-2 h-full bg-white rounded-xl border border-gray-200 p-4 flex flex-col shadow-sm hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="flex justify-center mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    priority={product.id === 1}
                    className="max-h-36 w-auto object-contain"
                  />
                </div>

                {/* TITLE */}
                <h3 className="text-base font-semibold text-gray-900">
                  {product.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-1 text-sm text-gray-600 leading-snug">
                  {product.description}
                </p>

                {/* FEATURES */}
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* USE CASE */}
                <p className="mt-2 text-xs text-gray-500">
                  <strong className="text-gray-700">Use Case:</strong>{" "}
                  {product.marketFit}
                </p>

                {/* ACTIONS */}
                <div className="mt-auto flex gap-2 pt-4">
                  <button className="flex-1 rounded-md bg-blue-600 py-1.5 text-sm text-white font-medium hover:bg-blue-700 transition">
                    Enquire
                  </button>
                  <button className="flex-1 rounded-md border border-gray-300 py-1.5 text-sm hover:bg-gray-100 transition">
                    Specs
                  </button>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-white py-16 sm:py-20 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-l-4 border-blue-600 pl-4"
            >
              <h4 className="font-semibold text-blue-600 mb-1 text-base">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
