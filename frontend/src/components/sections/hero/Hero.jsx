"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { products, CATEGORIES } from "@/components/product/ProductData";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useCartStore, useWishlistStore } from "@/store";
import { useAuthGate } from "@/hooks/useAuthGate";

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

// Up to 3 short tags describing the card — distinct from the category
// badge/label (which already show the category on its own). "Made in
// India" is always reserved as the last slot rather than competing with
// the other conditional tags for the cap, since it's a trust signal we
// always want visible.
function buildTags(productType, category, isNew) {
  const cat = category || "";
  const tags = [];
  if (productType === "vehicle" || cat.includes("Electric")) tags.push("⚡ Electric");
  if (cat.includes("Battery") || cat.includes("LFP")) tags.push("🔋 LFP");
  if (cat.includes("Appliance") || cat.includes("Home")) tags.push("🏠 Home");
  if (cat.includes("Solar") || cat.includes("Energy")) tags.push("☀️ Solar");
  if (cat.includes("Industrial")) tags.push("🏭 Industrial");
  if (isNew) tags.push("✨ New");
  return [...tags.slice(0, 2), "🇮🇳 Made in India"];
}

// Left-side CTA link text varies by product type; cards with no slug
// (upcoming teasers) always ask to register interest.
function ctaLabel(card) {
  if (!card.slug) return "Register Interest →";
  if (card.productType === "vehicle") return "Book Test Ride →";
  if (card.productType === "service") return "Book Service →";
  return "View Product →"; // the round quick-add button handles "add to cart"
}

const CAR_CARDS = CAR_IMAGES.map((src) => ({
  type: "car",
  productType: "car",
  src,
  name: "EV Car — Coming Soon",
  price: null,
  slug: null,
  category: "Electric",
  rating: null,
  isUpcoming: true,
  canAddToCart: false,
  cartPayload: null,
  badge: "UPCOMING",
  badgeBg: "rgba(124,58,237,0.9)",
  tags: ["⚡ Electric", "New Model 2025", "🇮🇳 Made in India"],
}));

// Admin hasn't curated any "featured" products yet — show a sensible
// static selection so the deck is never empty on a fresh install.
function buildStaticDeck() {
  const vehicleProducts = products
    .filter((p) => p.type === "vehicle" && p.category !== CATEGORIES.INDUSTRIAL)
    .slice(0, 4);
  const industrialProducts = products.filter(
    (p) => p.type === "vehicle" && p.category === CATEGORIES.INDUSTRIAL
  );
  return [...vehicleProducts, ...industrialProducts].map((p) => ({
    type: "product",
    productType: p.type,
    src: p.image || "/placeholder.svg",
    name: p.name,
    price: p.isUpcoming ? null : p.price,
    slug: p.slug,
    category: p.category,
    rating: p.rating,
    isUpcoming: !!p.isUpcoming,
    canAddToCart: false, // vehicles go through the test-ride flow, not cart
    cartPayload: null,
    badge: p.isUpcoming ? "UPCOMING" : p.isNew ? "NEW" : "FEATURED",
    badgeBg: p.isUpcoming
      ? "rgba(124,58,237,0.9)"
      : p.isNew
      ? "rgba(5,150,105,0.9)"
      : "linear-gradient(135deg, #0D518C, #0EA5E9)",
    tags: buildTags(p.type, p.category, p.isNew),
  }));
}

// Admin-curated products from GET /products?featured=true
function buildBackendDeck(items) {
  return items.slice(0, 5).map((p) => ({
    type: "product",
    productType: p.type,
    src: p.images?.[0] || "/placeholder.svg",
    name: p.name,
    price: p.price > 0 ? p.price : null,
    slug: p.slug,
    category: p.category,
    rating: p.rating,
    isUpcoming: false,
    canAddToCart: p.type === "product" && p.in_stock,
    cartPayload: p.type === "product" && p.in_stock
      ? { id: p.id || p.slug, slug: p.slug, name: p.name, price: p.price, image: p.images?.[0] || "", category: p.category, type: p.type }
      : null,
    badge: p.is_new ? "NEW" : "FEATURED",
    badgeBg: p.is_new ? "rgba(5,150,105,0.9)" : "linear-gradient(135deg, #0D518C, #0EA5E9)",
    tags: buildTags(p.type, p.category, p.is_new),
  }));
}

const ROTATING_WORDS = ["Konark.", "Innovation.", "Sustainability."];

const CARD_ANIM = {
  idle: { opacity: 1, transform: "translateX(0) rotate(0deg) scale(1)", transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.2,0.64,1)" },
  exit: { opacity: 0, transform: "translateX(-50px) rotate(-3deg) scale(0.95)", transition: "opacity 0.35s ease, transform 0.35s ease" },
  enter: { opacity: 0, transform: "translateX(50px) rotate(3deg) scale(0.95)", transition: "none" },
};

// Commits the "enter" (off-screen, transition:none) styles to the DOM
// on one frame before switching to "idle" on the next, so the browser
// actually animates the transition instead of skipping straight to the
// end state — a fixed setTimeout(...,50) can't guarantee that.
function nextFrame(cb) {
  requestAnimationFrame(() => requestAnimationFrame(cb));
}

export default function Hero() {
  const router = useRouter();
  const settings = useSiteSettings();
  const featuredProducts = useFeaturedProducts();
  const { addItem } = useCartStore();
  const { toggle: toggleWishlist, isInWishlist } = useWishlistStore();
  const { requireAuth } = useAuthGate();
  const heroTagline = settings?.hero_tagline || "Powering Odisha since 2014";
  const heroSubheading = settings?.hero_subheading ||
    "We make EVs, batteries and appliances in Bhubaneswar.\nOne company. Every power need.";
  const rotatingWords = (settings?.hero_rotating_words?.length ? settings.hero_rotating_words : ROTATING_WORDS);

  const DECK = useMemo(() => {
    const productCards = featuredProducts && featuredProducts.length > 0
      ? buildBackendDeck(featuredProducts)
      : buildStaticDeck();
    return [...productCards, ...CAR_CARDS];
  }, [featuredProducts]);

  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState("idle");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const touchStartX = useRef(null);

  useEffect(() => {
    const run = async () => {
      try {
        const gsapMod = await import("gsap");
        gsapMod.default.from(".hero-section", {
          opacity: 0, duration: 1, ease: "power2.out",
        });
      } catch {}
    };
    run();
  }, []);

  useEffect(() => {
    if (current >= DECK.length) setCurrent(0);
  }, [DECK.length, current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimState("exit");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % DECK.length);
        setAnimState("enter");
        nextFrame(() => setAnimState("idle"));
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, [DECK.length]);

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
      nextFrame(() => setAnimState("idle"));
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
  if (!card) return null;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!card.cartPayload) return;
    requireAuth(() => {
      addItem(card.cartPayload);
      toast.success(`${card.name} added to cart!`);
    }, `/products/${card.slug}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!card.slug) return;
    toggleWishlist(card.slug);
    toast(isInWishlist(card.slug) ? "Removed from wishlist" : `${card.name} saved ❤️`);
  };

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
      {/* Animated background layers — cinematic IMAX-style depth */}
      {/* 1. Cinematic gradient base */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #F5F7FF 0%, #EEF2FF 30%, #FFFFFF 60%, #F0F4FF 80%, #F5F7FF 100%)",
        pointerEvents: "none",
      }} />
      {/* 2. Top center glow (main spotlight) */}
      <div style={{
        position: "absolute", width: 900, height: 600, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(13,81,140,0.35) 0%, rgba(13,81,140,0.08) 40%, transparent 70%)",
        top: -200, left: "50%", transform: "translateX(-50%)",
        animation: "orbFloat1 16s ease-in-out infinite", pointerEvents: "none",
      }} />
      {/* 3. Right accent (product card side) */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,81,140,0.2) 0%, transparent 65%)",
        top: -100, right: -100, animation: "orbFloat2 20s ease-in-out infinite", pointerEvents: "none",
      }} />
      {/* 4. Bottom left warm accent */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)",
        bottom: 0, left: 0, animation: "orbFloat1 24s ease-in-out infinite reverse", pointerEvents: "none",
      }} />
      {/* 5. Fine grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(13,81,140,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(13,81,140,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      {/* 6. Horizontal light beam */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 200, top: "40%",
        background: "linear-gradient(180deg, transparent 0%, rgba(13,81,140,0.04) 50%, transparent 100%)",
        pointerEvents: "none",
      }} />
      {/* 7. Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(13,81,140,0.2) 30%, rgba(217,119,6,0.1) 70%, transparent 100%)",
        animation: "scanLine 12s linear infinite", pointerEvents: "none",
      }} />

      {/* Content */}
      <div className="hero-container" style={{ position: "relative", zIndex: 2 }}>
        {/* LEFT */}
        <div className="hero-left">
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(13,81,140,0.15)", border: "1px solid rgba(13,81,140,0.2)",
            borderRadius: 999, padding: "6px 18px", marginBottom: 16,
            animation: "fadeInUp 0.5s ease",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--sky)",
              animation: "pulseGlow 2s ease infinite",
              display: "inline-block",
            }} />
            <span style={{ color: "var(--sky)", fontSize: 12, fontWeight: 600, letterSpacing: "0.3px" }}>
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
                  fontSize: "clamp(40px, 5.5vw, 68px)", fontWeight: 800,
                  color: "var(--text-heading)", letterSpacing: "-1.5px", lineHeight: 1.1, margin: 0,
                  animation: `fadeInUp 0.6s ease ${0.1 + i * 0.1}s both`,
                }}
              >
                {line}
              </h1>
            ))}
            <span
              className="hero-headline"
              style={{
                display: "block",
                fontWeight: 900,
                fontSize: "clamp(38px, 5vw, 68px)",
                letterSpacing: "-1.5px",
                lineHeight: 1.08,
                minHeight: "1.15em",
                background: "linear-gradient(135deg, #0D518C 0%, #0EA5E9 45%, #D97706 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientText 4s ease infinite",
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
              fontSize: 15, color: "var(--slate)", lineHeight: 1.7, fontWeight: 400,
              marginTop: 20, marginBottom: 32, maxWidth: 420,
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
              className="clay-btn clay-btn-primary"
              onClick={() => router.push("/products")}
              style={{
                height: 50, padding: "0 28px", fontSize: 15, letterSpacing: "0.1px", color: "#FFFFFF",
              }}
            >
              Shop Products →
            </button>
            <button
              className="ghost-btn-navy"
              onClick={() => router.push("/services/enquiry")}
              style={{ height: 50, padding: "0 28px", fontSize: 15 }}
            >
              Book a Service
            </button>
          </div>

          {/* Trust pills */}
          <div
            className="hero-trust-row"
            style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.4s both" }}
          >
            {TRUST_PILLS.map((pill) => (
              <span
                className="hero-trust-pill"
                key={pill}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "#FFFFFF", border: "1px solid rgba(13,81,140,0.08)",
                  borderRadius: 999, padding: "6px 16px",
                  boxShadow: "3px 3px 8px rgba(13,81,140,0.07), -2px -2px 6px rgba(255,255,255,0.9)",
                  color: "var(--text-muted)", fontSize: 12, fontWeight: 500,
                }}
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
          style={{ perspective: "1200px", paddingRight: 20, overflow: "visible" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 400, margin: "0 auto", minHeight: 380 }}>
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
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(148,163,184,0.15)",
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

            {/* Front card — premium neumorphic showcase card, physical throw animation */}
            <div style={{ position: "relative", zIndex: 4, ...CARD_ANIM[animState] }}>
              <div
                className="hero-product-card-inner"
                style={{
                  background: "#FFFFFF",
                  borderRadius: 28,
                  overflow: "hidden",
                  boxShadow:
                    "14px 14px 36px rgba(13,81,140,0.12), -10px -10px 28px rgba(255,255,255,0.95), 0 0 0 1px rgba(13,81,140,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                  cursor: card.slug ? "pointer" : "default",
                  animation: animState === "idle" ? "floatCard 7s ease-in-out infinite" : "none",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                }}
                onClick={() => { if (card.slug) router.push(`/products/${card.slug}`); }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animationPlayState = "paused";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "18px 18px 44px rgba(13,81,140,0.16), -12px -12px 32px rgba(255,255,255,1), 0 0 0 1px rgba(13,81,140,0.06), inset 0 1px 0 rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animationPlayState = "running";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "14px 14px 36px rgba(13,81,140,0.12), -10px -10px 28px rgba(255,255,255,0.95), 0 0 0 1px rgba(13,81,140,0.05), inset 0 1px 0 rgba(255,255,255,0.9)";
                }}
              >
                {/* Image area */}
                <div className="hero-product-card-imgwrap" style={{
                  height: 240, position: "relative", overflow: "hidden",
                  background: "linear-gradient(145deg, #EEF4FF, #F0F6FF)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 20,
                }}>
                  <img
                    className="hero-product-card-img"
                    src={card.src}
                    alt={card.name}
                    style={{ maxWidth: "85%", maxHeight: "90%", objectFit: "contain", filter: "drop-shadow(0 12px 24px rgba(13,81,140,0.2))", transition: "transform 0.5s ease" }}
                  />

                  {/* Category + status badges */}
                  <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
                    {card.category && (
                      <span style={{
                        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
                        border: "1px solid rgba(13,81,140,0.12)", color: "var(--navy)",
                        fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                        letterSpacing: "0.8px", textTransform: "uppercase",
                        boxShadow: "0 2px 8px rgba(13,81,140,0.08)",
                      }}>
                        {card.category}
                      </span>
                    )}
                    <span style={{
                      background: card.badgeBg, color: "#FFFFFF",
                      fontSize: 10, fontWeight: 800, padding: "4px 12px",
                      borderRadius: 20, letterSpacing: "1.2px", textTransform: "uppercase",
                    }}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Wishlist button */}
                  {card.slug && (
                    <button
                      onClick={handleWishlist}
                      aria-label="Toggle wishlist"
                      style={{
                        position: "absolute", top: 14, right: 14,
                        width: 36, height: 36, borderRadius: "50%",
                        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
                        border: "1px solid rgba(13,81,140,0.08)",
                        boxShadow: "2px 2px 8px rgba(13,81,140,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, cursor: "pointer", transition: "all 0.2s ease",
                        color: isInWishlist(card.slug) ? "#DC2626" : "#94A3B8",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      ❤
                    </button>
                  )}
                </div>

                {/* Info panel */}
                <div style={{ padding: "20px 22px 22px", background: "#FFFFFF", borderTop: "1px solid rgba(13,81,140,0.04)" }}>
                  {card.category && (
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--navy)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 5px", lineHeight: 1 }}>
                      {card.category}
                    </p>
                  )}
                  <p style={{
                    color: "var(--text-heading)", fontSize: 19, fontWeight: 800, letterSpacing: "-0.3px",
                    margin: "0 0 10px", lineHeight: 1.2,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {card.name}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {card.price ? (
                      <span style={{ color: "var(--gold)", fontSize: 23, fontWeight: 900, letterSpacing: "-0.5px" }}>
                        ₹{card.price.toLocaleString("en-IN")}
                      </span>
                    ) : card.isUpcoming ? (
                      <span style={{ color: "#7C3AED", fontSize: 16, fontWeight: 700 }}>Coming Soon</span>
                    ) : (
                      <span style={{ color: "var(--text-subtle)", fontSize: 13, fontWeight: 700 }}>Price on Request</span>
                    )}
                    {!card.isUpcoming && card.rating && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--gold)" }}>★</span><span style={{ fontWeight: 600 }}>{card.rating}</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    {card.tags.map((s) => (
                      <span key={s} style={{
                        fontSize: 11, color: "var(--text-muted)", fontWeight: 500,
                        background: "#F5F7FF", border: "1px solid rgba(13,81,140,0.1)",
                        padding: "4px 12px", borderRadius: 999,
                        boxShadow: "2px 2px 5px rgba(13,81,140,0.06), -1px -1px 4px rgba(255,255,255,0.9)",
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                    {card.slug ? (
                      <Link
                        href={`/products/${card.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: 13, color: "var(--navy)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, transition: "gap 0.2s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--navy-dark)"; e.currentTarget.style.gap = "8px"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--navy)"; e.currentTarget.style.gap = "4px"; }}
                      >
                        {ctaLabel(card)}
                      </Link>
                    ) : (
                      <Link
                        href="/contact?interest=ev-car"
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: 13, color: "var(--navy)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, transition: "gap 0.2s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--navy-dark)"; e.currentTarget.style.gap = "8px"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--navy)"; e.currentTarget.style.gap = "4px"; }}
                      >
                        {ctaLabel(card)}
                      </Link>
                    )}

                    {card.canAddToCart && (
                      <button
                        onClick={handleQuickAdd}
                        aria-label="Quick add to cart"
                        style={{
                          width: 36, height: 36, borderRadius: 10, border: "none",
                          background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#FFFFFF",
                          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(13,81,140,0.25)", cursor: "pointer", transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(13,81,140,0.3)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(13,81,140,0.25)"; }}
                      >
                        +
                      </button>
                    )}

                    {card.productType === "vehicle" && card.slug && (
                      <Link
                        href={`/products/${card.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Book test ride"
                        style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.2)", color: "var(--navy)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          textDecoration: "none", transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(13,81,140,0.14)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(13,81,140,0.08)"; }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    )}
                  </div>
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
                  width: i === current ? 24 : 6,
                  height: 6, borderRadius: i === current ? 3 : "50%",
                  background: i === current ? "linear-gradient(90deg, #0D518C, #0EA5E9)" : "rgba(13,81,140,0.18)",
                  boxShadow: i === current ? "0 2px 6px rgba(13,81,140,0.3)" : "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
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
                  gap: 10, padding: "12px 20px",
                  background: "#FFFFFF",
                  border: "1px solid rgba(13,81,140,0.1)", borderRadius: 16,
                  textDecoration: "none", fontSize: 14,
                  color: "var(--text-body)", fontWeight: 600, textAlign: "center",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: "5px 5px 14px rgba(13,81,140,0.1), -4px -4px 10px rgba(255,255,255,0.95)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "7px 7px 18px rgba(13,81,140,0.14), -5px -5px 14px rgba(255,255,255,1)";
                  e.currentTarget.style.borderColor = "rgba(13,81,140,0.2)";
                  e.currentTarget.style.color = "var(--navy)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "5px 5px 14px rgba(13,81,140,0.1), -4px -4px 10px rgba(255,255,255,0.95)";
                  e.currentTarget.style.borderColor = "rgba(13,81,140,0.1)";
                  e.currentTarget.style.color = "var(--text-body)";
                }}
              >
                <span style={{ fontSize: 20 }}>{c.icon}</span>
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
        gap: 4, color: "rgba(148,163,184,0.5)", zIndex: 10,
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
