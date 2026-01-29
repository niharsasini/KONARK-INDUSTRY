"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#1a2433] via-[#111827] to-[#0b1220] text-gray-300 overflow-hidden">
      {/* Animated energy line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent origin-center"
      />

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Brand / Vision */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h2 className="text-2xl font-semibold tracking-wide text-white">
            KONARK INDUSTRY
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            A next-generation EV & battery technology company delivering
            high-performance, safe, and sustainable energy solutions for India.
          </p>

          {/* animated indicator */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 0.8 }}
            className="h-[2px] bg-orange-500"
          />
        </motion.div>

        {/* Solutions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h3 className="mb-6 text-xs font-semibold tracking-widest text-orange-400 uppercase">
            Solutions
          </h3>
          <ul className="space-y-4 text-sm">
            {[
              "Advanced EV Batteries",
              "Energy Storage Systems",
              "Battery Management Systems",
              "Charging Infrastructure",
            ].map((item) => (
              <li
                key={item}
                className="relative pl-4 hover:text-white transition-colors"
              >
                <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Company */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h3 className="mb-6 text-xs font-semibold tracking-widest text-orange-400 uppercase">
            Company
          </h3>
          <ul className="space-y-4 text-sm">
            {["About Konark", "Technology", "Careers", "Partners"].map(
              (item) => (
                <li key={item} className="hover:text-white transition-colors">
                  {item}
                </li>
              ),
            )}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h3 className="text-xs font-semibold tracking-widest text-orange-400 uppercase">
            Contact
          </h3>

          <p className="flex gap-3 text-sm">
            <MapPinIcon className="w-5 h-5 text-orange-500" />
            Bhubaneswar, Odisha, India
          </p>

          <p className="flex gap-3 text-sm">
            <PhoneIcon className="w-5 h-5 text-orange-500" />
            +91 9XXXXXXXXX
          </p>

          <p className="flex gap-3 text-sm">
            <EnvelopeIcon className="w-5 h-5 text-orange-500" />
            info@konarkindustry.com
          </p>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Konark Industry • Powering Tomorrow
      </div>
    </footer>
  );
}
