"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/components/product/ProductData";

const TABS = ["All", "EV Vehicles", "Buy Now", "Book Service"];

const FILTER_FN = {
  All: () => true,
  "EV Vehicles": (p) => p.type === "vehicle",
  "Buy Now": (p) => p.type === "product",
  "Book Service": (p) => p.type === "service",
};

const BADGE_COLORS = {
  "Electric Vehicles": "#00d4ff",
  Batteries: "#7c3aed",
  "Home Appliances": "#10b981",
  "Industrial Equipment": "#f97316",
  "Industrial Components": "#f97316",
  Electronics: "#94a3b8",
  "Industrial Services": "#a78bfa",
};

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20"
          fill={s <= Math.round(rating) ? "#f97316" : "none"}
          stroke="#f97316" strokeWidth={1.5}
          style={{ width: 12, height: 12 }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>({rating})</span>
    </div>
  );
}

function VehicleCard({ product, index, inView }) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRotX(((e.clientY - r.top) / r.height - 0.5) * -12);
    setRotY(((e.clientX - r.left) / r.width - 0.5) * 12);
  };
  const onLeave = () => { setRotX(0); setRotY(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        animate={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          transformStyle: "preserve-3d",
          background: "linear-gradient(145deg, #0d1b2e, #0f172a)",
          border: `1px solid ${hovered ? "rgba(0,212,255,0.35)" : "#1e2d40"}`,
          borderRadius: 18,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          boxShadow: hovered ? "0 16px 48px rgba(0,212,255,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {/* Image area */}
        <div style={{ position: "relative", background: "#060d1a", height: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <img src={product.image} alt={product.name} loading="lazy"
            style={{ maxHeight: 160, maxWidth: "85%", objectFit: "contain", filter: hovered ? "drop-shadow(0 0 20px rgba(0,212,255,0.3))" : "none", transition: "filter 0.3s" }} />
          {/* EV badge */}
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.4)",
            color: "#00d4ff", fontSize: 10, fontWeight: 800, padding: "3px 8px",
            borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.1em",
          }}>⚡ EV</span>
          {product.isNew && (
            <span style={{
              position: "absolute", top: 12, right: 12,
              background: "#00d4ff", color: "#0a0f1e",
              fontSize: 10, fontWeight: 800, padding: "3px 8px",
              borderRadius: 4, textTransform: "uppercase",
            }}>NEW</span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{product.name}</p>
          <p style={{ fontSize: 11, color: "#00d4ff", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>🏍 EV Vehicle</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            {product.price > 0
              ? <><span style={{ fontSize: 11, color: "#64748b" }}>Starting </span><span style={{ fontSize: 17, fontWeight: 800, color: "#00d4ff" }}>₹{product.price.toLocaleString("en-IN")}</span></>
              : <span style={{ fontSize: 13, color: "#64748b", fontStyle: "italic" }}>Price on Request</span>
            }
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d40", display: "flex", gap: 8 }}>
          <Link
            href={`/products/${product.slug}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 12px", fontSize: 12, fontWeight: 700,
              background: "#00d4ff", color: "#0a0f1e",
              borderRadius: 8, textDecoration: "none", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
          >
            Book Test Ride →
          </Link>
          <Link
            href={`/products/${product.slug}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 12px", fontSize: 12, fontWeight: 600,
              background: "transparent", color: "#f1f5f9",
              border: "1px solid #1e2d40", borderRadius: 8, textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
          >
            Get Best Price
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductBuyCard({ product, index, inView }) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [hovered, setHovered] = useState(false);
  const badgeColor = BADGE_COLORS[product.category] || "#94a3b8";

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRotX(((e.clientY - r.top) / r.height - 0.5) * -14);
    setRotY(((e.clientX - r.left) / r.width - 0.5) * 14);
  };
  const onLeave = () => { setRotX(0); setRotY(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        animate={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          transformStyle: "preserve-3d",
          background: "#0f172a",
          border: `1px solid ${hovered ? "rgba(16,185,129,0.3)" : "#1e2d40"}`,
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.4)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", background: "#060d1a", height: 200, padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={product.image} alt={product.name} loading="lazy"
            style={{ maxHeight: 160, maxWidth: "85%", objectFit: "contain" }} />
          {product.isNew && (
            <span style={{
              position: "absolute", top: 12, left: 12,
              background: "#00d4ff", color: "#0a0f1e",
              fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4,
            }}>NEW</span>
          )}
          {/* In Stock badge */}
          <span style={{
            position: "absolute", bottom: 12, right: 12,
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
            color: "#10b981", fontSize: 10, fontWeight: 700, padding: "2px 8px",
            borderRadius: 4,
          }}>● In Stock</span>
          <span style={{
            position: "absolute", top: 12, right: 12,
            fontSize: 10, fontWeight: 700, padding: "3px 10px",
            borderRadius: 100, background: `${badgeColor}18`,
            color: badgeColor, border: `1px solid ${badgeColor}30`,
            textTransform: "uppercase",
          }}>
            {product.category.replace("Electric Vehicles", "EV").replace("Home Appliances", "Home").replace("Industrial Equipment", "Industrial")}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{product.name}</p>
          <StarRating rating={product.rating} />
          <div>
            <p style={{ fontSize: 20, fontWeight: 800, margin: 0, color: product.price > 0 ? "#00d4ff" : "#64748b" }}>
              {product.price > 0
                ? `₹${product.price.toLocaleString("en-IN")}`
                : <span style={{ fontSize: 14, fontWeight: 500 }}>Price on Request</span>
              }
            </p>
            {product.price > 0 && (
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                or ₹{Math.round(product.price / 12).toLocaleString("en-IN")}/mo on EMI
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d40", display: "flex", gap: 8 }}>
          <Link
            href={`/products/${product.slug}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 12px", fontSize: 12, fontWeight: 700,
              background: "#00d4ff", color: "#0a0f1e",
              borderRadius: 8, textDecoration: "none", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
          >
            Add to Cart 🛒
          </Link>
          <Link
            href={`/products/${product.slug}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 12px", fontSize: 12, fontWeight: 600,
              background: "rgba(255,255,255,0.05)", color: "#f1f5f9",
              border: "1px solid #1e2d40", borderRadius: 8, textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "#94a3b8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "#1e2d40"; }}
          >
            Buy Now
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ServiceCard({ product, index, inView }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#0f172a",
          border: `1px solid ${hovered ? "rgba(124,58,237,0.35)" : "#1e2d40"}`,
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          boxShadow: hovered ? "0 12px 40px rgba(124,58,237,0.12)" : "none",
          transform: hovered ? "translateY(-3px)" : "none",
          transition: "all 0.25s",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", background: "#060d1a", height: 200, padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={product.image} alt={product.name} loading="lazy"
            style={{ maxHeight: 160, maxWidth: "85%", objectFit: "contain", opacity: 0.85 }} />
          {/* Free Quote badge */}
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)",
            color: "#a78bfa", fontSize: 10, fontWeight: 800, padding: "3px 8px",
            borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>Free Quote</span>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{product.name}</p>
          <p style={{ fontSize: 12, color: "#a78bfa", margin: 0 }}>⏱ Response within 2 hrs</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{product.shortDescription}</p>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d40", display: "flex", gap: 8 }}>
          <button
            onClick={() => router.push("/services/enquiry")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 12px", fontSize: 12, fontWeight: 700,
              background: "#7c3aed", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
          >
            Book Service →
          </button>
          <Link
            href={`/products/${product.slug}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 12px", fontSize: 12, fontWeight: 600,
              background: "transparent", color: "#94a3b8",
              border: "1px solid #1e2d40", borderRadius: 8, textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.color = "#a78bfa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            Know More
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index, inView }) {
  if (product.type === "vehicle") return <VehicleCard product={product} index={index} inView={inView} />;
  if (product.type === "service") return <ServiceCard product={product} index={index} inView={inView} />;
  return <ProductBuyCard product={product} index={index} inView={inView} />;
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("All");
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  const filterFn = FILTER_FN[activeTab] || (() => true);
  const filtered = products.filter(filterFn).slice(0, 6);
  const displayed = filtered.length > 0 ? filtered : products.slice(0, 6);

  const TAB_ICONS = { All: "✦", "EV Vehicles": "🏍", "Buy Now": "🛒", "Book Service": "🔧" };

  return (
    <section style={{ background: "#0a0f1e", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)",
            color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16,
          }}>
            OUR CATALOGUE
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
            <span style={{ color: "#f1f5f9" }}>Built in Odisha. </span>
            <span style={{
              background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Trusted Across India.
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Every scooter, battery, and appliance from our Bhubaneswar factory passes 47 quality checks. No exceptions.
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 999, border: "1px solid",
                borderColor: activeTab === tab ? "#00d4ff" : "#1e2d40",
                background: activeTab === tab ? "#00d4ff" : "transparent",
                color: activeTab === tab ? "#0a0f1e" : "#64748b",
                fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.color = "#00d4ff"; }}
              onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.color = "#64748b"; }}
            >
              <span>{TAB_ICONS[tab]}</span> {tab}
            </button>
          ))}
        </div>

        {/* EV Vehicles banner */}
        {activeTab === "EV Vehicles" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 32, padding: "16px 24px",
              background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.06))",
              border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>
                🏍 Book a test ride at our Bhubaneswar showroom
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                Bhimatangi Housing Colony, Bhubaneswar — Call <a href="tel:+919437611129" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>+91 94376 11129</a> to schedule
              </p>
            </div>
            <Link
              href="/test-ride"
              style={{
                padding: "9px 20px", background: "#00d4ff", color: "#0a0f1e",
                fontWeight: 700, fontSize: 13, borderRadius: 8, textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Book Test Ride →
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {displayed.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} inView={gridIn} />
          ))}
        </div>

        {/* View all */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 32px", borderRadius: 10,
              border: "1px solid #1e2d40", background: "transparent",
              color: "#94a3b8", fontSize: 14, fontWeight: 600,
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            View All 50+ Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
