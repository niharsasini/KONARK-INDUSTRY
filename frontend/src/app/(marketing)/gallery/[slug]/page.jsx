"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BACKEND, CATEGORY_LABELS, formatAlbumDate } from "@/components/gallery/media";
import GalleryGrid, { GALLERY_GRID_CSS } from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/Lightbox";

export default function AlbumPage() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | missing | error
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`${BACKEND}/api/v1/albums/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (r.status === 404) { if (!cancelled) setState("missing"); return null; }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => { if (data && !cancelled) { setAlbum(data); setState("ok"); } })
      .catch(() => { if (!cancelled) setState("error"); });
    return () => { cancelled = true; };
  }, [slug]);

  const photos = album?.photos || [];
  const close = useCallback(() => setOpenIndex(null), []);
  const nav = useCallback(
    (d) => setOpenIndex((i) => (i === null || photos.length === 0 ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  const date = album ? formatAlbumDate(album.event_date) : "";
  const meta = [date && `📅 ${date}`, album?.location && `📍 ${album.location}`, album && `📷 ${photos.length} photo${photos.length === 1 ? "" : "s"}`].filter(Boolean);

  return (
    <main style={{ background: "#F5F7FF", minHeight: "100vh" }}>
      <style>{GALLERY_GRID_CSS}</style>

      <section style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F0F5FF 30%, #F5F7FF 60%, #EEF4FF 100%)", textAlign: "center", padding: "calc(68px + var(--banner-h, 0px) + 40px) 16px 48px" }}>
        <Link href="/gallery" style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "#0D518C", textDecoration: "none", marginBottom: 20 }}>← All albums</Link>
        {state === "ok" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#0D518C", background: "rgba(13,81,140,0.08)", padding: "6px 16px", borderRadius: 999, textTransform: "uppercase" }}>
                {CATEGORY_LABELS[album.category] || album.category}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 800, color: "#0C1A2E", margin: "0 0 14px", lineHeight: 1.15 }}>{album.title}</h1>
            {album.description && <p style={{ fontSize: 16, color: "#4A6785", maxWidth: 640, margin: "0 auto 16px", lineHeight: 1.7 }}>{album.description}</p>}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px 20px", flexWrap: "wrap", fontSize: 14, color: "#4A6785", fontWeight: 500 }}>
              {meta.map((m) => <span key={m}>{m}</span>)}
            </div>
          </>
        )}
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 80px" }}>
        {state === "loading" && <div style={{ textAlign: "center", color: "#4A6785", padding: 40 }} aria-busy="true">Loading…</div>}
        {(state === "missing" || state === "error") && (
          <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center", background: "#fff", borderRadius: 24, padding: "48px 32px", boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{state === "missing" ? "🔍" : "⚠️"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0C1A2E", marginBottom: 6 }}>{state === "missing" ? "Album not found" : "Couldn't load this album"}</div>
            <Link href="/gallery" className="clay-btn clay-btn-primary" style={{ display: "inline-block", marginTop: 16, padding: "12px 24px", fontSize: 14, textDecoration: "none" }}>Back to gallery</Link>
          </div>
        )}
        {state === "ok" && <GalleryGrid items={photos} onOpen={setOpenIndex} />}
      </section>

      {openIndex !== null && photos[openIndex] && (
        <Lightbox items={photos} index={openIndex} onClose={close} onNav={nav} />
      )}
    </main>
  );
}
