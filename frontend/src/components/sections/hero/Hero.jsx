"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products, CATEGORIES } from "@/components/product/ProductData";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TRUST_PILLS = ["ISI Certified", "2-Year Warranty", "Doorstep Service"];

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
    badgeColor: "var(--gold)",
    specs: [p.category.replace("Electric Vehicles", "Electric"), `⭐ ${p.rating}`],
  })),
  ...industrialProducts.map((p) => ({
    type: "product",
    src: p.image,
    name: p.name,
    price: p.isUpcoming ? null : p.price,
    slug: p.slug,
    badge: p.isUpcoming ? "UPCOMING" : p.isNew ? "NEW" : "FEATURED",
    badgeColor: p.isUpcoming ? "var(--sky)" : "var(--gold)",
    specs: [p.category, `⭐ ${p.rating}`],
  })),
  ...CAR_IMAGES.map((src) => ({
    type: "car",
    src,
    name: "EV Car — Coming Soon",
    price: null,
    slug: null,
    badge: "UPCOMING",
    badgeColor: "var(--sky)",
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
        paddingTop: "calc(68px + var(--banner-h, 0px))",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background layers */}
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,81,140,0.2) 0%, transparent 65%)",
        top: -200, right: -150, animation: "orbFloat1 14s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,103,149,0.15) 0%, transparent 65%)",
        bottom: -150, left: -100, animation: "orbFloat2 18s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 70%)",
        top: "40%", left: "45%", animation: "orbFloat1 22s ease-in-out infinite reverse", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(92,103,149,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(92,103,149,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(79,195,247,0.3) 50%, transparent 100%)",
        animation: "scanLine 10s linear infinite", pointerEvents: "none",
      }} />

      {/* Content */}
      <div className="hero-container" style={{ position: "relative", zIndex: 2 }}>
        {/* LEFT */}
        <div className="hero-left">
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(13,81,140,0.2)", border: "1px solid rgba(79,195,247,0.3)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 20,
            animation: "fadeInUp 0.5s ease",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--sky)",
              animation: "pulseGlow 2s ease infinite",
              display: "inline-block",
            }} />
            <span style={{ color: "var(--sky)", fontSize: 12, fontWeight: 700, letterSpacing: "0.5px" }}>
              {heroTagline}
            </span>
          </div>

          {/* Headline */}
          <div>
            {["Power Your", "World With"].map((line, i) => (
              <h1
                key={line}
                className="hero-headline"
                style={{
                  fontSize: "clamp(38px, 5.5vw, 72px)", fontWeight: 900,
                  color: "var(--text-heading)", letterSpacing: "-2px", lineHeight: 1.05, margin: 0,
                  animation: `fadeInUp 0.6s ease ${0.1 + i * 0.1}s both`,
                }}
              >
                {line}
              </h1>
            ))}
            <span
              className="hero-headline gradient-text"
              style={{
                display: "block",
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 1.05,
                minHeight: "1.1em",
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {rotatingWords[wordIndex]}
            </span>
          </div>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7,
              marginTop: 20, marginBottom: 32, maxWidth: 460,
              animation: "fadeInUp 0.6s ease 0.2s both",
            }}
          >
            {heroSubheading.split("\n").map((line, i) => (
              <span key={i}>{line}{i < heroSubheading.split("\n").length - 1 ? <br /> : null}</span>
            ))}
          </p>

          {/* Buttons */}
          <div
            className="hero-btn-row"
            style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.3s both" }}
          >
            <button
              className="hero-btn-primary"
              onClick={() => router.push("/products")}
              style={{
                background: "var(--grad-primary)",
                color: "var(--text-heading)", padding: "14px 32px", border: "none",
                borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 8px 28px rgba(13,81,140,0.4)", transition: "all 0.3s ease",
                animation: "pulseGlow 3s ease infinite",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(13,81,140,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(13,81,140,0.4)"; }}
            >
              Shop Products →
            </button>
            <button
              className="hero-btn-ghost"
              onClick={() => router.push("/services/enquiry")}
              style={{
                background: "rgba(92,103,149,0.12)", color: "var(--text-heading)",
                padding: "13px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
                border: "1.5px solid rgba(92,103,149,0.35)", transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(92,103,149,0.22)";
                e.currentTarget.style.borderColor = "var(--sky)";
                e.currentTarget.style.color = "var(--sky)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(92,103,149,0.12)";
                e.currentTarget.style.borderColor = "rgba(92,103,149,0.35)";
                e.currentTarget.style.color = "var(--text-heading)";
              }}
            >
              Book a Service →
            </button>
          </div>

          {/* Trust pills */}
          <div
            className="hero-trust-row"
            style={{ marginTop: 28, display: "flex", gap: 24, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.4s both" }}
          >
            {TRUST_PILLS.map((pill) => (
              <span
                className="hero-trust-pill"
                key={pill}
                style={{ color: "var(--text-subtle)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — glass card deck */}
        <div
          className="hero-right-col"
          style={{ perspective: "1200px" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto", minHeight: 380 }}>
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
                    background: "rgba(22,41,82,0.5)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(79,195,247,0.12)",
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

            {/* Front card — glassmorphism, physical card throw animation */}
            <div style={{ position: "relative", zIndex: 4, ...CARD_ANIM[animState] }}>
              <div
                className="hero-product-card-inner"
                style={{
                  background: "rgba(22,41,82,0.7)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(79,195,247,0.15)",
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(10,14,26,0.6), 0 0 0 1px rgba(79,195,247,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                  cursor: card.slug ? "pointer" : "default",
                  animation: animState === "idle" ? "float 6s ease-in-out infinite" : "none",
                }}
                onClick={() => { if (card.slug) router.push(`/products/${card.slug}`); }}
              >
                {/* Image area */}
                <div className="hero-product-card-imgwrap" style={{
                  height: 220, position: "relative", overflow: "hidden",
                  background: "linear-gradient(135deg, var(--bg-surface), var(--bg-card))",
                }}>
                  <img
                    src={card.src}
                    alt={card.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16, boxSizing: "border-box", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.35))" }}
                  />
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: "rgba(13,81,140,0.8)", color: "var(--sky)",
                    fontSize: 10, fontWeight: 800, padding: "4px 12px",
                    borderRadius: 20, letterSpacing: "1.2px", textTransform: "uppercase",
                    display: "inline-block",
                  }}>
                    {card.badge}
                  </span>
                </div>

                {/* Info panel */}
                <div style={{ padding: "20px 24px 24px", background: "rgba(10,14,26,0.5)" }}>
                  <p style={{ color: "var(--text-heading)", fontSize: 20, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.2 }}>
                    {card.name}
                  </p>
                  <p style={{ color: "var(--gold)", fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>
                    {card.price ? `₹${card.price.toLocaleString("en-IN")}` : "Coming Soon"}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginBottom: 0, flexWrap: "wrap" }}>
                    {card.specs.map((s) => (
                      <span key={s} style={{
                        fontSize: 11, color: "var(--text-muted)",
                        background: "rgba(92,103,149,0.15)", border: "1px solid rgba(92,103,149,0.25)",
                        padding: "3px 10px", borderRadius: 20,
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  {card.slug ? (
                    <Link
                      href={`/products/${card.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 14, color: "var(--sky)", textDecoration: "none", fontWeight: 600, marginTop: 14, display: "inline-flex", alignItems: "center", gap: 4 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-heading)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sky)")}
                    >
                      View Product →
                    </Link>
                  ) : (
                    <Link
                      href="/contact?interest=ev-car"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 14, color: "var(--sky)", textDecoration: "none", fontWeight: 600, marginTop: 14, display: "inline-flex", alignItems: "center", gap: 4 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-heading)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sky)")}
                    >
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
                  width: i === current ? 20 : 6,
                  height: 6, borderRadius: i === current ? 3 : "50%",
                  background: i === current ? "var(--sky)" : "rgba(92,103,149,0.4)",
                  cursor: "pointer",
                  transition: "all 300ms",
                }}
              />
            ))}
          </div>

          {/* Category chips */}
          <div className="hero-category-chips" style={{ animation: "fadeInUp 0.6s ease 0.5s both" }}>
            {CATEGORY_CHIPS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                style={{
                  flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "10px 18px",
                  background: "rgba(22,41,82,0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(92,103,149,0.2)", borderRadius: 12,
                  textDecoration: "none", fontSize: 12,
                  color: "var(--text-body)", fontWeight: 600, textAlign: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(79,195,247,0.4)";
                  e.currentTarget.style.color = "var(--sky)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(92,103,149,0.2)";
                  e.currentTarget.style.color = "var(--text-body)";
                }}
              >
                <span style={{ fontSize: 16, color: "var(--gold)" }}>{c.icon}</span>
                {c.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 4, color: "rgba(92,103,149,0.5)", zIndex: 10,
        animation: "float 1.5s ease-in-out infinite",
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
