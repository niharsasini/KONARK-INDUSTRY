"use client";
import { useState, useEffect, useCallback } from "react";
import { BACKEND } from "@/components/gallery/media";
import GalleryGrid, { GALLERY_GRID_CSS } from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/Lightbox";

const CATEGORIES = [
  { key: "all", label: "All", emoji: "🎯" },
  { key: "products", label: "Products", emoji: "⚡" },
  { key: "events", label: "Events", emoji: "🎉" },
  { key: "factory", label: "Factory", emoji: "🏭" },
  { key: "team", label: "Team", emoji: "👥" },
  { key: "awards", label: "Awards", emoji: "🏆" },
  { key: "customers", label: "Customers", emoji: "❤️" },
];

const CSS = GALLERY_GRID_CSS + `
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
          <GalleryGrid items={items} onOpen={setOpenIndex} />
        )}
      </section>

      {openIndex !== null && items[openIndex] && (
        <Lightbox items={items} index={openIndex} onClose={close} onNav={nav} />
      )}
    </main>
  );
}
