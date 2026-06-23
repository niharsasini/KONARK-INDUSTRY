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
        background: "linear-gradient(145deg, #0d1424, #111827)",
        border: `1px solid ${hovered ? "rgba(0, 212, 255, 0.4)" : "#1a2740"}`,
        borderRadius: 20,
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-10px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 212, 255, 0.1), 0 0 60px rgba(0, 212, 255, 0.05)"
          : "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* ⭐ Rating Badge */}
      {product.rating && (
        <div style={{ position: "absolute", top: 12, right: 44, zIndex: 20, background: "rgba(2,8,23,0.75)", backdropFilter: "blur(8px)", padding: "4px 9px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          <Star size={12} color="#f59e0b" fill="#f59e0b" />
          <span>{product.rating}</span>
        </div>
      )}

      {/* Wishlist heart — always visible */}
      <button
        onClick={handleWishlist}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 20,
          width: 30, height: 30, borderRadius: "50%",
          background: inWishlist ? "rgba(239,68,68,0.18)" : "rgba(2,8,23,0.75)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${inWishlist ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }}
        aria-label="Toggle wishlist"
      >
        <Heart size={14} color={inWishlist ? "#ef4444" : "#cbd5e1"} fill={inWishlist ? "#ef4444" : "none"} />
      </button>

      {/* Top-left status badge — card stays fully opaque regardless of stock status */}
      {isUpcoming ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Upcoming
        </span>
      ) : !inStock ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Out of Stock
        </span>
      ) : isNew ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          New
        </span>
      ) : null}

      {/* 🖼️ Image area */}
      <div style={{
        position: "relative", height: 220, overflow: "hidden",
        background: "linear-gradient(145deg, #0a1628, #0d1a2e)",
      }}>
        {images[imgIndex]?.startsWith("http") ? (
          <Image
            src={images[imgIndex]}
            alt={`${product.name} - ${product.category}`}
            fill
            style={{
              objectFit: "contain", padding: 20,
              transform: hovered ? "scale(1.08)" : "scale(1)",
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
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.5s ease, opacity 0.3s ease",
            }}
          />
        )}
        {product.category && (
          <span style={{
            position: "absolute", bottom: 10, left: 10, zIndex: 5,
            background: "rgba(0, 212, 255, 0.1)", border: "1px solid rgba(0, 212, 255, 0.3)",
            backdropFilter: "blur(10px)", color: "#00d4ff",
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
                  background: i === imgIndex ? "#00d4ff" : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 📦 Body */}
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: "0 0 4px", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {product.shortDescription}
          </p>
        )}

        <p style={{ fontSize: 22, fontWeight: 800, color: "#00d4ff", margin: "6px 0 14px" }}>
          {formattedPrice}
        </p>

        {isUpcoming ? (
          <button
            onClick={(e) => { e.stopPropagation(); router.push("/contact?interest=" + product.slug); }}
            style={{ width: "100%", padding: "11px", background: "transparent", color: "#a855f7", border: "1.5px solid rgba(168, 85, 247, 0.5)", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.borderColor = "#a855f7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)"; }}
          >
            Register Interest
          </button>
        ) : !inStock ? (
          <button disabled style={{ width: "100%", padding: "11px", background: "#1a2740", color: "#64748b", cursor: "not-allowed", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
            Out of Stock
          </button>
        ) : product.type === "vehicle" ? (
          <button
            onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #00d4ff, #0ea5e9)", color: "#020817", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Book Test Ride
          </button>
        ) : product.type === "service" ? (
          <button
            onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Book Service
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s",
              background: added ? "#10b981" : "transparent",
              color: added ? "#fff" : "#00d4ff",
              border: added ? "none" : "1px solid rgba(0, 212, 255, 0.5)",
            }}
            onMouseEnter={(e) => { if (!added) { e.currentTarget.style.background = "#00d4ff"; e.currentTarget.style.color = "#020817"; } }}
            onMouseLeave={(e) => { if (!added) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00d4ff"; } }}
          >
            {added ? "Added! ✓" : "Add to Cart"}
          </button>
        )}

        {/* Make in India */}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #1a2740", fontSize: 10, color: "#FF9933", fontWeight: 600 }}>
          🇮🇳 Made in India
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
