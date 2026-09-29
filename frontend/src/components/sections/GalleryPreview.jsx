"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BACKEND, CATEGORY_LABELS, thumbFor } from "@/components/gallery/media";

const CSS = `
.gp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 991px) { .gp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px) { .gp-grid { grid-template-columns: 1fr; } }
.gp-card { display: block; position: relative; border-radius: 20px; overflow: hidden; background: #fff; text-decoration: none;
  box-shadow: 6px 6px 16px rgba(13,81,140,0.09), -5px -5px 12px rgba(255,255,255,0.95); transition: all 0.35s ease; }
.gp-card:hover { transform: translateY(-6px); box-shadow: 10px 14px 28px rgba(13,81,140,0.16), -5px -5px 12px rgba(255,255,255,0.95); }
.gp-img { aspect-ratio: 4 / 3; overflow: hidden; background: #0C1A2E; position: relative; }
.gp-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.gp-card:hover .gp-img img { transform: scale(1.06); }
`;

export default function GalleryPreview() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND}/api/v1/gallery/featured?limit=6`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (!cancelled && Array.isArray(data)) setItems(data.slice(0, 6)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Nothing featured yet (or API down) — omit the section rather than show an empty block.
  if (items.length === 0) return null;

  return (
    <section style={{ background: "#F5F7FF", padding: "80px 0" }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: "#0D518C", background: "rgba(13,81,140,0.08)", padding: "6px 16px", borderRadius: 999, marginBottom: 16 }}>OUR GALLERY</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#0C1A2E", margin: 0 }}>See Us In Action</h2>
        </div>

        <div className="gp-grid">
          {items.map((item) => (
            <Link key={item.id} href="/gallery" className="gp-card" aria-label={`${item.title} — view gallery`}>
              <div className="gp-img">
                {thumbFor(item) && <img src={thumbFor(item)} alt={item.title} loading="lazy" />}
                {item.media_type === "video" && (
                  <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 48, height: 48, background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D518C", fontSize: 18, boxShadow: "0 4px 20px rgba(13,81,140,0.2)" }}>▶</span>
                )}
              </div>
              <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#0C1A2E", fontSize: 14, fontWeight: 600 }}>{item.title}</span>
                <span style={{ background: "rgba(13,81,140,0.08)", color: "#0D518C", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/gallery" className="ghost-btn-navy">View Full Gallery →</Link>
        </div>
      </div>
    </section>
  );
}
