"use client";
import React, { memo, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Heart } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store";
import { useAuthGate } from "@/hooks/useAuthGate";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { requireAuth } = useAuthGate();
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
    requireAuth(() => {
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
    }, `/products/${product.slug}`);
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
        background: "linear-gradient(160deg, #162952 0%, #132447 100%)",
        border: `1px solid ${hovered ? "rgba(79,195,247,0.2)" : "rgba(79,195,247,0.07)"}`,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 50px rgba(11,17,32,0.6), 0 0 0 1px rgba(79,195,247,0.08)"
          : "0 4px 20px rgba(11,17,32,0.5)",
      }}
    >
      {/* Wishlist heart — always visible */}
      <button
        onClick={handleWishlist}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 20,
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(10,14,26,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(92,103,149,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.borderColor = "rgba(79,195,247,0.4)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(92,103,149,0.2)"; }}
        aria-label="Toggle wishlist"
      >
        <Heart size={14} color={inWishlist ? "#FF7043" : "#5C6795"} fill={inWishlist ? "#FF7043" : "none"} />
      </button>

      {/* Top-left status badge — card stays fully opaque regardless of stock status */}
      {isUpcoming ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "rgba(92,103,149,0.8)", color: "#E8F4FF", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Upcoming
        </span>
      ) : !inStock ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "#FF7043", color: "#E8F4FF", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Out of Stock
        </span>
      ) : isNew ? (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 20, background: "#34C78A", color: "#0A0E1A", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          New
        </span>
      ) : null}

      {/* 🖼️ Image area */}
      <div className="product-card-img" style={{
        position: "relative", height: 220, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg, #0F1A2E, #162952)",
      }}>
        {images[imgIndex]?.startsWith("http") ? (
          <Image
            src={images[imgIndex]}
            alt={`${product.name} - ${product.category}`}
            fill
            style={{
              objectFit: "contain", padding: 20,
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.6s ease, opacity 0.3s ease",
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
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.6s ease, opacity 0.3s ease",
            }}
          />
        )}
        {product.category && (
          <span style={{
            position: "absolute", bottom: 10, left: 10, zIndex: 5,
            background: "rgba(13,81,140,0.8)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(79,195,247,0.25)",
            color: "#4FC3F7",
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            textTransform: "uppercase", letterSpacing: "0.8px",
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
                  background: i === imgIndex ? "#4FC3F7" : "rgba(10,14,26,0.4)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
        {product.rating && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4,
            background: "linear-gradient(to top, rgba(10,14,26,0.75), transparent)",
            padding: "24px 12px 8px", display: "flex", justifyContent: "flex-end",
            alignItems: "center", gap: 4,
          }}>
            <Star size={12} color="#F4C430" fill="#F4C430" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(232,244,255,0.9)" }}>{product.rating}</span>
          </div>
        )}
      </div>

      {/* 📦 Body */}
      <div className="product-card-body" style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        {product.category && (
          <p style={{ fontSize: 9, color: "#4FC3F7", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>
            {product.category}
          </p>
        )}

        <h3 className="product-card-name" style={{ fontSize: 16, fontWeight: 700, color: "#E8F4FF", margin: "0 0 6px", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p style={{ fontSize: 12, color: "#4A5880", margin: "0 0 12px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {product.shortDescription}
          </p>
        )}

        <div style={{ marginTop: "auto" }}>
        <p className="product-card-price" style={{
          fontSize: typeof product.price === "number" && product.price > 0 ? 22 : isUpcoming ? 15 : 13,
          fontWeight: typeof product.price === "number" && product.price > 0 ? 800 : 700,
          color: typeof product.price === "number" && product.price > 0 ? "#F4C430" : isUpcoming ? "#5C6795" : "#4A5880",
          margin: "0 0 12px",
        }}>
          {formattedPrice}
        </p>

        {isUpcoming ? (
          <button
            className="product-card-btn"
            onClick={(e) => { e.stopPropagation(); router.push("/contact?interest=" + product.slug); }}
            style={{ width: "100%", height: 44, padding: "0 11px", background: "transparent", color: "#7B8DB8", border: "1.5px solid rgba(92,103,149,0.5)", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(92,103,149,0.12)"; e.currentTarget.style.color = "#E8F4FF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7B8DB8"; }}
          >
            Register Interest
          </button>
        ) : !inStock ? (
          <button className="product-card-btn" disabled style={{ width: "100%", height: 44, padding: "0 11px", background: "var(--bg-surface)", color: "var(--text-subtle)", cursor: "not-allowed", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
            Out of Stock
          </button>
        ) : product.type === "vehicle" ? (
          <button
            className="product-card-btn"
            onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            style={{ width: "100%", height: 44, padding: "0 11px", background: "linear-gradient(135deg, #0D518C, #4FC3F7)", color: "#E8F4FF", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(13,81,140,0.3)", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 22px rgba(13,81,140,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(13,81,140,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Book Test Ride
          </button>
        ) : product.type === "service" ? (
          <button
            className="product-card-btn"
            onClick={(e) => { e.stopPropagation(); goToDetails(); }}
            style={{ width: "100%", height: 44, padding: "0 11px", background: "linear-gradient(135deg, #F4C430, #FF8F00)", color: "#0B1120", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 22px rgba(244,196,48,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            Book Service
          </button>
        ) : (
          <button
            className="product-card-btn"
            onClick={handleAddToCart}
            style={{
              width: "100%", height: 44, padding: "0 11px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s",
              background: added ? "#34C78A" : "transparent",
              color: added ? "#0B1120" : "#4FC3F7",
              border: added ? "none" : "1.5px solid rgba(13,81,140,0.38)",
            }}
            onMouseEnter={(e) => { if (!added) { e.currentTarget.style.background = "rgba(13,81,140,0.2)"; e.currentTarget.style.borderColor = "#4FC3F7"; } }}
            onMouseLeave={(e) => { if (!added) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(13,81,140,0.38)"; } }}
          >
            {added ? "Added! ✓" : "Add to Cart"}
          </button>
        )}

        {/* Made in India */}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(92,103,149,0.1)", fontSize: 10, color: "#4A5880", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          🇮🇳 Made in India
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
