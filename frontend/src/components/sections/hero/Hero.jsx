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
    badgeColor: "#00d4ff",
    specs: [p.category.replace("Electric Vehicles", "Electric"), `⭐ ${p.rating}`],
  })),
  ...industrialProducts.map((p) => ({
    type: "product",
    src: p.image,
    name: p.name,
    price: p.isUpcoming ? null : p.price,
    slug: p.slug,
    badge: p.isUpcoming ? "UPCOMING" : p.isNew ? "NEW" : "FEATURED",
    badgeColor: p.isUpcoming ? "#7c3aed" : "#00d4ff",
    specs: [p.category, `⭐ ${p.rating}`],
  })),
  ...CAR_IMAGES.map((src) => ({
    type: "car",
    src,
    name: "EV Car — Coming Soon",
    price: null,
    slug: null,
    badge: "UPCOMING",
    badgeColor: "#7c3aed",
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
    }, 3000);
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
    <section className="hero-section" style={{ paddingTop: 64 }}>
      {/* Animated grid layer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Glowing orbs */}
      <div className="hero-orb-cyan" style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        animation: "float 8s ease-in-out infinite",
      }} />
      <div className="hero-orb-purple" style={{
        position: "absolute", bottom: "-20%", left: "-10%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        animation: "float 10s ease-in-out infinite reverse",
      }} />

      {/* Rotating rings */}
      <div className="hero-ring-1" style={{
        position: "absolute", top: "50%", right: "5%",
        transform: "translateY(-50%)",
        width: "500px", height: "500px",
        border: "1px solid rgba(0,212,255,0.08)",
        borderRadius: "50%",
        animation: "spin 30s linear infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div className="hero-ring-2" style={{
        position: "absolute", top: "50%", right: "5%",
        transform: "translateY(-50%)",
        width: "380px", height: "380px",
        marginTop: "-60px", marginRight: "-60px",
        border: "1px solid rgba(124,58,237,0.08)",
        borderRadius: "50%",
        animation: "spin 20s linear infinite reverse",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Content */}
      <div className="hero-container">
        {/* LEFT */}
        <div className="hero-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ marginBottom: 28 }}
          >
            <span className="hero-badge">
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#00d4ff",
                boxShadow: "0 0 8px #00d4ff",
                animation: "pulse-glow 2s infinite",
                display: "inline-block",
              }} />
              {heroTagline}
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginBottom: 24 }}>
            {[
              { text: "Power Your", gradient: false },
              { text: "World With", gradient: false },
            ].map((line, i) => (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              >
                <h1 className="hero-headline" style={{ color: "#f1f5f9" }}>
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
                  className="hero-headline"
                  style={{
                    background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    margin: 0,
                  }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            We make electric scooters, e-rickshaws, and batteries in Bhubaneswar.
            We fix your AC, EV charger, and electrical faults at your doorstep.
            One company. Every power need. Across Odisha.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="hero-btn-row hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/products")}
              className="hero-btn-primary"
            >
              Shop Products →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/services/enquiry")}
              className="hero-btn-ghost"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)";
                e.currentTarget.style.color = "#00d4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(241,245,249,0.2)";
                e.currentTarget.style.color = "#f1f5f9";
              }}
            >
              Book a Service →
            </motion.button>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            className="hero-trust-row hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            {TRUST_PILLS.map((pill) => (
              <span key={pill} className="hero-trust-pill">
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — playing card deck */}
        <div
          className="hero-right-col"
          style={{ perspective: "1200px" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 360, margin: "0 auto", minHeight: 380 }}>
            {/* Stack back cards — real upcoming images from the deck */}
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
                    background: "rgba(15,23,42,0.92)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(0,212,255,0.12)",
                    borderRadius: 20,
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
                      filter: "blur(1px) brightness(0.45)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              );
            })}

            {/* Front card with "deal from deck" animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ x: 55, y: -22, opacity: 0, rotate: 9, scale: 0.88 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ x: -70, y: 8, opacity: 0, rotate: -8, scale: 0.9 }}
                transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: "relative", zIndex: 3,
                  background: "rgba(13, 20, 36, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0, 212, 255, 0.2)",
                  borderRadius: 20,
                  padding: 24,
                  cursor: card.slug ? "pointer" : "default",
                  boxShadow: "0 0 30px rgba(0,212,255,0.15), 0 20px 60px rgba(0,0,0,0.5)",
                  transformStyle: "preserve-3d",
                  animation: "float 6s ease-in-out infinite",
                }}
                onClick={() => { if (card.slug) router.push(`/products/${card.slug}`); }}
              >
                {/* Image with badge inside */}
                <div style={{
                  width: "100%", height: 240,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#060d1a", borderRadius: 12,
                  overflow: "hidden", marginBottom: 16,
                  position: "relative",
                }}>
                  <span style={{
                    position: "absolute", top: 12, left: 12, zIndex: 1,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: card.badgeColor,
                    background: `${card.badgeColor}18`,
                    border: `1px solid ${card.badgeColor}38`,
                    padding: "3px 10px", borderRadius: 4,
                  }}>
                    {card.badge}
                  </span>
                  <img
                    src={card.src}
                    alt={card.name}
                    style={{
                      maxHeight: 220, maxWidth: "90%", objectFit: "contain",
                      filter: `drop-shadow(0 4px 24px ${card.badgeColor}35)`,
                    }}
                  />
                </div>

                {/* Name */}
                <p style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>
                  {card.name}
                </p>

                {/* Price */}
                <p style={{
                  fontSize: 22, fontWeight: 800,
                  color: "#00d4ff",
                  margin: "0 0 14px",
                }}>
                  {card.price ? `₹${card.price.toLocaleString("en-IN")}` : "Coming Soon"}
                </p>

                {/* Spec chips */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {card.specs.map((s) => (
                    <span key={s} style={{
                      fontSize: 11, fontWeight: 600, color: "#a78bfa",
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.3)",
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
                    style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}
                  >
                    View Product →
                  </Link>
                ) : (
                  <Link
                    href="/contact?interest=ev-car"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 12, color: card.badgeColor, textDecoration: "none", fontWeight: 600 }}
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
                  background: i === current ? "#00d4ff" : "#1e2d40",
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
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid #1e2d40", borderRadius: 10,
                  textDecoration: "none", fontSize: 11,
                  color: "#94a3b8", fontWeight: 600, textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00d4ff";
                  e.currentTarget.style.color = "#00d4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e2d40";
                  e.currentTarget.style.color = "#94a3b8";
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
          gap: 4, color: "#94a3b8", zIndex: 10,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18, color: "#00d4ff" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}
