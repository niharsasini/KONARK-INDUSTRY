"use client";

import React from "react";
import { motion } from "framer-motion";

const services = [
  "Solar Power Systems",
  "Industrial Machinery",
  "Energy Audits",
  "Power Plant Setup",
  "Automation Solutions",
  "Maintenance & AMC",
  "Battery Storage",
  "EV Infrastructure",
  "Smart Grid Solutions",
  "Energy Consulting",
];

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col items-center justify-center px-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center"
      >
        Our Services
      </motion.h1>

      {/* Cloud */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative bg-white shadow-2xl w-full max-w-5xl px-12 py-16"
        style={{
          borderRadius: "50% 50% 45% 45% / 55% 55% 45% 45%",
        }}
      >
        {/* Cloud bumps */}
        <div className="absolute -top-14 left-20 w-44 h-44 bg-white rounded-full shadow-xl"></div>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-white rounded-full shadow-xl"></div>
        <div className="absolute -top-14 right-20 w-44 h-44 bg-white rounded-full shadow-xl"></div>

        {/* Services inside cloud */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.08 }}
              className="bg-sky-100 text-gray-800 font-semibold py-3 px-4 rounded-full shadow-md cursor-pointer"
            >
              {service}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 max-w-2xl text-center text-gray-600 text-lg"
      >
        Integrated energy and industrial solutions designed to power efficiency,
        sustainability, and future-ready infrastructure.
      </motion.p>
    </div>
  );
}
