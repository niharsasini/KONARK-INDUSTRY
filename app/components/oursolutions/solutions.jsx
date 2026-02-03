"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { PRODUCTS } from "./data";
import { CAROUSEL_RESPONSIVE, TRUST_ITEMS } from "./constants";

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
            className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {item.value}
              </h3>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel
            responsive={CAROUSEL_RESPONSIVE}
            infinite
            autoPlay
            autoPlaySpeed={5000}
            arrows={false}
            showDots
          >
            {PRODUCTS.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-2 sm:mx-3 h-full bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex flex-col shadow-lg hover:shadow-2xl hover:scale-[1.03] transition"
              >
                <div className="flex justify-center mb-4 sm:mb-5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    priority={product.id === 1}
                    className="max-h-44 sm:max-h-52 md:max-h-60 w-auto object-contain"
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  {product.description}
                </p>

                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                  <strong className="text-gray-700">Use Case:</strong>{" "}
                  {product.marketFit}
                </p>

                <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
                  <button className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition">
                    Enquire
                  </button>
                  <button className="flex-1 rounded-full border border-gray-300 py-2 hover:bg-gray-100 transition">
                    Specs
                  </button>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-white py-16 sm:py-24 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-l-4 border-blue-600 pl-4 sm:pl-6"
            >
              <h4 className="font-semibold text-blue-600 mb-1 sm:mb-2 text-base sm:text-lg">
                {item.title}
              </h4>
              <p className="text-sm sm:text-base text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
