"use client";
import { motion } from "framer-motion";
import { memo } from "react";

function StatCard({ value, label }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
      className="group relative rounded-3xl p-[1px]"
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-purple-500/40 blur-sm opacity-70 group-hover:opacity-100 transition" />

      <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl group-hover:shadow-2xl transition">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

        <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {value}
        </h3>

        <p className="mt-3 text-sm md:text-base text-gray-500 font-medium">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export default memo(StatCard);
