"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/components/product/ProductData";
import ProductCard from "@/components/product/ProductCard";

const carProducts = [
  { id: "ev-car-1", name: "Konark EV Sedan", image: "/konark/car-1 (1).png", bodyType: "Sedan", isEvCar: true },
  { id: "ev-car-2", name: "Konark EV Hatchback", image: "/konark/car-2.png", bodyType: "Hatchback", isEvCar: true },
  { id: "ev-car-3", name: "Konark EV SUV", image: "/konark/car-3.png", bodyType: "SUV", isEvCar: true },
  { id: "ev-car-4", name: "Konark EV Compact", image: "/konark/car-4.png", bodyType: "Compact", isEvCar: true },
  { id: "ev-car-5", name: "Konark EV Family", image: "/konark/car-5.png", bodyType: "Family", isEvCar: true },
  { id: "ev-car-6", name: "Konark EV Sport", image: "/konark/car-6.png", bodyType: "Sport", isEvCar: true },
  { id: "ev-car-7", name: "Konark EV Premium", image: "/konark/car-7.png", bodyType: "Premium", isEvCar: true },
  { id: "ev-car-8", name: "Konark EV Pro", image: "/konark/car-8.png", bodyType: "Pro", isEvCar: true },
];

const TABS = [
  { label: "All", icon: "✦", filter: () => true, isEvCars: false, includesCars: true },
  { label: "EV Vehicles", icon: "🏍", filter: (p) => p.type === "vehicle", isEvCars: false },
  { label: "EV Cars", icon: "🚗", filter: () => false, isEvCars: true },
  { label: "Buy Now", icon: "🛒", filter: (p) => p.type === "product", isEvCars: false },
  { label: "Book Service", icon: "🔧", filter: (p) => p.type === "service", isEvCars: false },
];

const CARD_W = 280;
const CARD_GAP = 20;

function EvCarCard({ car }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push("/contact?interest=ev-car")}
      style={{
        width: "100%", flexShrink: 0,
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "#5b21b6" : "var(--border-light)"}`,
        borderRadius: 20, overflow: "hidden",
        boxShadow: hovered ? "0 16px 48px rgba(26,15,0,0.12)" : "var(--shadow-sm)",
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        height: 200, position: "relative",
        background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        overflow: "hidden",
      }}>
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          style={{
            maxHeight: 160, maxWidth: "85%", objectFit: "contain",
            filter: hovered ? "drop-shadow(0 0 20px rgba(91,33,182,0.35))" : "none",
            transition: "filter 0.3s",
          }}
        />
        <span style={{ position: "absolute", top: 12, left: 12, background: "#5b21b6", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>UPCOMING</span>
        <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(91,33,182,0.1)", border: "1px solid rgba(91,33,182,0.3)", color: "#5b21b6", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
          Electric · {car.bodyType}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #5b21b6, transparent)" }} />
      </div>
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{car.name}</p>
        <p style={{ fontSize: 13, fontStyle: "italic", color: "#5b21b6", margin: 0, fontWeight: 700 }}>Coming Soon</p>
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-light)" }}>
        <Link
          href="/contact?interest=ev-car"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 10px", fontSize: 12, fontWeight: 700,
            background: "transparent", color: "#5b21b6",
            border: "1px solid #5b21b6", borderRadius: 8,
            textDecoration: "none", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,33,182,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Register Interest →
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(0);
  const [productCount, setProductCount] = useState(products.length);
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${BACKEND}/api/v1/products?limit=100`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (Array.isArray(data) && data.length > 0) setProductCount(data.length); })
      .catch(() => {});
  }, []);

  const tab = TABS[activeTab];
  const regularProducts = tab.isEvCars ? [] : products.filter(tab.filter).slice(0, 8);
  const carsToShow = (tab.isEvCars || tab.includesCars) ? carProducts : [];
  const baseDisplayed = [...regularProducts, ...carsToShow];
  const displayed = baseDisplayed.length > 0 ? baseDisplayed : products.slice(0, 8);
  const doubled = [...displayed, ...displayed];
  const trackWidth = doubled.length * (CARD_W + CARD_GAP);

  return (
    <section className="products-section">
      {/* Decorative background text */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(120px, 20vw, 220px)",
        fontWeight: 900, color: "rgba(26,15,0,0.03)",
        pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
        zIndex: 0,
      }}>
        PRODUCTS
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="products-header"
        >
          <div className="products-header-left">
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
              borderRadius: 999, border: "1px solid rgba(15,76,129,0.2)", color: "var(--navy)",
              fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
              background: "rgba(15,76,129,0.08)", marginBottom: 14,
            }}>
              OUR CATALOGUE
            </span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, margin: "0 0 10px", lineHeight: 1.15 }}>
              <span style={{ color: "var(--text-heading)" }}>Our Product </span>
              <span style={{ background: "linear-gradient(135deg, var(--navy), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Catalogue</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 480, margin: 0, lineHeight: 1.7 }}>
              Every scooter, battery, and appliance from our Bhubaneswar factory passes 47 quality checks.
            </p>
          </div>
          <Link href="/products" style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid var(--border-default)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap", alignSelf: "flex-end" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--navy)"; e.currentTarget.style.color = "var(--navy)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            View all {productCount}+ →
          </Link>
        </motion.div>

        {/* Filter tabs */}
        <div className="filter-tabs-row" style={{ display: "flex", gap: 8, marginBottom: 36, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4, paddingLeft: 48, paddingRight: 48 }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`filter-tab-btn${activeTab === i ? " active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                padding: "9px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                background: activeTab === i ? "var(--navy)" : "transparent",
                color: activeTab === i ? "#fff" : "var(--text-subtle)",
                border: `1px solid ${activeTab === i ? "var(--navy)" : "var(--border-default)"}`,
                boxShadow: activeTab === i ? "0 4px 16px rgba(15,76,129,0.3)" : "none",
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="products-carousel-wrap products-carousel">
        <div
          key={activeTab}
          className="products-track"
          style={{
            animation: "scrollProducts 35s linear infinite",
            width: `${trackWidth + 24}px`,
          }}
        >
          {doubled.map((p, i) => (
            <div key={`${p.id}-${i}`} className="product-card-wrap">
              {p.isEvCar ? <EvCarCard car={p} /> : <ProductCard product={p} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 10, border: "1px solid var(--border-default)", background: "transparent", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", margin: "0 24px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--navy)"; e.currentTarget.style.color = "var(--navy)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          View All {productCount}+ Products →
        </Link>
      </div>
    </section>
  );
}
