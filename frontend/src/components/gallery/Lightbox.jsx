"use client";
import { useEffect } from "react";
import { CATEGORY_LABELS, youtubeId } from "./media";

export default function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNav(-1);
      else if (e.key === "ArrowRight") onNav(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNav]);

  const yt = item.media_type === "video" ? youtubeId(item.url) : null;
  const circle = {
    position: "absolute", width: 44, height: 44, background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)", borderRadius: "50%", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", fontSize: 18, border: "none", color: "#0C1A2E",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 2,
  };

  return (
    <div
      role="dialog" aria-modal="true" aria-label={item.title}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(12,26,46,0.92)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "min(900px, 95vw)", maxHeight: "90vh", borderRadius: 24, overflow: "hidden", background: "#fff", boxShadow: "0 40px 80px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column" }}
      >
        <button onClick={onClose} aria-label="Close" style={{ ...circle, top: 16, right: 16, width: 40, height: 40, fontSize: 20 }}>✕</button>

        <div style={{ background: "#0C1A2E", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 0 }}>
          {item.media_type === "video" ? (
            yt ? (
              <iframe
                key={item.id}
                src={`https://www.youtube.com/embed/${yt}?autoplay=1&rel=0`}
                title={item.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ width: "100%", height: "min(480px, 56vw)", border: 0, display: "block" }}
              />
            ) : (
              <video key={item.id} src={item.url} poster={item.thumbnail_url || undefined} controls autoPlay playsInline style={{ width: "100%", height: "min(480px, 56vw)", background: "#000", display: "block" }} />
            )
          ) : (
            <img src={item.url} alt={item.title} style={{ width: "100%", height: "auto", maxHeight: "70vh", objectFit: "contain", display: "block" }} />
          )}
        </div>

        <div style={{ padding: "20px 24px", background: "#fff", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0C1A2E" }}>{item.title}</div>
            {item.description && <div style={{ fontSize: 14, color: "#4A6785", marginTop: 6, lineHeight: 1.6 }}>{item.description}</div>}
          </div>
          <span style={{ background: "rgba(13,81,140,0.08)", color: "#0D518C", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>
            {CATEGORY_LABELS[item.category] || item.category}
          </span>
        </div>

        {items.length > 1 && (
          <>
            <button className="gal-arrow" onClick={() => onNav(-1)} aria-label="Previous" style={{ ...circle, top: "42%", left: 16, transform: "translateY(-50%)" }}>←</button>
            <button className="gal-arrow" onClick={() => onNav(1)} aria-label="Next" style={{ ...circle, top: "42%", right: 16, transform: "translateY(-50%)" }}>→</button>
          </>
        )}
      </div>
    </div>
  );
}
