"use client";
import { motion } from "framer-motion";
import { memo } from "react";

const slideVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 80 : -80,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir < 0 ? 80 : -80,
    scale: 0.97,
  }),
};

function TestimonialCard({ testimonial, index, dir }) {
  return (
    <motion.div
      key={index}
      custom={dir}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="relative max-w-4xl"
    >
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-purple-500/40 blur-xl opacity-70" />

      <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] px-14 py-16 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.25)]">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-5xl shadow-xl"
        >
          “
        </motion.div>

        <p className="mt-10 text-lg md:text-xl text-gray-700 leading-relaxed">
          {testimonial.message}
        </p>

        <div className="mt-12">
          <h4 className="text-xl font-semibold text-gray-900">
            {testimonial.name}
          </h4>
          <p className="text-blue-600 text-sm font-medium">
            {testimonial.role} • {testimonial.company}
          </p>
          <p className="text-xs text-gray-500 mt-1">{testimonial.location}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(TestimonialCard);
