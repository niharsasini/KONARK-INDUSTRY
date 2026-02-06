"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import {
  cardStyles,
  foldedCorner,
  foldedCornerText,
  productImageWrapper,
  productImage,
  productTitle,
  productDescription,
  priceTag,
  viewButton,
} from "./Product.styles";

const ProductCard = ({ product }) => {
  const router = useRouter();

  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString()}`
      : "Price on Request";

  const goToDetails = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${cardStyles} relative cursor-pointer`}
      onClick={goToDetails}
    >
      {/* ⭐ Rating Badge */}
      {product.rating && (
        <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-white shadow-lg">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          <span>{product.rating}</span>
        </div>
      )}

      {/* 🟨 Paper Fold NEW Corner */}
      {product.isNew && (
        <>
          <div className={foldedCorner}></div>
          <span className={foldedCornerText}>NEW</span>
        </>
      )}

      {/* 🖼️ Product Image (Perfect Fit) */}
      <div className={productImageWrapper}>
        <img
          src={product.image}
          alt={`${product.name} - ${product.category}`}
          className={productImage}
        />
      </div>

      {/* 📦 Content */}
      <div className="p-4">
        <h3 className={productTitle}>{product.name}</h3>

        <p className="text-sm text-gray-500 mb-2">{product.category}</p>

        {product.shortDescription && (
          <p className={`${productDescription} line-clamp-2`}>
            {product.shortDescription}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className={priceTag}>{formattedPrice}</span>

          <button
            className={viewButton}
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
