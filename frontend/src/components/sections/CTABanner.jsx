"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const FLOATING_CHIPS = [
  { text: "⚡ EV Scooter · ₹27,000", pos: { top: "15%", left: "8%" }, delay: 0 },
  { text: "🔋 Battery Swap · Book Now", pos: { top: "12%", right: "8%" }, delay: 0.8 },
  { text: "⭐ 4.8/5 · 25,000+ customers", pos: { bottom: "18%", left: "50%", transform: "translateX(-50%)" }, delay: 1.4 },
];

export default function CTABanner() {
  return (
    <section className="cta-section" style={{ minHeight: 500, display: "flex", alignItems: "center", borderTop: "1px solid #1c3050" }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(30,45,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,64,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      {/* Floating chips — hidden on mobile via CSS */}
      {FLOATING_CHIPS.map((chip, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3 + i * 0.5, ease: "easeInOut", repeat: Infinity, delay: chip.delay }}
          className="cta-floating-chip"
          style={{ position: "absolute", ...chip.pos, background: "rgba(15,23,42,0.9)", border: "1px solid #1c3050", borderRadius: 100, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap", opacity: 0.7, pointerEvents: "none", zIndex: 1 }}
        >
          {chip.text}
        </motion.div>
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{ marginBottom: 28 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.35)", borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#38bdf8", animation: "glow-pulse 3s ease-in-out infinite" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "pulse-glow 2s infinite", display: "inline-block" }} />
            ⚡ Powering Odisha since 2014
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 24 }}
        >
          <h2 className="cta-h2">
            <span style={{ display: "block", fontSize: "clamp(40px, 6vw, 68px)", color: "#f1f5f9" }}>One call.</span>
            <span style={{ display: "block", fontSize: "clamp(40px, 6vw, 68px)", background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Every power</span>
            <span style={{ display: "block", fontSize: "clamp(40px, 6vw, 68px)", color: "#f1f5f9" }}>need.</span>
          </h2>
        </motion.div>

        <motion.p
          className="cta-sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          viewport={{ once: true }}
        >
          Whether you need a new EV scooter, a battery for your solar system, or just want someone to fix your AC — we&apos;re the one number to call in Odisha.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="cta-buttons cta-btns"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          viewport={{ once: true }}
        >
          <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: "#38bdf8", color: "#080f1e", fontWeight: 800, fontSize: 15, borderRadius: 12, textDecoration: "none", transition: "all 0.2s", boxShadow: "0 0 24px rgba(56,189,248,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0ea5e9"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#38bdf8"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            🛒 Shop Products
          </Link>
          <Link href="/services/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: "#818cf8", color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 12, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#6d28d9"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#818cf8"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            🔧 Book a Service
          </Link>
          <Link href="/battery-swap" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: "transparent", color: "#38bdf8", fontWeight: 700, fontSize: 15, borderRadius: 12, textDecoration: "none", border: "1px solid rgba(56,189,248,0.4)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,0.1)"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            🔋 Battery Swap
          </Link>
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 6px" }}>Or call us directly:</p>
          <a href="tel:+919437611129" className="cta-phone"
            onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
            onMouseLeave={e => (e.currentTarget.style.color = "#f1f5f9")}
          >
            +91 94376 11129
          </a>
          <p className="cta-hours">Mon–Sat · 8AM–8PM IST</p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cta-floating-chip { display: none !important; }
          .cta-btns { flex-direction: column !important; align-items: stretch !important; }
          .cta-btns a { text-align: center !important; justify-content: center !important; }
        }
      `}</style>
    </section>
  );
}
