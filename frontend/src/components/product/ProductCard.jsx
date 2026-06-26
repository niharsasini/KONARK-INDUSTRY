"use client";
import React, { memo, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Heart } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef(null);

  const images = product.images?.length > 0 ? product.images : [product.image];
  const hasMultipleImages = images.length > 1;
  const inWishlist = isInWishlist(product.slug);

  // Backend returns snake_case (is_new, in_stock); static ProductData.js uses camelCase.
  // Normalize here so both sources render badges/CTAs correctly.
  const isNew = product.is_new ?? product.isNew ?? false;
  const inStock = product.in_stock ?? product.inStock ?? true;
  const isUpcoming = product.isUpcoming ?? product.is_upcoming ?? false;

  const handleMouseEnter = () => {
    setHovered(true);
    if (!hasMultipleImages) return;
    intervalRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 1200);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    clearInterval(intervalRef.current);
    setImgIndex(0);
  };

  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString()}`
      : isUpcoming
      ? "Coming Soon"
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
    toast(inWishlist ? "Removed from wishlist" : `${product.name} saved ❤️`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={goToDetails}
      style={{
        position: "relative",
        cursor: "pointer",
        background: "#ffffff",
        border: `1px solid ${hovered ? "rgba(15,76,129,0.3)" : "#e8dfd0"}`,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 20px 60px rgba(26,15,0,0.12), 0 0 0 1px rgba(15,76,129,0.1)"
          : "0 2px 8px rgba(26,15,0,0.06)",
      }}
    >
      {/* ⭐ Rating Badge */}
      {product.rating && (
        <div style={{ position: "absolute", top: 12, right: 44, zIndex: 20, background: "rgba(26,15,0,0.6)", backdropFilter: "blur(8px)", padding: "4px 9px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <Star size={12} color="#c17f24" fill="#c17f24" />
          <span>{product.rating}</span>
        </div>
      )}

      {/* Wishlist heart — always visible */}
      <button
        onClick={handleWishlist}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 20,
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          border: `1px solid ${inWishlist ? "rgba(192,57,43,0.4)" : "#e8dfd0"}`,
          boxShadow: "0 2px 8px rgba(26,15,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }}
        aria-label="Toggle wishlist"
      >
        <Heart size={14} color={inWishlist ? "#c0392b" : "#8c7a66"} fill={inWishlist ? "#c0392b" : "none"} />
      </button>

      {/* Top-left status badge — card stays fully opaque regardless of stock status */}
      {isUpcoming ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "#5b21b6", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Upcoming
        </span>
      ) : !inStock ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Out of Stock
        </span>
      ) : isNew ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "#1a7a4a", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          New
        </span>
      ) : null}

      {/* 🖼️ Image area */}
      <div style={{
        position: "relative", height: 220, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg, #f9f4ec, #f5f0e8)",
      }}>
        {images[imgIndex]?.startsWith("http") ? (
          <Image
            src={images[imgIndex]}
            alt={`${product.name} - ${product.category}`}
            fill
            style={{
              objectFit: "contain", padding: 20,
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.5s ease, opacity 0.3s ease",
            }}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <img
            src={images[imgIndex]}
            alt={`${product.name} - ${product.category}`}
            style={{
              width: "100%", height: "100%", objectFit: "contain", padding: 20,
              boxSizing: "border-box",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.5s ease, opacity 0.3s ease",
            }}
          />
        )}
        {product.category && (
          <span style={{
            position: "absolute", bottom: 10, left: 10, zIndex: 5,
            background: "rgba(15,76,129,0.1)", border: "1px solid rgba(15,76,129,0.2)",
            color: "#0f4c81",
            fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {product.category}
          </span>
        )}
        {hasMultipleImages && (
          <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", gap: 4, zIndex: 5 }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i); }}
                style={{
                  width: i === imgIndex ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === imgIndex ? "#0f4c81" : "rgba(26,15,0,0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 📦 Body */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        {product.category && (
          <p style={{ fontSize: 11, color: "#0f4c81", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
            {product.category}
          </p>
        )}

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a0f00", margin: "0 0 6px", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p style={{ fontSize: 12, color: "#8c7a66", margin: "0 0 12px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {product.shortDescription}
          </p>
        )}

        <div style={{ marginTop: "auto" }}>
        <p style={{
          fontSize: typeof product.price === "number" && product.price > 0 ? 22 : isUpcoming ? 15 : 13,
          fontWeight: typeof product.price === "number" && product.price > 0 ? 800 : 700,
          color: typeof product.price === "number" && product.price > 0 ? "#c17f24" : isUpcoming ? "#5b21b6" : "#8c7a66",
          margin: "0 0 12px",
        }}>
          {formattedPrice}
        </p>

        {isUpcoming ? (
          <button
            onClick={(e) => { e.stopPropagation(); router.push("/contact?interest=" + product.slug); }}
            style={{ width: "100%", height: 44, padding: "0 11px", background: "transparent", color: "#5b21b6", border: "2px solid #5b21b6", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#5b21b6"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5b21b6"; }}
          >
            Register Interest
          </button>
        ) : !inStock ? (
          <button disabled style={{ width: "100%", height: 44, padding: "0 11px", background: "#ede4d5", color: "#8c7a66", cursor: "not-allowed", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
            Out of Stock
          </button>
        ) : product.type === "vehicle" ? (
          <button
            onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            style={{ width: "100%", height: 44, padding: "0 11px", background: "linear-gradient(135deg, #0f4c81, #0a3460)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(15,76,129,0.25)", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,76,129,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,76,129,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Book Test Ride
          </button>
        ) : product.type === "service" ? (
          <button
            onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            style={{ width: "100%", height: 44, padding: "0 11px", background: "linear-gradient(135deg, #c17f24, #9a6419)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(193,127,36,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            Book Service
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%", height: 44, padding: "0 11px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s",
              background: added ? "#1a7a4a" : "transparent",
              color: added ? "#fff" : "#0f4c81",
              border: added ? "none" : "2px solid #0f4c81",
            }}
            onMouseEnter={(e) => { if (!added) { e.currentTarget.style.background = "#0f4c81"; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={(e) => { if (!added) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f4c81"; } }}
          >
            {added ? "Added! ✓" : "Add to Cart"}
          </button>
        )}

        {/* Made in India */}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #e8dfd0", fontSize: 10, color: "#8c7a66", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          🇮🇳 Made in India
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
