"use client";
import React, { memo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";
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
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef(null);

  const images = product.images?.length > 0 ? product.images : [product.image];
  const hasMultipleImages = images.length > 1;

  const handleMouseEnter = () => {
    if (!hasMultipleImages) return;
    intervalRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 1200);
  };
  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setImgIndex(0);
  };

  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString()}`
      : "Price on Request";

  const goToDetails = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({
      id: product.id || product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price || 0,
      image: product.images?.[0] || product.image || "",
      category: product.category || "",
      type: product.type || "product",
    });
    toast.success(`${product.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggle(product.slug);
    const inList = isInWishlist(product.slug);
    toast(inList ? "Removed from wishlist" : `${product.name} saved ❤️`);
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

      {/* Out of Stock overlay */}
      {product.inStock === false && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "flex-start", padding: 12, zIndex: 15, pointerEvents: "none" }}>
          <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4 }}>Out of Stock</span>
        </div>
      )}

      {/* 🖼️ Product Image (Perfect Fit) */}
      <div
        className={productImageWrapper}
        style={{ position: "relative" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={images[imgIndex]}
          alt={`${product.name} - ${product.category}`}
          className={productImage}
          style={{ transition: "opacity 0.3s ease" }}
        />
        {hasMultipleImages && (
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, zIndex: 5 }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i); }}
                style={{
                  width: i === imgIndex ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === imgIndex ? "#00d4ff" : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
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

          {product.inStock === false ? (
            <button disabled style={{ ...viewButton, background: "#1e2d40", color: "#64748b", cursor: "not-allowed", border: "none" }}>
              Out of Stock
            </button>
          ) : product.type === "vehicle" ? (
            <button
              className={viewButton}
              style={{ background: "#00d4ff", color: "#0a0f1e", border: "none" }}
              onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            >
              Book Test Ride
            </button>
          ) : product.type === "service" ? (
            <button
              className={viewButton}
              style={{ background: "#7c3aed", color: "#fff", border: "none" }}
              onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            >
              Book Service
            </button>
          ) : (
            <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
              <button
                className={viewButton}
                style={{ flex: 1, background: added ? "#10b981" : undefined }}
                onClick={handleAddToCart}
              >
                {added ? "Added! ✓" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #1e2d40", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: isInWishlist(product.slug) ? "#ef4444" : "#64748b", transition: "all 0.15s" }}
              >
                {isInWishlist(product.slug) ? "❤️" : "🤍"}
              </button>
            </div>
          )}
        </div>

        {/* Make in India */}
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #1e2d40", fontSize: 10, color: "#FF9933", fontWeight: 600 }}>
          🇮🇳 Made in India
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
