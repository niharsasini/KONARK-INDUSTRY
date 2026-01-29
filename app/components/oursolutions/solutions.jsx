"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { PRODUCTS } from "./data";
import { CAROUSEL_RESPONSIVE, TRUST_ITEMS } from "./constants";
import { FADE_UP, motionProps } from "./motion";

export default function OurSolutionsPage() {
  return (
    <main className="w-full bg-gradient-to-b from-gray-900 via-[#1e1e1e] to-gray-800 text-white overflow-hidden">
      {/* ================= HEADER ================= */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.p
            {...motionProps(0)}
            className="text-sm uppercase tracking-widest text-yellow-400"
          >
            Our Solutions
          </motion.p>

          <motion.h1
            {...motionProps(0.1)}
            className="mt-4 text-4xl md:text-5xl font-bold"
          >
            Advanced Battery & Energy Systems
          </motion.h1>

          <motion.p
            {...motionProps(0.2)}
            className="mt-6 max-w-3xl text-white/70"
          >
            We develop reliable, efficient, and future-ready energy storage
            solutions that power electric mobility and sustainable
            infrastructure.
          </motion.p>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6">
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
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-3 h-full bg-[#102a23] rounded-xl border border-yellow-400/20 p-6 flex flex-col shadow-xl hover:scale-[1.03] transition-transform"
              >
                <div className="flex justify-center mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    priority={product.id === 1}
                  />
                </div>

                <h3 className="text-lg font-bold text-yellow-400">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-white/70">
                  {product.description}
                </p>

                <ul className="mt-3 space-y-1.5 text-sm">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-yellow-400">•</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-white/60">
                  <strong className="text-white">Use Case:</strong>{" "}
                  {product.marketFit}
                </p>

                <div className="mt-auto flex gap-3 pt-5">
                  <button className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded-md font-medium hover:bg-yellow-300 transition">
                    Enquire
                  </button>
                  <button className="flex-1 border border-yellow-400 py-2 rounded-md hover:bg-yellow-400/20 transition">
                    Specs
                  </button>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-[#081612] py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {TRUST_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              variants={FADE_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="border-l-2 border-yellow-400 pl-6"
            >
              <h4 className="font-semibold text-yellow-400 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-white/70">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
