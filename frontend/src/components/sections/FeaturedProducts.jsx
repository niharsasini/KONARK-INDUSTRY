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
        border: `1px solid ${hovered ? "rgba(79,195,247,0.35)" : "var(--border-default)"}`,
        borderRadius: 20, overflow: "hidden",
        boxShadow: hovered ? "0 16px 48px rgba(10,14,26,0.5)" : "var(--shadow-sm)",
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
            filter: hovered ? "drop-shadow(0 0 20px rgba(79,195,247,0.35))" : "none",
            transition: "filter 0.3s",
          }}
        />
        <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(92,103,149,0.8)", color: "#E8F4FF", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>UPCOMING</span>
        <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(79,195,247,0.1)", border: "1px solid rgba(79,195,247,0.3)", color: "#4FC3F7", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
          Electric · {car.bodyType}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #4FC3F7, transparent)" }} />
      </div>
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{car.name}</p>
        <p style={{ fontSize: 13, fontStyle: "italic", color: "#5C6795", margin: 0, fontWeight: 700 }}>Coming Soon</p>
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-light)" }}>
        <Link
          href="/contact?interest=ev-car"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 10px", fontSize: 12, fontWeight: 700,
            background: "transparent", color: "#4FC3F7",
            border: "1px solid #4FC3F7", borderRadius: 8,
            textDecoration: "none", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(79,195,247,0.08)")}
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
        fontWeight: 900, color: "rgba(92,103,149,0.04)",
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
            <span className="section-tag" style={{ marginBottom: 14 }}>
              OUR CATALOGUE
            </span>
            <h2 className="section-title" style={{ margin: "0 0 10px" }}>
              Our Product <span className="gradient-text">Catalogue</span>
            </h2>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Every scooter, battery, and appliance from our Bhubaneswar factory passes 47 quality checks.
            </p>
          </div>
          <Link href="/products" style={{ padding: "10px 22px", borderRadius: 999, border: "1px solid rgba(92,103,149,0.25)", color: "#7B8DB8", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap", alignSelf: "flex-end", background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,195,247,0.4)"; e.currentTarget.style.color = "#4FC3F7"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(92,103,149,0.25)"; e.currentTarget.style.color = "#7B8DB8"; }}
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
                padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: activeTab === i ? 700 : 500,
                cursor: "pointer", transition: "all 0.25s",
                background: activeTab === i ? "linear-gradient(135deg, #0D518C, #4FC3F7)" : "rgba(22,41,82,0.4)",
                color: activeTab === i ? "#E8F4FF" : "#7B8DB8",
                border: activeTab === i ? "none" : "1px solid rgba(92,103,149,0.2)",
                boxShadow: activeTab === i ? "0 4px 14px rgba(13,81,140,0.3)" : "none",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== i) {
                  e.currentTarget.style.background = "rgba(22,41,82,0.7)";
                  e.currentTarget.style.borderColor = "rgba(79,195,247,0.3)";
                  e.currentTarget.style.color = "#E8F4FF";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== i) {
                  e.currentTarget.style.background = "rgba(22,41,82,0.4)";
                  e.currentTarget.style.borderColor = "rgba(92,103,149,0.2)";
                  e.currentTarget.style.color = "#7B8DB8";
                }
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
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 999, border: "1px solid rgba(92,103,149,0.25)", background: "transparent", color: "#7B8DB8", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", margin: "0 24px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,195,247,0.4)"; e.currentTarget.style.color = "#4FC3F7"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(92,103,149,0.25)"; e.currentTarget.style.color = "#7B8DB8"; }}
        >
          View All {productCount}+ Products →
        </Link>
      </div>
    </section>
  );
}
