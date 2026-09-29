"use client";
import Link from "next/link";
import { CATEGORY_LABELS, formatAlbumDate } from "./media";

export const ALBUM_CARD_CSS = `
.alb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 991px) { .alb-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px) { .alb-grid { grid-template-columns: 1fr; } }
.alb-card { display: block; text-decoration: none; border-radius: 20px; overflow: hidden; background: #fff;
  box-shadow: 8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95); transition: transform 0.35s ease, box-shadow 0.35s ease; }
.alb-card:hover { transform: translateY(-6px); box-shadow: 12px 16px 32px rgba(13,81,140,0.16), -6px -6px 16px rgba(255,255,255,0.95); }
.alb-card:focus-visible { outline: 3px solid #0EA5E9; outline-offset: 2px; }
.alb-cover { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: #0C1A2E; }
.alb-cover img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
.alb-card:hover .alb-cover img { transform: scale(1.07); }
.alb-pill { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.92); color: #0D518C; font-size: 11px;
  font-weight: 700; padding: 4px 12px; border-radius: 999px; letter-spacing: 0.04em; box-shadow: 0 2px 8px rgba(13,81,140,0.15); }
.alb-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
`;

/** Album summary card: 4:3 cover, category pill, title, 2-line description, date + photo count. */
export default function AlbumCard({ album }) {
  const date = formatAlbumDate(album.event_date);
  const n = album.photo_count || 0;
  return (
    <Link href={`/gallery/${album.slug}`} className="alb-card" aria-label={`${album.title} — ${n} photos`}>
      <div className="alb-cover">
        {album.cover_image && <img src={album.cover_image} alt={album.title} loading="lazy" />}
        <span className="alb-pill">{CATEGORY_LABELS[album.category] || album.category}</span>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#0C1A2E", marginBottom: 6, lineHeight: 1.3 }}>{album.title}</div>
        {album.description && (
          <p className="alb-desc" style={{ fontSize: 14, color: "#4A6785", lineHeight: 1.55, margin: "0 0 12px" }}>{album.description}</p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12.5, color: "#6B84A0", fontWeight: 500 }}>
          <span>{date}</span>
          <span>📷 {n} photo{n === 1 ? "" : "s"}</span>
        </div>
      </div>
    </Link>
  );
}
