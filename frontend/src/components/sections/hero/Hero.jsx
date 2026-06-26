"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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

const CARD_ANIM = {
  idle: { opacity: 1, transform: "translateX(0) rotate(0deg) scale(1)", transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" },
  exit: { opacity: 0, transform: "translateX(-60px) rotate(-3deg) scale(0.95)", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" },
  enter: { opacity: 0, transform: "translateX(80px) rotate(3deg) scale(0.97)", transition: "none" },
};

export default function Hero() {
  const router = useRouter();
  const settings = useSiteSettings();
  const heroTagline = settings?.hero_tagline || "Powering Odisha since 2014";
  const heroSubheading = settings?.hero_subheading ||
    "We make electric scooters, e-rickshaws, and batteries in Bhubaneswar.\nWe fix your AC, EV charger, and electrical faults at your doorstep.\nOne company. Every power need. Across Odisha.";
  const rotatingWords = (settings?.hero_rotating_words?.length ? settings.hero_rotating_words : ROTATING_WORDS);
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState("idle");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const touchStartX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimState("exit");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % DECK.length);
        setAnimState("enter");
        setTimeout(() => setAnimState("idle"), 50);
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords.length);
        setWordVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(wordTimer);
  }, []);

  const throwCard = (nextFn) => {
    setAnimState("exit");
    setTimeout(() => {
      nextFn();
      setAnimState("enter");
      setTimeout(() => setAnimState("idle"), 50);
    }, 400);
  };
  const advance = () => throwCard(() => setCurrent((prev) => (prev + 1) % DECK.length));
  const goBack = () => throwCard(() => setCurrent((prev) => (prev - 1 + DECK.length) % DECK.length));

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
        minHeight: "calc(100vh - var(--banner-h, 0px))",
        paddingTop: "calc(64px + var(--banner-h, 0px))",
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
            >
              <span style={{
                display: "block",
                background: "linear-gradient(135deg, #0f4c81 0%, #c17f24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 1.1,
                minHeight: "1.15em",
                margin: 0,
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}>
                {rotatingWords[wordIndex]}
              </span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ fontSize: 17, color: "#6b5a45", lineHeight: 1.7, marginTop: 20, maxWidth: 480 }}
          >
            {heroSubheading.split("\n").map((line, i) => (
              <span key={i}>{line}{i < heroSubheading.split("\n").length - 1 ? <br /> : null}</span>
            ))}
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

            {/* Front card — physical card throw animation */}
            <div style={{ position: "relative", zIndex: 4, ...CARD_ANIM[animState] }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  cursor: card.slug ? "pointer" : "default",
                  animation: animState === "idle" ? "floatCard 6s ease-in-out infinite" : "none",
                }}
                onClick={() => { if (card.slug) router.push(`/products/${card.slug}`); }}
              >
                {/* Image area — full width to edges */}
                <div style={{ height: 220, position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.2)" }}>
                  <img
                    src={card.src}
                    alt={card.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16, boxSizing: "border-box", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.35))" }}
                  />
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: "rgba(193,127,36,0.9)", color: "#fff",
                    fontSize: 10, fontWeight: 800, padding: "4px 12px",
                    borderRadius: 20, letterSpacing: "1px", textTransform: "uppercase",
                  }}>
                    {card.badge}
                  </span>
                </div>

                {/* Info panel */}
                <div style={{ padding: "16px 20px 20px", background: "rgba(10,20,40,0.7)", backdropFilter: "blur(8px)" }}>
                  <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.2 }}>
                    {card.name}
                  </p>
                  <p style={{ color: "#c17f24", fontSize: 17, fontWeight: 700, margin: "0 0 10px" }}>
                    {card.price ? `₹${card.price.toLocaleString("en-IN")}` : "Coming Soon"}
                  </p>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                    {card.specs.map((s) => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 20 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  {card.slug ? (
                    <Link href={`/products/${card.slug}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: 13, color: "#c17f24", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      View Product →
                    </Link>
                  ) : (
                    <Link href="/contact?interest=ev-car" onClick={(e) => e.stopPropagation()} style={{ fontSize: 13, color: "#c17f24", textDecoration: "none", fontWeight: 600 }}>
                      Register Interest →
                    </Link>
                  )}
                </div>
              </div>
            </div>
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
                  color: "#ffffff", fontWeight: 600, textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c17f24";
                  e.currentTarget.style.color = "#c17f24";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#ffffff";
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
