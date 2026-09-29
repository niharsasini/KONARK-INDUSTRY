"use client";
import { CATEGORY_LABELS, thumbFor } from "./media";

export const GALLERY_GRID_CSS = `
.gal-cols { column-count: 3; column-gap: 16px; }
@media (max-width: 991px) { .gal-cols { column-count: 2; } }
@media (max-width: 599px) { .gal-cols { column-count: 1; } }
.gal-item { break-inside: avoid; margin-bottom: 16px; border-radius: 20px; overflow: hidden; background: #fff;
  box-shadow: 8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95);
  cursor: pointer; transition: all 0.35s ease; border: 0; padding: 0; width: 100%; display: block; text-align: left; font: inherit; }
.gal-item:hover { transform: translateY(-6px); box-shadow: 12px 16px 32px rgba(13,81,140,0.16), -6px -6px 16px rgba(255,255,255,0.95); }
.gal-item:focus-visible { outline: 3px solid #0EA5E9; outline-offset: 2px; }
.gal-media { position: relative; overflow: hidden; }
.gal-media img { width: 100%; display: block; object-fit: cover; transition: transform 0.5s ease; }
.gal-item:hover .gal-media img { transform: scale(1.04); }
.gal-play { transition: all 0.2s ease; }
.gal-item:hover .gal-play { transform: translate(-50%, -50%) scale(1.1); }
`;

/** Masonry grid of gallery cards; calls onOpen(index) when one is clicked. */
export default function GalleryGrid({ items, onOpen, className = "" }) {
  return (
    <div className={`gal-cols ${className}`.trim()}>
      {items.map((item, i) => {
        const thumb = thumbFor(item);
        const isVideo = item.media_type === "video";
        return (
          <button key={item.id} className="gal-item" onClick={() => onOpen(i)} aria-label={`Open ${item.title}`}>
            <div className="gal-media" style={{ minHeight: isVideo && !thumb ? 200 : undefined, background: "#0C1A2E" }}>
              {thumb && <img src={thumb} alt={item.title} loading="lazy" />}
              {isVideo && (
                <>
                  <span className="gal-play" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 56, height: 56, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#0D518C", boxShadow: "0 4px 20px rgba(13,81,140,0.2)" }}>▶</span>
                  <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>▶ VIDEO</span>
                </>
              )}
            </div>
            <div style={{ padding: "12px 16px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#0C1A2E", fontSize: 14, fontWeight: 600 }}>{item.title}</span>
              <span style={{ background: "rgba(13,81,140,0.08)", color: "#0D518C", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
