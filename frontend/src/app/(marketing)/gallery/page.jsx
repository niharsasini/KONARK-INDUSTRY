"use client";
import { useState, useEffect } from "react";
import { BACKEND } from "@/components/gallery/media";
import AlbumCard, { ALBUM_CARD_CSS } from "@/components/gallery/AlbumCard";
import CategoryTabs, { CATEGORY_TABS_CSS } from "@/components/gallery/CategoryTabs";

const TABS = [
  { key: "all", label: "All", emoji: "🎯" },
  { key: "products", label: "Products", emoji: "⚡" },
  { key: "events", label: "Events", emoji: "🎉" },
  { key: "factory", label: "Factory", emoji: "🏭" },
  { key: "team", label: "Team", emoji: "👥" },
  { key: "awards", label: "Awards", emoji: "🏆" },
  { key: "customers", label: "Customers", emoji: "❤️" },
];

const CSS = ALBUM_CARD_CSS + CATEGORY_TABS_CSS + `
@keyframes gal-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
.gal-skel { border-radius: 20px; aspect-ratio: 4 / 3.2;
  background: linear-gradient(90deg, #E8EEFA 25%, #F5F8FF 50%, #E8EEFA 75%); background-size: 800px 100%;
  animation: gal-shimmer 1.4s infinite linear; }
`;

export default function GalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND}/api/v1/albums/?limit=200`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (!cancelled) setAlbums(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) { setAlbums([]); setFailed(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const visible = category === "all" ? albums : albums.filter((a) => a.category === category);

  return (
    <main style={{ background: "#F5F7FF", minHeight: "100vh" }}>
      <style>{CSS}</style>

      <section style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F0F5FF 30%, #F5F7FF 60%, #EEF4FF 100%)", textAlign: "center", padding: "calc(68px + var(--banner-h, 0px) + 60px) 16px 60px" }}>
        <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: "#0D518C", background: "rgba(13,81,140,0.08)", padding: "6px 16px", borderRadius: 999, marginBottom: 20 }}>OUR GALLERY</div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#0C1A2E", margin: "0 0 16px", lineHeight: 1.1 }}>
          See Konark{" "}
          <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>In Action.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#4A6785", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Albums from our factory, events, products and happy customers.
        </p>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 80px" }}>
        <CategoryTabs tabs={TABS} value={category} onChange={setCategory} />

        {loading ? (
          <div className="alb-grid" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => <div key={i} className="gal-skel" />)}
          </div>
        ) : visible.length === 0 ? (
          <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center", background: "#fff", borderRadius: 24, padding: "48px 32px", boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{failed ? "⚠️" : "📷"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0C1A2E", marginBottom: 6 }}>{failed ? "Couldn't load the gallery" : "No albums yet"}</div>
            <div style={{ fontSize: 14, color: "#4A6785" }}>{failed ? "Please try again in a moment." : "Check back soon"}</div>
          </div>
        ) : (
          <div className="alb-grid">
            {visible.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        )}
      </section>
    </main>
  );
}
