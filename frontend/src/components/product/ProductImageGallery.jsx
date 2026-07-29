"use client";
import { useState } from "react";
import Image from "next/image";

/* Image gallery + zoom lightbox used on the Flipkart-style product detail page */
export default function ProductImageGallery({ images, productName, isNew }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{ background: "linear-gradient(135deg, var(--bg-surface), var(--bg-card))", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 20, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340, position: "relative", cursor: "zoom-in" }}
        onClick={() => setIsZoomed(true)}
      >
        {isNew && (
          <span style={{ position: "absolute", top: 16, left: 16, background: "var(--navy)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, textTransform: "uppercase" }}>NEW</span>
        )}
        <span style={{ position: "absolute", top: 16, right: 16, fontSize: 11, color: "var(--text-subtle)", background: "rgba(0,0,0,0.3)", padding: "4px 8px", borderRadius: 6 }}>🔍 Click to zoom</span>
        {images.length > 1 && (
          <span style={{ position: "absolute", bottom: 16, right: 16, fontSize: 11, color: "var(--text-muted)", background: "rgba(0,0,0,0.4)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>{activeImage + 1} / {images.length}</span>
        )}
        <span style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(52,199,138,0.12)", border: "1px solid rgba(52,199,138,0.3)", color: "var(--green)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>● In Stock</span>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "1px solid var(--border-light)", borderRadius: "50%", width: 32, height: 32, color: "var(--text-heading)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % images.length); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "1px solid var(--border-light)", borderRadius: "50%", width: 32, height: 32, color: "var(--text-heading)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </>
        )}
        <div style={{ position: "relative", width: "85%", height: 280, filter: "drop-shadow(0 4px 20px rgba(15,76,129,0.15))" }}>
          <Image src={images[activeImage]} alt={productName} fill style={{ objectFit: "contain" }} priority sizes="(max-width: 768px) 90vw, 45vw" />
        </div>
      </div>

      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              style={{ width: 64, height: 64, borderRadius: 12, border: `2px solid ${activeImage === idx ? "var(--sky)" : "rgba(92,103,149,0.15)"}`, background: "rgba(22,41,82,0.5)", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, transition: "border-color 0.2s", position: "relative" }}
            >
              <Image src={img} alt={`View ${idx + 1}`} fill style={{ objectFit: "contain", padding: 4 }} />
            </button>
          ))}
        </div>
      )}

      {isZoomed && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setIsZoomed(false)}
        >
          <button onClick={() => setIsZoomed(false)} style={{ position: "absolute", top: 20, right: 24, background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-heading)", fontSize: 20, width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid var(--border-light)", borderRadius: "50%", width: 44, height: 44, color: "var(--text-heading)", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % images.length); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid var(--border-light)", borderRadius: "50%", width: 44, height: 44, color: "var(--text-heading)", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            </>
          )}
          <div style={{ position: "relative", width: "90vw", height: "85vh" }} onClick={(e) => e.stopPropagation()}>
            <Image src={images[activeImage]} alt={productName} fill style={{ objectFit: "contain" }} />
          </div>
        </div>
      )}
    </div>
  );
}
