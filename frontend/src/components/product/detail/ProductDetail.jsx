"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import EnquiryModal from "@/components/forms/EnquiryModal";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { BADGE_COLORS, StarRating, RelatedProducts } from "./shared";
import ProductImageGallery from "../ProductImageGallery";
import ProductReviews from "../ProductReviews";

/* ─── PRODUCT detail (Flipkart style) ─────────────── */

function getDeliveryDate() {
  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  minDate.setDate(today.getDate() + 5);
  maxDate.setDate(today.getDate() + 7);
  while (minDate.getDay() === 0) minDate.setDate(minDate.getDate() + 1);
  while (maxDate.getDay() === 0) maxDate.setDate(maxDate.getDate() + 1);
  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(minDate)} – ${fmt(maxDate)}`;
}

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [emiOpen, setEmiOpen] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { addProduct: addRecentlyViewed, getProducts: getRecentlyViewed } = useRecentlyViewed();
  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";
  const formattedPrice = product.price ? `₹${product.price.toLocaleString("en-IN")}` : null;
  const specs = product.specifications ? Object.entries(product.specifications) : [];
  const images = product.images?.length > 0 ? product.images : [product.image];
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    addRecentlyViewed(product.slug);
    setRecentProducts(getRecentlyViewed().filter((p) => p.slug !== product.slug));
  }, [product.slug]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id || product.slug,
        slug: product.slug,
        name: product.name,
        price: product.price || 0,
        image: product.images?.[0] || product.image || "",
        category: product.category || "",
        type: product.type || "product",
      });
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${product.name} on Konark Industry`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = `Hi, I'm interested in *${product.name}* from Konark Industry.\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", alignItems: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "#94a3b8", textDecoration: "none" }}>Products</Link>
        <span>/</span>
        <span style={{ color: "#00d4ff" }}>{product.name}</span>
      </div>

      {/* Main two-col */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "45% 55%", gap: 40, alignItems: "start" }} className="detail-grid">
        {/* LEFT: image gallery */}
        <ProductImageGallery images={images} productName={product.name} isNew={product.isNew} />

        {/* RIGHT: details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: "uppercase", letterSpacing: "0.08em", width: "fit-content" }}>
            {product.category}
          </span>

          <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "#f1f5f9", margin: 0, lineHeight: 1.2 }}>{product.name}</h1>

          <StarRating rating={product.rating} />

          {/* Price block */}
          <div>
            <p style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, color: formattedPrice ? "#00d4ff" : "#94a3b8", margin: 0, fontStyle: formattedPrice ? "normal" : "italic" }}>
              {formattedPrice || "Price on Request"}
            </p>
            {product.price > 0 && (
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>or ₹{Math.round(product.price / 12).toLocaleString("en-IN")}/mo on EMI</p>
            )}
          </div>

          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{product.shortDescription || product.description}</p>

          {/* Delivery estimate */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8 }}>
            <span style={{ fontSize: 14 }}>🚚</span>
            <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>Delivery by <strong>{getDeliveryDate()}</strong></p>
          </div>

          {/* Offers */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#f97316", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Available Offers</p>
            {[
              "✦ 10% off on first order with code KONARK10",
              "✦ Free delivery on orders above ₹5,000",
              "✦ 2-year warranty included",
            ].map((o) => <p key={o} style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{o}</p>)}
          </div>

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Qty:</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #1e2d40", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleAddToCart}
                style={{ flex: 1, padding: "14px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 15, borderRadius: 10, border: "none", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
              >
                Add to Cart 🛒
              </button>
              <button
                onClick={() => { toggle(product.slug); toast(isInWishlist(product.slug) ? "Removed from wishlist" : "Saved to wishlist ❤️"); }}
                style={{ width: 48, height: 48, borderRadius: 10, border: "1px solid #1e2d40", background: isInWishlist(product.slug) ? "rgba(239,68,68,0.1)" : "transparent", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {isInWishlist(product.slug) ? "❤️" : "🤍"}
              </button>
            </div>
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{ padding: "14px", background: "transparent", color: "#f1f5f9", fontWeight: 600, fontSize: 15, borderRadius: 10, border: "1px solid #1e2d40", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
            >
              Buy Now / Enquire
            </button>
          </div>

          {/* Trust pills */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["🛡 2-Year Warranty", "🚚 Free Delivery", "↩ Easy Returns"].map((t) => (
              <span key={t} style={{ fontSize: 12, color: "#94a3b8", background: "#0f172a", border: "1px solid #1e2d40", padding: "5px 10px", borderRadius: 6 }}>{t}</span>
            ))}
          </div>

          {/* Make in India badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: 8, fontSize: 12, color: "#FF9933", width: "fit-content" }}>
            🇮🇳 Manufactured in Bhubaneswar, Odisha, India
          </div>

          {/* Share buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleShare}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: "pointer" }}
            >
              🔗 Share
            </button>
            <button
              onClick={handleWhatsAppShare}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#25D366", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer" }}
            >
              📱 WhatsApp
            </button>
          </div>

          {/* EMI options link */}
          {product.price > 10000 && (
            <button
              onClick={() => setEmiOpen(true)}
              style={{ background: "transparent", border: "none", color: "#00d4ff", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", padding: 0 }}
            >
              💳 View EMI options
            </button>
          )}

          {/* Key specs */}
          {specs.length > 0 && (
            <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Key Highlights</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {specs.slice(0, 6).map(([k, v]) => (
                  <li key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ color: "#10b981", flexShrink: 0 }}>✓</span>
                    <span><strong style={{ color: "#f1f5f9" }}>{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs accordion */}
          {specs.length > 0 && (
            <div style={{ border: "1px solid #1e2d40", borderRadius: 10 }}>
              <button
                onClick={() => setSpecsOpen((o) => !o)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "transparent", border: "none", color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Full Specifications
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, transform: specsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </button>
              {specsOpen && (
                <div style={{ borderTop: "1px solid #1e2d40", padding: "0 16px 16px" }}>
                  {specs.map(([k, v], i) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < specs.length - 1 ? "1px solid #1e2d40" : "none" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #1e2d40", gap: 0, marginBottom: 28 }}>
          {["description", "specifications", "reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#00d4ff" : "transparent"}`, color: activeTab === tab ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "description" && <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, maxWidth: 720 }}>{product.description}</p>}
        {activeTab === "specifications" && specs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px", maxWidth: 720 }}>
            {specs.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d40" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "reviews" && <ProductReviews slug={product.slug} />}
      </div>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 24px 40px" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>Recently Viewed</h3>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
            {recentProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, overflow: "hidden", textDecoration: "none", flexShrink: 0, width: 180, transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d4a6b")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
              >
                <div style={{ background: "#111827", height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 10 }} />
                </div>
                <div style={{ padding: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", margin: "0 0 4px", lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: "#00d4ff", margin: 0, fontWeight: 700 }}>{p.price ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <RelatedProducts current={product} />
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} product={product} />

      {/* EMI Modal */}
      {emiOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setEmiOpen(false)}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: 28, maxWidth: 480, width: "100%", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setEmiOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "1px solid #1e2d40", borderRadius: "50%", width: 32, height: 32, color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" }}>Easy EMI Options</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>Product price: <strong style={{ color: "#00d4ff" }}>₹{product.price.toLocaleString("en-IN")}</strong></p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { months: 3, interest: 0, label: "3 Months", popular: false },
                { months: 6, interest: 0.01, label: "6 Months", popular: true },
                { months: 12, interest: 0.05, label: "12 Months", popular: false },
                { months: 24, interest: 0.10, label: "24 Months", popular: false },
              ].map((opt) => {
                const total = product.price * (1 + opt.interest);
                const monthly = total / opt.months;
                return (
                  <div key={opt.months} style={{ background: opt.popular ? "rgba(0,212,255,0.06)" : "#0a0f1e", border: `1px solid ${opt.popular ? "#00d4ff" : "#1e2d40"}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{opt.label}</span>
                        {opt.popular && <span style={{ fontSize: 10, background: "#00d4ff", color: "#0a0f1e", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>POPULAR</span>}
                      </div>
                      <span style={{ fontSize: 11, color: "#64748b" }}>Total: ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}{opt.interest > 0 ? ` (${opt.interest * 100}% interest)` : " (0% interest)"}</span>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#00d4ff" }}>₹{monthly.toLocaleString("en-IN", { maximumFractionDigits: 0 })}<span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>/mo</span></span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 11, color: "#475569", marginTop: 16, lineHeight: 1.6 }}>
              EMI available via Bajaj Finserv, HDFC Bank, ICICI Bank at select outlets. Contact us for details.
            </p>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
