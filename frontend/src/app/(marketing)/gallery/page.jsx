"use client";
import { useState, useEffect, useCallback } from "react";
import { BACKEND, CATEGORY_LABELS, thumbFor, youtubeId } from "@/components/gallery/media";

const CATEGORIES = [
  { key: "all", label: "All", emoji: "🎯" },
  { key: "products", label: "Products", emoji: "⚡" },
  { key: "events", label: "Events", emoji: "🎉" },
  { key: "factory", label: "Factory", emoji: "🏭" },
  { key: "team", label: "Team", emoji: "👥" },
  { key: "awards", label: "Awards", emoji: "🏆" },
  { key: "customers", label: "Customers", emoji: "❤️" },
];

const CSS = `
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
.gal-tab { transition: all 0.2s ease; }
.gal-tab:not(.active):hover { border-color: rgba(13,81,140,0.25) !important; color: #0D518C !important; }
.gal-arrow { transition: all 0.2s ease; }
.gal-arrow:hover { background: #fff !important; transform: translateY(-50%) scale(1.05) !important; }
@keyframes gal-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
.gal-skel { break-inside: avoid; margin-bottom: 16px; border-radius: 20px;
  background: linear-gradient(90deg, #E8EEFA 25%, #F5F8FF 50%, #E8EEFA 75%); background-size: 800px 100%;
  animation: gal-shimmer 1.4s infinite linear; }
`;

const SKEL_HEIGHTS = [220, 300, 260, 340, 240, 280, 320, 230, 290, 250, 310, 270];

function Lightbox({ items, index, onClose, onNav }) {
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

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    const qs = category === "all" ? "?limit=200" : `?category=${category}&limit=200`;
    fetch(`${BACKEND}/api/v1/gallery${qs}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (!cancelled) setItems(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) { setItems([]); setFailed(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category]);

  const close = useCallback(() => setOpenIndex(null), []);
  const nav = useCallback(
    (d) => setOpenIndex((i) => (i === null || items.length === 0 ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  return (
    <main style={{ background: "#F5F7FF", minHeight: "100vh" }}>
      <style>{CSS}</style>

      <section style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F0F5FF 30%, #F5F7FF 60%, #EEF4FF 100%)", paddingTop: "calc(68px + var(--banner-h, 0px) + 60px)", paddingBottom: 60, textAlign: "center", padding: "calc(68px + var(--banner-h, 0px) + 60px) 16px 60px" }}>
        <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: "#0D518C", background: "rgba(13,81,140,0.08)", padding: "6px 16px", borderRadius: 999, marginBottom: 20 }}>OUR GALLERY</div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#0C1A2E", margin: "0 0 16px", lineHeight: 1.1 }}>
          See Konark{" "}
          <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>In Action.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#4A6785", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Photos and videos from our factory, events, products and happy customers.
        </p>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                aria-pressed={active}
                className={`gal-tab${active ? " active" : ""}`}
                style={active ? {
                  background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#fff", borderRadius: 999, padding: "8px 20px",
                  fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(13,81,140,0.25)",
                } : {
                  background: "#fff", border: "1px solid rgba(13,81,140,0.12)", borderRadius: 999, padding: "8px 20px", color: "#4A6785",
                  fontSize: 13, fontWeight: 500, cursor: "pointer", boxShadow: "4px 4px 10px rgba(13,81,140,0.07), -3px -3px 8px rgba(255,255,255,0.9)",
                }}
              >
                {c.emoji} {c.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="gal-cols" aria-busy="true">
            {SKEL_HEIGHTS.map((h, i) => <div key={i} className="gal-skel" style={{ height: h }} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center", background: "#fff", borderRadius: 24, padding: "48px 32px", boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{failed ? "⚠️" : "📷"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0C1A2E", marginBottom: 6 }}>{failed ? "Couldn't load the gallery" : "No media yet"}</div>
            <div style={{ fontSize: 14, color: "#4A6785" }}>{failed ? "Please try again in a moment." : "Check back soon"}</div>
          </div>
        ) : (
          <div className="gal-cols">
            {items.map((item, i) => {
              const thumb = thumbFor(item);
              const isVideo = item.media_type === "video";
              return (
                <button key={item.id} className="gal-item" onClick={() => setOpenIndex(i)} aria-label={`Open ${item.title}`}>
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
        )}
      </section>

      {openIndex !== null && items[openIndex] && (
        <Lightbox items={items} index={openIndex} onClose={close} onNav={nav} />
      )}
    </main>
  );
}
