"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { submitTestRide, submitEnquiry } from "@/lib/api";
import { StarRating, RelatedProducts } from "./shared";

/* ─── VEHICLE detail (Amazon / Flipkart / Tesla style — standard split layout) ──────────── */

const TIME_SLOTS = ["Morning (9AM–12PM)", "Afternoon (12PM–4PM)", "Evening (4PM–7PM)"];

/* Spec keys vary wildly across products (MotorType vs Motor, ChargingTime vs "Charging Time"...).
   Normalize to alnum-lowercase so any casing/spacing/punctuation variant still matches. */
function normalizeKey(k) {
  return String(k).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSpecValue(specs, ...aliases) {
  if (!specs) return null;
  const entries = Object.entries(specs).map(([k, v]) => [normalizeKey(k), v]);
  for (const alias of aliases) {
    const target = normalizeKey(alias);
    const found = entries.find(([nk]) => nk === target);
    if (found && found[1] !== null && found[1] !== undefined && found[1] !== "") return found[1];
  }
  return null;
}

const SPEC_CANDIDATES = [
  { label: "Range", aliases: ["Range", "Battery Range", "Max Range", "Mileage"] },
  { label: "Motor", aliases: ["Motor", "Motor Power", "Power", "MotorType"] },
  { label: "Battery", aliases: ["Battery", "Battery Capacity"] },
  { label: "Top Speed", aliases: ["Top Speed", "Speed", "Max Speed", "MaxSpeed"] },
  { label: "Charging", aliases: ["Charging Time", "Charge Time", "Charging", "ChargingTime"] },
  { label: "Payload", aliases: ["Payload", "Load Capacity", "Carrying Capacity", "LoadCapacity"] },
];

/* Highlights shown as right-panel trust badges and as the "Key Features" list.
   Admin-entered product.features wins when present; otherwise derive from specs/flags. */
function generateHighlights(product) {
  const specs = product.specifications || {};
  const highlights = [];

  const warranty = getSpecValue(specs, "Warranty");
  if (warranty) highlights.push(`${warranty} warranty`);

  const range = getSpecValue(specs, ...SPEC_CANDIDATES[0].aliases);
  if (range) highlights.push(`${range} range`);

  const charging = getSpecValue(specs, ...SPEC_CANDIDATES[4].aliases);
  if (charging) highlights.push(`Fast charge: ${charging}`);

  if (product.inStock !== false) highlights.push("In stock — ready to deliver");
  if (product.isNew) highlights.push("Latest model");

  highlights.push("ISI certified quality");
  highlights.push("Made in Bhubaneswar");

  return highlights;
}

export default function VehicleDetail({ product }) {
  const images = product.images?.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [panel, setPanel] = useState(null); // null | "test-ride" | "order"

  const [rideForm, setRideForm] = useState({ name: "", phone: "", email: "", city: "", date: "", slot: TIME_SLOTS[0], message: "" });
  const [rideSubmitting, setRideSubmitting] = useState(false);
  const [rideSuccess, setRideSuccess] = useState(false);
  const [rideError, setRideError] = useState("");

  const [orderForm, setOrderForm] = useState({ name: "", phone: "", email: "", city: "", address: "", requirements: "" });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".vehicle-name", { y: 24, opacity: 0, duration: 0.5 });
      await animateIn(".spec-card", { y: 24, opacity: 0, scale: 0.92, stagger: 0.08, duration: 0.5, delay: 0.15 });
      await animateIn(".vehicle-action-card", { x: 60, opacity: 0, duration: 0.6, delay: 0.1 });
      await animateIn(".related-card", { y: 24, opacity: 0, stagger: 0.06, duration: 0.5, start: "top 90%" });
    };
    run();
  }, [product?.slug]);

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

  const handleFacebookShare = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const specs = product.specifications ? Object.entries(product.specifications) : [];
  const isUpcoming = product.isUpcoming === true || product.specifications?.Status === "Upcoming";
  const inStock = product.inStock !== false;

  const keySpecs = SPEC_CANDIDATES
    .map((c) => ({ label: c.label, value: getSpecValue(product.specifications, ...c.aliases) }))
    .filter((s) => s.value)
    .slice(0, 4);

  const adminFeatures = (product.features || []).filter(Boolean);
  const highlights = adminFeatures.length ? adminFeatures : generateHighlights(product);
  const trustBadges = highlights.slice(0, 4);

  const handleRideSubmit = async (e) => {
    e.preventDefault();
    setRideSubmitting(true);
    setRideError("");
    try {
      await submitTestRide({
        name: rideForm.name,
        phone: rideForm.phone,
        email: rideForm.email || undefined,
        city: rideForm.city,
        preferred_date: rideForm.date || undefined,
        product_id: product.id || product.slug,
        product_name: product.name,
        message: `Preferred time slot: ${rideForm.slot}${rideForm.message ? `\n\n${rideForm.message}` : ""}`,
      });
      setRideSuccess(true);
    } catch (err) {
      setRideError(err instanceof Error ? err.message : "Could not confirm booking. Please call us directly.");
    } finally {
      setRideSubmitting(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setOrderError("");
    try {
      await submitEnquiry({
        name: orderForm.name,
        phone: orderForm.phone,
        email: orderForm.email || undefined,
        enquiry_type: "product",
        product_id: product.id || product.slug,
        product_name: product.name,
        city: orderForm.city,
        message: `Vehicle order request for ${product.name}.\nDelivery address: ${orderForm.address}${orderForm.requirements ? `\nSpecial requirements: ${orderForm.requirements}` : ""}`,
      });
      setOrderId(`ORD-${Date.now().toString().slice(-8)}`);
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Could not submit order request. Please call us directly.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#F5F7FF", border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: 10, padding: "12px 16px", color: "var(--text-heading)", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
  const focusIn = (e) => { e.currentTarget.style.borderColor = "var(--sky)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,81,140,0.1)"; };
  const focusOut = (e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"; e.currentTarget.style.boxShadow = "none"; };

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 6, fontSize: 12, color: "#8BA8C4", alignItems: "center" }}>
        <Link href="/" style={{ color: "#8BA8C4", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "#8BA8C4", textDecoration: "none" }}>Products</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category || "")}`} style={{ color: "#8BA8C4", textDecoration: "none" }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: "var(--navy)" }}>{product.name}</span>
      </div>

      {/* ━━━ STANDARD 2-COLUMN LAYOUT FROM TOP ━━━ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 48px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "flex-start" }} className="vehicle-grid">
        {/* LEFT — image, specs, description, features */}
        <div className="vehicle-left">
          <div className="vehicle-image-box" style={{
            position: "relative", background: "linear-gradient(145deg, #EEF4FF, #F0F6FF)",
            borderRadius: 24, boxShadow: "10px 10px 28px rgba(13,81,140,0.09), -8px -8px 22px rgba(255,255,255,0.95)",
            padding: 20, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            {product.isNew && (
              <span style={{ position: "absolute", top: 16, left: 16, zIndex: 2, background: "var(--navy)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>NEW</span>
            )}
            <span style={{ position: "absolute", top: 16, right: 16, zIndex: 2, background: "rgba(15,76,129,0.85)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>⚡ EV Vehicle</span>
            <img
              key={images[activeImage]}
              src={images[activeImage]}
              alt={product.name}
              className="vehicle-hero-img"
              style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(13,81,140,0.2))", transition: "transform 0.5s ease" }}
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 10, marginTop: 14, overflowX: "auto" }}>
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    flexShrink: 0, width: 72, height: 60, borderRadius: 12, overflow: "hidden", padding: 0,
                    background: "#EEF4FF",
                    border: `2px solid ${activeImage === i ? "#0D518C" : "transparent"}`,
                    boxShadow: activeImage === i ? "0 0 0 3px rgba(13,81,140,0.12)" : "3px 3px 8px rgba(13,81,140,0.08), -2px -2px 6px rgba(255,255,255,0.9)",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Key specs row — only real values, hidden entirely if none found */}
          {keySpecs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${keySpecs.length}, 1fr)`, gap: 14, marginTop: 28 }} className="spec-strip">
              {keySpecs.map((s) => (
                <div key={s.label} className="spec-card" style={{ background: "#FFFFFF", borderRadius: 16, boxShadow: "6px 6px 16px rgba(13,81,140,0.08), -5px -5px 14px rgba(255,255,255,0.95)", padding: "16px 12px", textAlign: "center" }}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "#0D518C", letterSpacing: "-0.5px", margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#8BA8C4", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", margin: "4px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Full description */}
          <p style={{ fontSize: 15, color: "#4A6785", lineHeight: 1.8, margin: "28px 0 0" }}>{product.description}</p>

          {/* Key Features */}
          {highlights.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-heading)", marginBottom: 16 }}>Key Features</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {highlights.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#1E3A5F", textTransform: "capitalize" }}>
                    <span style={{ color: "#0D518C", fontWeight: 800, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upcoming banner */}
          {isUpcoming && (
            <div style={{ background: "rgba(193,127,36,0.1)", border: "1px solid rgba(193,127,36,0.3)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12, marginTop: 28, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>⚡</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", margin: "0 0 4px" }}>New Model Coming Soon</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.6 }}>
                  This is an upcoming Konark product. Register your interest to be notified when it launches.
                </p>
                <Link
                  href={`/contact?interest=${product.slug}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(193,127,36,0.2)", border: "1px solid rgba(193,127,36,0.4)", color: "var(--gold)", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(193,127,36,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(193,127,36,0.2)")}
                >
                  Register Interest →
                </Link>
              </div>
            </div>
          )}

          {/* Full specs collapsible */}
          {specs.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <FullSpecsAccordion specs={specs} isUpcoming={isUpcoming} />
            </div>
          )}
        </div>

        {/* RIGHT — sticky action panel: identity, price, CTAs, highlights */}
        <div style={{ position: "sticky", top: "calc(68px + var(--banner-h,0px) + 20px)" }}>
          <div className="vehicle-action-card" style={{ background: "#FFFFFF", borderRadius: 24, boxShadow: "12px 12px 32px rgba(13,81,140,0.1), -10px -10px 28px rgba(255,255,255,0.95)", padding: "32px 28px" }}>
            <span style={{ display: "inline-block", background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.15)", color: "#0D518C", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 14 }}>
              {product.category}
            </span>

            <h1 className="vehicle-name" style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 900, color: "#0C1A2E", letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 12px" }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <StarRating rating={product.rating} size={15} />
              <span style={{ width: 1, height: 14, background: "rgba(13,81,140,0.15)" }} />
              {isUpcoming ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", background: "var(--purple-bg)", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>Coming Soon</span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", background: "var(--green-bg)", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>{inStock ? "In Stock" : "Out of Stock"}</span>
              )}
            </div>

            {product.price > 0 ? (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#8BA8C4", margin: "0 0 2px" }}>Starting from</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)", letterSpacing: "-1px", margin: 0 }}>
                  ₹{product.price.toLocaleString("en-IN")} <span style={{ fontSize: 13, color: "#8BA8C4", fontWeight: 600 }}>+ GST</span>
                </p>
                <p style={{ fontSize: 14, color: "#4A6785", margin: "6px 0 0" }}>
                  or ₹{Math.round(product.price / 12).toLocaleString("en-IN")}/month{" "}
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", background: "var(--green-bg)", padding: "2px 8px", borderRadius: 20 }}>0% EMI</span>
                </p>
              </div>
            ) : (
              <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-subtle)", fontStyle: "italic", marginBottom: 16 }}>Price on Request</p>
            )}

            <div style={{ height: 1, background: "rgba(13,81,140,0.06)", margin: "20px 0" }} />

            {isUpcoming ? (
              <Link
                href={`/contact?interest=${product.slug}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 52, borderRadius: 12, background: "linear-gradient(135deg, #7C3AED, #A78BFA)", color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 16px rgba(124,58,237,0.28)" }}
              >
                Register Interest →
              </Link>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  className="clay-btn clay-btn-primary"
                  onClick={() => setPanel(panel === "test-ride" ? null : "test-ride")}
                  style={{ width: "100%", height: 52, fontSize: 16 }}
                >
                  🏍️ {panel === "test-ride" ? "Close Form" : "Book Test Ride →"}
                </button>
                <button
                  className="ghost-btn-navy"
                  onClick={() => setPanel(panel === "order" ? null : "order")}
                  style={{ width: "100%", height: 48, background: "#FFFFFF" }}
                >
                  🛒 {panel === "order" ? "Close Form" : "Order Now →"}
                </button>
              </div>
            )}

            <p style={{ fontSize: 12, color: "#8BA8C4", textAlign: "center", margin: "14px 0 0" }}>
              📞 or call: <a href="tel:+919437611129" style={{ color: "var(--navy)", fontWeight: 600, textDecoration: "none" }}>+91 94376 11129</a>
            </p>

            {/* Dynamic highlights (admin features, else generated from specs) */}
            {trustBadges.length > 0 && (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                {trustBadges.map((t) => (
                  <p key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#4A6785", margin: 0, textTransform: "capitalize" }}>
                    <span style={{ color: "var(--green)" }}>✓</span> {t}
                  </p>
                ))}
              </div>
            )}

            {/* Share row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(13,81,140,0.06)" }}>
              <span style={{ fontSize: 12, color: "#8BA8C4", fontWeight: 600, marginRight: 2 }}>Share:</span>
              <button onClick={handleWhatsAppShare} title="Share on WhatsApp" style={iconBtnStyle}>📱</button>
              <button onClick={handleFacebookShare} title="Share on Facebook" style={iconBtnStyle}>👍</button>
              <button onClick={handleShare} title="Copy link" style={iconBtnStyle}>🔗</button>
            </div>
          </div>

          {/* Inline Test Ride form */}
          {panel === "test-ride" && !isUpcoming && (
            <div className="inline-panel" style={{ marginTop: 20, background: "#FFFFFF", borderRadius: 20, boxShadow: "8px 8px 20px rgba(13,81,140,0.08), -6px -6px 16px rgba(255,255,255,0.95)", padding: 28 }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "var(--navy)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Book a Test Ride</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Experience it yourself</h3>
                <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "6px 0 0", lineHeight: 1.6 }}>Come to our Bhubaneswar showroom. No pressure, just drive.</p>
              </div>

              {rideSuccess ? (
                <div style={{ textAlign: "center", padding: "24px 8px" }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", margin: "0 0 8px" }}>Test Ride Booked!</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                    We'll call <strong style={{ color: "var(--navy)" }}>{rideForm.phone}</strong> within 2 hours to confirm your slot.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRideSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {rideError && (
                    <p style={{ fontSize: 12, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 8, padding: "8px 12px", margin: 0 }}>{rideError}</p>
                  )}
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" required value={rideForm.name} onChange={(e) => setRideForm((f) => ({ ...f, name: e.target.value }))} placeholder="Rajesh Kumar" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" required value={rideForm.phone} onChange={(e) => setRideForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={rideForm.email} onChange={(e) => setRideForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" required value={rideForm.city} onChange={(e) => setRideForm((f) => ({ ...f, city: e.target.value }))} placeholder="Bhubaneswar" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred Date</label>
                    <input type="date" required value={rideForm.date} onChange={(e) => setRideForm((f) => ({ ...f, date: e.target.value }))} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred Time Slot</label>
                    <select value={rideForm.slot} onChange={(e) => setRideForm((f) => ({ ...f, slot: e.target.value }))} style={inputStyle} onFocus={focusIn} onBlur={focusOut}>
                      {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Message (optional)</label>
                    <textarea rows={2} value={rideForm.message} onChange={(e) => setRideForm((f) => ({ ...f, message: e.target.value }))} placeholder="Anything we should know?" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <button type="submit" disabled={rideSubmitting} className="clay-btn clay-btn-primary" style={{ height: 48, fontSize: 15, opacity: rideSubmitting ? 0.7 : 1, cursor: rideSubmitting ? "not-allowed" : "pointer" }}>
                    {rideSubmitting ? "Booking..." : "Confirm Test Ride →"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Inline Order Now form */}
          {panel === "order" && !isUpcoming && (
            <div className="inline-panel" style={{ marginTop: 20, background: "#FFFFFF", borderRadius: 20, boxShadow: "8px 8px 20px rgba(13,81,140,0.08), -6px -6px 16px rgba(255,255,255,0.95)", padding: 28 }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "var(--navy)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Order Now</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Order {product.name}</h3>
                <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "6px 0 0", lineHeight: 1.6 }}>Our team will call within 2 hours to confirm your order and payment details.</p>
              </div>

              {orderSuccess ? (
                <div style={{ textAlign: "center", padding: "24px 8px" }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", margin: "0 0 8px" }}>Order Request Received!</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 10 }}>
                    Our team will call you within 2 hours to confirm your order and payment details.
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: "0 0 4px" }}>Reference ID: <strong style={{ color: "var(--navy)" }}>{orderId}</strong></p>
                  <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>Expected Delivery: 3–7 business days</p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {orderError && (
                    <p style={{ fontSize: 12, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 8, padding: "8px 12px", margin: 0 }}>{orderError}</p>
                  )}
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" required value={orderForm.name} onChange={(e) => setOrderForm((f) => ({ ...f, name: e.target.value }))} placeholder="Rajesh Kumar" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" required value={orderForm.phone} onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" required value={orderForm.email} onChange={(e) => setOrderForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>City / District</label>
                    <input type="text" required value={orderForm.city} onChange={(e) => setOrderForm((f) => ({ ...f, city: e.target.value }))} placeholder="Bhubaneswar" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Delivery Address</label>
                    <textarea rows={2} required value={orderForm.address} onChange={(e) => setOrderForm((f) => ({ ...f, address: e.target.value }))} placeholder="House no, street, landmark" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Special Requirements (optional)</label>
                    <textarea rows={2} value={orderForm.requirements} onChange={(e) => setOrderForm((f) => ({ ...f, requirements: e.target.value }))} placeholder="Preferred colour, accessories, etc." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <button type="submit" disabled={orderSubmitting} className="clay-btn clay-btn-primary" style={{ height: 48, fontSize: 15, opacity: orderSubmitting ? 0.7 : 1, cursor: orderSubmitting ? "not-allowed" : "pointer" }}>
                    {orderSubmitting ? "Submitting..." : "Submit Order Request →"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <RelatedProducts current={product} />

      <style>{`
        @keyframes vehicleKenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.03); }
        }
        .vehicle-image-box { height: 420px; }
        .vehicle-image-box:hover .vehicle-hero-img { transform: scale(1.04); }
        @media (max-width: 1024px) {
          .vehicle-image-box { height: 320px; }
        }
        @media (max-width: 900px) {
          .vehicle-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 640px) {
          .vehicle-image-box { height: 240px; }
        }
      `}</style>
    </div>
  );
}

const iconBtnStyle = {
  width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(13,81,140,0.1)",
  background: "#FFFFFF", boxShadow: "3px 3px 8px rgba(13,81,140,0.08), -2px -2px 6px rgba(255,255,255,0.9)",
  cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
};

function FullSpecsAccordion({ specs, isUpcoming }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 24 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: open ? 14 : 0 }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
          {isUpcoming ? "🚀 Upcoming New Model — Specifications" : "View All Specifications"}
        </h3>
        <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18, color: "var(--navy)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>
      {open && (
        <div className="specs-table">
          {specs.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", padding: "12px 16px", background: i % 2 === 0 ? "rgba(13,81,140,0.02)" : "transparent", borderBottom: "1px solid rgba(13,81,140,0.05)" }}>
              <span style={{ width: "45%", fontSize: 14, color: "#4A6785" }}>{k}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0C1A2E" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
