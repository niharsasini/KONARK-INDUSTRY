"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  cardStyles,
  foldedCorner,
  productImage,
  productTitle,
  productDescription,
  priceTag,
  viewButton,
} from "./Product.styles";

const ProductCard = ({ product }) => {
  // Format price with commas
  const formattedPrice = product.price.toLocaleString();

  // Folded corner text
  const cornerText = "New"; // Can be dynamic later

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cardStyles}
    >
      {/* Folded corner */}
      <div className={foldedCorner}>
        <span className="text-white font-bold text-sm">{cornerText}</span>
      </div>

      {/* Image */}
      <img
        src={product.image}
        alt={`${product.name} - ${product.category}`}
        className={productImage}
      />

      {/* Content */}
      <div className="p-4">
        <h3 className={productTitle}>{product.name}</h3>
        {/* Category */}
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <p className={productDescription}>{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className={priceTag}>${formattedPrice}</span>
          <button className={viewButton}>View</button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
