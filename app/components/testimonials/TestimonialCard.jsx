"use client";
import { motion } from "framer-motion";
import { memo } from "react";

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir < 0 ? 80 : -80, scale: 0.97 }),
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
      className="relative max-w-md sm:max-w-2xl lg:max-w-4xl px-2 sm:px-6"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-purple-500/40 blur-xl opacity-70" />

      <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] px-6 sm:px-14 py-12 sm:py-16 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl sm:text-5xl shadow-lg"
        >
          “
        </motion.div>

        <p className="mt-8 sm:mt-10 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
          {testimonial.message}
        </p>

        <div className="mt-8 sm:mt-12">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
            {testimonial.name}
          </h4>
          <p className="text-blue-600 text-sm sm:text-base font-medium">
            {testimonial.role} • {testimonial.company}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(TestimonialCard);
