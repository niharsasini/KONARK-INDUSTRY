"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_LABELS, thumbFor, youtubeId } from "./media";

const CSS = `
@keyframes lb-spin { to { transform: rotate(360deg); } }
.lb-btn { position: absolute; z-index: 3; width: 44px; height: 44px; border-radius: 50%; border: 0; cursor: pointer; display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.14); color: #fff; font-size: 20px; transition: background 0.2s ease, transform 0.2s ease; }
.lb-btn:hover { background: rgba(255,255,255,0.28); }
.lb-btn:focus-visible { outline: 3px solid #0EA5E9; outline-offset: 2px; }
.lb-strip { display: flex; gap: 8px; overflow-x: auto; padding: 4px 12px; scrollbar-width: thin; justify-content: safe center; }
.lb-thumb { flex: 0 0 auto; width: 64px; height: 48px; padding: 0; border: 2px solid transparent; border-radius: 8px; overflow: hidden; cursor: pointer; background: #14233a; opacity: 0.55; transition: opacity 0.2s ease, border-color 0.2s ease; }
.lb-thumb:hover { opacity: 0.85; }
.lb-thumb.active { opacity: 1; border-color: #0EA5E9; }
.lb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (max-width: 599px) { .lb-arrow { display: none !important; } }
`;

export default function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index];
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const imgRef = useRef(null);
  const touch = useRef(null);
  const stripRef = useRef(null);

  // Keyboard + body scroll lock.
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

  const isVideo = item.media_type === "video";
  const yt = isVideo ? youtubeId(item.url) : null;

  // Reset the spinner per photo (cached images may already be complete) and warm the neighbours.
  useEffect(() => {
    if (isVideo) { setStatus("ready"); return; }
    const el = imgRef.current;
    setStatus(el && el.complete && el.naturalWidth > 0 ? "ready" : "loading");
    [index - 1, index + 1].forEach((i) => {
      const n = items[(i + items.length) % items.length];
      if (n && n.media_type !== "video") new Image().src = n.url;
    });
  }, [index, isVideo, items]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const el = stripRef.current?.children[index];
    el?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    const s = touch.current; touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) onNav(dx < 0 ? 1 : -1);
  };

  if (typeof document === "undefined") return null;

  const multi = items.length > 1;
  const arrow = { top: "50%", transform: "translateY(-50%)" };

  // Portalled to <body> so no transformed/filtered ancestor can turn position:fixed into position:absolute.
  return createPortal(
    <div
      role="dialog" aria-modal="true" aria-label={item.title}
      onClick={onClose}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(8,15,28,0.97)", display: "flex", flexDirection: "column", color: "#fff" }}
    >
      <style>{CSS}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", flex: "0 0 auto" }}>
        <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }} aria-live="polite">{index + 1}/{items.length}</span>
        <button className="lb-btn" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close" style={{ position: "static" }}>✕</button>
      </div>

      <div style={{ position: "relative", flex: "1 1 0", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
        {isVideo ? (
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
            {yt ? (
              <iframe key={item.id} src={`https://www.youtube.com/embed/${yt}?autoplay=1&rel=0`} title={item.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                style={{ width: "min(960px, 100%)", aspectRatio: "16 / 9", maxHeight: "100%", border: 0, borderRadius: 12 }} />
            ) : (
              <video key={item.id} src={item.url} poster={item.thumbnail_url || undefined} controls autoPlay playsInline
                style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, background: "#000" }} />
            )}
          </div>
        ) : (
          <>
            <img
              key={item.id}
              ref={imgRef}
              src={item.url}
              alt={item.title}
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setStatus("ready")}
              onError={() => setStatus("error")}
              draggable={false}
              style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", opacity: status === "ready" ? 1 : 0, transition: "opacity 0.25s ease", userSelect: "none" }}
            />
            {status === "loading" && (
              <div aria-label="Loading" style={{ position: "absolute", top: "50%", left: "50%", width: 44, height: 44, margin: "-22px 0 0 -22px", border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "#0EA5E9", borderRadius: "50%", animation: "lb-spin 0.8s linear infinite" }} />
            )}
            {status === "error" && (
              <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.85 }}>
                <span style={{ fontSize: 40 }}>🖼️</span>
                <span style={{ fontSize: 14 }}>This image couldn&apos;t be loaded</span>
              </div>
            )}
          </>
        )}

        {multi && (
          <>
            <button className="lb-btn lb-arrow" onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Previous" style={{ ...arrow, left: 16 }}>←</button>
            <button className="lb-btn lb-arrow" onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Next" style={{ ...arrow, right: 16 }}>→</button>
          </>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()} style={{ flex: "0 0 auto", padding: "14px 20px 8px", textAlign: "center", maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{item.title}</div>
        {item.description && <div style={{ fontSize: 14, opacity: 0.75, marginTop: 4, lineHeight: 1.5, maxHeight: 64, overflowY: "auto" }}>{item.description}</div>}
        {!item.description && item.category && <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{CATEGORY_LABELS[item.category] || item.category}</div>}
      </div>

      {multi && (
        <div ref={stripRef} className="lb-strip" onClick={(e) => e.stopPropagation()} style={{ flex: "0 0 auto", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          {items.map((it, i) => (
            <button key={it.id || i} className={`lb-thumb${i === index ? " active" : ""}`} onClick={() => onNav(i - index)} aria-label={`Go to photo ${i + 1}`} aria-current={i === index}>
              {thumbFor(it) && <img src={thumbFor(it)} alt="" loading="lazy" draggable={false} />}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
