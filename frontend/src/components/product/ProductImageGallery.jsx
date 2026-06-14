"use client";
import { useState } from "react";

/* Image gallery + zoom lightbox used on the Flipkart-style product detail page */
export default function ProductImageGallery({ images, productName, isNew }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340, position: "relative", cursor: "zoom-in" }}
        onClick={() => setIsZoomed(true)}
      >
        {isNew && (
          <span style={{ position: "absolute", top: 16, left: 16, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, textTransform: "uppercase" }}>NEW</span>
        )}
        <span style={{ position: "absolute", top: 16, right: 16, fontSize: 11, color: "#64748b", background: "rgba(0,0,0,0.3)", padding: "4px 8px", borderRadius: 6 }}>🔍 Click to zoom</span>
        <span style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>● In Stock</span>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "1px solid #1e2d40", borderRadius: "50%", width: 32, height: 32, color: "#f1f5f9", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % images.length); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "1px solid #1e2d40", borderRadius: "50%", width: 32, height: 32, color: "#f1f5f9", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </>
        )}
        <img src={images[activeImage]} alt={productName} style={{ maxHeight: 280, maxWidth: "85%", objectFit: "contain", filter: "drop-shadow(0 4px 20px rgba(0,212,255,0.15))" }} />
      </div>

      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              style={{ width: 64, height: 64, borderRadius: 8, border: `2px solid ${activeImage === idx ? "#00d4ff" : "#1e2d40"}`, background: "#111827", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, transition: "border-color 0.2s" }}
            >
              <img src={img} alt={`View ${idx + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </button>
          ))}
        </div>
      )}

      {isZoomed && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setIsZoomed(false)}
        >
          <button onClick={() => setIsZoomed(false)} style={{ position: "absolute", top: 20, right: 24, background: "transparent", border: "1px solid #1e2d40", color: "#f1f5f9", fontSize: 20, width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid #1e2d40", borderRadius: "50%", width: 44, height: 44, color: "#f1f5f9", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % images.length); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid #1e2d40", borderRadius: "50%", width: 44, height: 44, color: "#f1f5f9", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            </>
          )}
          <img src={images[activeImage]} alt={productName} style={{ maxHeight: "85vh", maxWidth: "90vw", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
