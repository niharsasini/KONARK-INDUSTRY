"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { products, CATEGORIES } from "@/components/product/ProductData";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TRUST_PILLS = ["✓ ISI Certified", "✓ 2-Year Warranty", "✓ Doorstep Service"];

const CATEGORY_CHIPS = [
  { icon: "⚡", label: "EV Scooters", href: "/products?cat=ev" },
  { icon: "🛺", label: "E-Rickshaws", href: "/products?cat=rickshaw" },
  { icon: "🔋", label: "LFP Batteries", href: "/products?cat=battery" },
];

const CAR_IMAGES = [
  "/konark/car-1 (1).png",
  "/konark/car-2.png",
  "/konark/car-3.png",
  "/konark/car-4.png",
  "/konark/car-5.png",
  "/konark/car-6.png",
  "/konark/car-7.png",
  "/konark/car-8.png",
];

const vehicleProducts = products
  .filter((p) => p.type === "vehicle" && p.category !== CATEGORIES.INDUSTRIAL)
  .slice(0, 4);
const industrialProducts = products.filter(
  (p) => p.type === "vehicle" && p.category === CATEGORIES.INDUSTRIAL
);

const ROTATING_WORDS = ["Konark.", "Innovation.", "Sustainability."];

const DECK = [
  ...vehicleProducts.map((p) => ({
    type: "product",
    src: p.image,
    name: p.name,
    price: p.price,
    slug: p.slug,
    badge: "FEATURED",
    badgeColor: "#c17f24",
    specs: [p.category.replace("Electric Vehicles", "Electric"), `⭐ ${p.rating}`],
  })),
  ...industrialProducts.map((p) => ({
    type: "product",
    src: p.image,
    name: p.name,
    price: p.isUpcoming ? null : p.price,
    slug: p.slug,
    badge: p.isUpcoming ? "UPCOMING" : p.isNew ? "NEW" : "FEATURED",
    badgeColor: p.isUpcoming ? "#a78bfa" : "#c17f24",
    specs: [p.category, `⭐ ${p.rating}`],
  })),
  ...CAR_IMAGES.map((src) => ({
    type: "car",
    src,
    name: "EV Car — Coming Soon",
    price: null,
    slug: null,
    badge: "UPCOMING",
    badgeColor: "#a78bfa",
    specs: ["Electric", "New Model 2025"],
  })),
];

export default function Hero() {
  const router = useRouter();
  const settings = useSiteSettings();
  const heroTagline = settings?.hero_tagline || "Powering Odisha since 2014";
  const [current, setCurrent] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % DECK.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(wordTimer);
  }, []);

  const advance = () => setCurrent((prev) => (prev + 1) % DECK.length);
  const goBack = () => setCurrent((prev) => (prev - 1 + DECK.length) % DECK.length);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? advance() : goBack(); }
    touchStartX.current = null;
  };

  const card = DECK[current];

  return (
    <section
      className="hero-section"
      style={{
        minHeight: "calc(100vh - 64px - var(--banner-h, 0px))",
        background: "transparent",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Split background — warm cream left, dark navy right */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, width: "60%", height: "100%",
          background: "linear-gradient(135deg, #f5f0e8, #e3dacd)",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, width: "45%", height: "100%",
          background: "linear-gradient(135deg, #0f4c81, #1a0f00)",
          clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, transparent 50%, rgba(15,76,129,0.1) 55%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(15,76,129,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, transparent, #c17f24, transparent)",
        }} />
      </div>

      {/* Content */}
      <div className="hero-container" style={{ position: "relative", zIndex: 2 }}>
        {/* LEFT */}
        <div className="hero-left" style={{ paddingRight: 48 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ marginBottom: 16 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(15,76,129,0.1)", border: "1px solid rgba(15,76,129,0.3)",
              color: "#0f4c81", fontSize: 12, fontWeight: 700,
              padding: "6px 16px", borderRadius: 20,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#0f4c81",
                animation: "pulse-glow 2s ease infinite",
                display: "inline-block",
              }} />
              {heroTagline}
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginBottom: 0 }}>
            {[
              { text: "Power Your" },
              { text: "World With" },
            ].map((line, i) => (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              >
                <h1 style={{
                  fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900,
                  color: "#1a0f00", lineHeight: 1.1, letterSpacing: "-2px", margin: 0,
                }}>
                  {line.text}
                </h1>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              style={{ minHeight: "1.2em" }}
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={wordIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900,
                    letterSpacing: "-2px", margin: 0,
                    backgroundImage: "linear-gradient(135deg, #0f4c81, #c17f24)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    display: "inline-block",
                  }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ fontSize: 17, color: "#6b5a45", lineHeight: 1.7, marginTop: 20, maxWidth: 480 }}
          >
            We make electric scooters, e-rickshaws, and batteries in Bhubaneswar.
            We fix your AC, EV charger, and electrical faults at your doorstep.
            One company. Every power need. Across Odisha.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/products")}
              style={{
                background: "linear-gradient(135deg, #0f4c81, #0a3460)",
                color: "#fff", padding: "14px 32px", border: "none",
                borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(15,76,129,0.35)", transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,76,129,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,76,129,0.35)"; }}
            >
              Shop Products →
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/services/enquiry")}
              style={{
                background: "transparent", border: "2px solid #1a0f00", color: "#1a0f00",
                padding: "12px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1a0f00"; e.currentTarget.style.color = "#f5f0e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a0f00"; }}
            >
              Book a Service →
            </motion.button>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            style={{ marginTop: 24, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#6b5a45" }}
          >
            {TRUST_PILLS.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — playing card deck on dark navy */}
        <div
          className="hero-right-col"
          style={{ perspective: "1200px" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 360, margin: "0 auto", minHeight: 380 }}>
            {/* Stack back cards */}
            {[
              { deckOffset: 3, rotate: -6, tx: -18, ty: 12, opacity: 0.3, zIndex: 1 },
              { deckOffset: 2, rotate: -3, tx: -9,  ty: 6,  opacity: 0.52, zIndex: 2 },
              { deckOffset: 1, rotate: -1, tx: -3,  ty: 2,  opacity: 0.75, zIndex: 3 },
            ].map(({ deckOffset, rotate, tx, ty, opacity, zIndex }, i) => {
              const deckIdx = (current + deckOffset) % DECK.length;
              const backCard = DECK[deckIdx];
              return (
                <div
                  key={i}
                  onClick={() => setCurrent(deckIdx)}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 24,
                    transform: `rotate(${rotate}deg) translate(${tx}px, ${ty}px)`,
                    transformOrigin: "center bottom",
                    opacity,
                    zIndex,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <img
                    src={backCard.src}
                    alt=""
                    style={{
                      maxHeight: "65%", maxWidth: "80%",
                      objectFit: "contain",
                      filter: "blur(1px) brightness(0.6)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              );
            })}

            {/* Front card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ x: 55, y: -22, opacity: 0, rotate: 9, scale: 0.88 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ x: -70, y: 8, opacity: 0, rotate: -8, scale: 0.9 }}
                transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: "relative", zIndex: 3,
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 24,
                  padding: 24,
                  cursor: card.slug ? "pointer" : "default",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  transformStyle: "preserve-3d",
                  animation: "floatCard 6s ease-in-out infinite",
                }}
                onClick={() => { if (card.slug) router.push(`/products/${card.slug}`); }}
              >
                {/* Image with badge inside */}
                <div style={{
                  width: "100%", height: 240,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.2)", borderRadius: 12,
                  overflow: "hidden", marginBottom: 16,
                  position: "relative",
                }}>
                  <span style={{
                    position: "absolute", top: 12, left: 12, zIndex: 1,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#1a0f00",
                    background: "#fff",
                    padding: "3px 10px", borderRadius: 4,
                  }}>
                    {card.badge}
                  </span>
                  <img
                    src={card.src}
                    alt={card.name}
                    style={{
                      maxHeight: 220, maxWidth: "90%", objectFit: "contain",
                      filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.35))",
                    }}
                  />
                </div>

                {/* Name */}
                <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
                  {card.name}
                </p>

                {/* Price */}
                <p style={{
                  fontSize: 22, fontWeight: 800,
                  color: "#c17f24",
                  margin: "0 0 14px",
                }}>
                  {card.price ? `₹${card.price.toLocaleString("en-IN")}` : "Coming Soon"}
                </p>

                {/* Spec chips */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {card.specs.map((s) => (
                    <span key={s} style={{
                      fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      padding: "4px 10px", borderRadius: 6,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {card.slug ? (
                  <Link
                    href={`/products/${card.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 12, color: "#c17f24", textDecoration: "none", fontWeight: 600 }}
                  >
                    View Product →
                  </Link>
                ) : (
                  <Link
                    href="/contact?interest=ev-car"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 12, color: "#c17f24", textDecoration: "none", fontWeight: 600 }}
                  >
                    Register Interest →
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14 }}>
            {DECK.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 24 : 8,
                  height: 8, borderRadius: 4,
                  background: i === current ? "#c17f24" : "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  transition: "all 300ms",
                }}
              />
            ))}
          </div>

          {/* Category chips */}
          <motion.div
            className="hero-category-chips"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {CATEGORY_CHIPS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                style={{
                  flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 4, padding: "10px 8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
                  textDecoration: "none", fontSize: 11,
                  color: "rgba(255,255,255,0.7)", fontWeight: 600, textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c17f24";
                  e.currentTarget.style.color = "#c17f24";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                {c.label} →
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 4, color: "#6b5a45", zIndex: 10,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18, color: "#0f4c81" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}
