"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const TRUST_PILLS = ["✓ ISI Certified", "✓ 2-Year Warranty", "✓ Free Delivery ₹5000+"];

const CATEGORY_CHIPS = [
  { icon: "⚡", label: "EV & Mobility", href: "/products" },
  { icon: "🔋", label: "Energy Storage", href: "/products" },
  { icon: "☀️", label: "Solar Solutions", href: "/products" },
];

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
      }}
    >
      {/* CSS orbs */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        className="animate-float"
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "2s",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Layer 3 — grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Layer 4 — content */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: 40,
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
        className="hero-grid"
      >
        {/* LEFT */}
        <div>
          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 16px",
                borderRadius: 999,
                border: "1px solid rgba(0,212,255,0.4)",
                color: "#00d4ff",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 28,
                background: "rgba(0,212,255,0.06)",
                boxShadow: "0 0 16px rgba(0,212,255,0.2)",
              }}
            >
              ⚡ Powering Odisha since 2014
            </div>
          </motion.div>

          {/* H1 */}
          <div style={{ marginBottom: 24 }}>
            {["Power Your", "World With", "Konark"].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              >
                <h1
                  style={{
                    fontSize: "clamp(38px, 5.5vw, 72px)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    margin: 0,
                    ...(line === "Konark"
                      ? {
                          background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : { color: "#f1f5f9" }),
                  }}
                >
                  {line}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p {...fadeUp(0.55)}
            style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, marginBottom: 36 }}
          >
            India's most trusted homegrown energy brand. EVs, batteries, smart
            appliances — all engineered at our Bhubaneswar factory.
          </motion.p>

          {/* Buttons */}
          <motion.div {...fadeUp(0.7)}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 30px",
                  background: "#00d4ff",
                  color: "#0a0f1e",
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                Explore Products
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 30px",
                  background: "transparent",
                  color: "#00d4ff",
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid rgba(0,212,255,0.5)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Our Story
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust pills */}
          <motion.div {...fadeUp(0.9)}
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {TRUST_PILLS.map((pill) => (
              <span
                key={pill}
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  border: "1px dashed #1e2d40",
                  padding: "4px 12px",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                {pill}
              </span>
            ))}
          </motion.div>

          {/* Floating stat cards */}
          <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
            {[
              { num: "25,000+", label: "Customers across India" },
              { num: "50+", label: "Products & solutions" },
            ].map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.15 }}
                style={{
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p style={{ fontSize: 20, fontWeight: 800, color: "#00d4ff", margin: "0 0 2px" }}>{s.num}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — product showcase */}
        <div className="hero-right" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ rotateY: 8, rotateX: -4, scale: 1.02 }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
              background: "rgba(15,23,42,0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 0 40px rgba(0,212,255,0.1)",
              borderRadius: 20,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 240,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(17,24,39,0.6)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <img
                src="/productimg/Electric Scooter.png"
                alt="Konark Electric Scooter"
                style={{
                  maxHeight: 200,
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 24px rgba(0,212,255,0.25))",
                }}
              />
            </div>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>Konark X1 Electric Scooter</p>
                <p style={{ fontSize: 13, color: "#00d4ff", fontWeight: 700, margin: 0 }}>₹27,000</p>
              </div>
              <Link href="/products/electric-scooter"
                style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                View →
              </Link>
            </div>
          </motion.div>

          {/* Category chips */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ display: "flex", gap: 8 }}
          >
            {CATEGORY_CHIPS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 8px",
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid #1e2d40",
                  borderRadius: 10,
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                  textAlign: "center",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                {c.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: "#94a3b8",
          zIndex: 10,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18, color: "#00d4ff" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </section>
  );
}
