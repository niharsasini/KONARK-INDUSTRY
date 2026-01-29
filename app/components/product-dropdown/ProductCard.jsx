"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cardHover } from "./animation";

const ProductCard = ({ item }) => {
  return (
    <motion.div
      {...cardHover}
      className="
        h-[320px] 
        flex flex-col
        group rounded-2xl
        bg-[#f7f8fa] hover:bg-white
        border border-gray-100
        hover:shadow-xl
        cursor-pointer
        overflow-hidden
      "
    >
      {/* Image (fixed height) */}
      <div className="relative h-[150px] shrink-0 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority
        />
      </div>

      {/* Content (flex grow) */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug line-clamp-2">
            {item.title}
          </h3>
          {item.badge && (
            <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
              {item.badge}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Spacer pushes content bottom-aligned */}
        <div className="flex-1" />

        {/* Optional CTA / indicator */}
        <span className="mt-3 text-xs font-medium text-gray-400">
          Explore →
        </span>
      </div>
    </motion.div>
  );
};

export default ProductCard;
