"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BACKEND } from "@/components/gallery/media";
import GalleryGrid, { GALLERY_GRID_CSS } from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/Lightbox";
import { animateIn } from "@/lib/gsapUtils";

const LIMIT = 8;

export default function GalleryPreview() {
  const [items, setItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND}/api/v1/gallery/?limit=${LIMIT}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (!cancelled && Array.isArray(data)) setItems(data.slice(0, LIMIT)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const hasItems = items.length > 0;
  useEffect(() => {
    if (!hasItems) return;
    animateIn(".gp-head", { y: 30, trigger: ".gp-head" });
    animateIn(".gp-body", { y: 40, trigger: ".gp-body", start: "top 88%" });
  }, [hasItems]);

  const close = useCallback(() => setOpenIndex(null), []);
  const nav = useCallback(
    (d) => setOpenIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  // Nothing yet (or API down) — omit the section rather than show an empty block.
  if (!hasItems) return null;

  return (
    <section style={{ background: "#F5F7FF", padding: "80px 0" }}>
      <style>{GALLERY_GRID_CSS}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div className="gp-head" style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="section-tag" style={{ marginBottom: 14 }}>OUR GALLERY</span>
          <h2 className="section-title" style={{ margin: "0 0 10px" }}>
            Our <span className="gradient-text">Gallery</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            A look inside our factory, products and happy customers.
          </p>
        </div>

        <div className="gp-body">
          <GalleryGrid items={items} onOpen={setOpenIndex} />
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/gallery" className="clay-btn clay-btn-primary" style={{ display: "inline-block", padding: "14px 32px", fontSize: 15, textDecoration: "none" }}>
              View Full Gallery →
            </Link>
          </div>
        </div>
      </div>

      {openIndex !== null && items[openIndex] && (
        <Lightbox items={items} index={openIndex} onClose={close} onNav={nav} />
      )}
    </section>
  );
}
