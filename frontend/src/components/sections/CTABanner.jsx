"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const FEATURE_PILLS = ["⚡ EV Vehicles", "🔧 Doorstep Service", "🔋 Clean Energy"];

const FLOATING_CHIPS = [
  { text: "⚡ EV Scooter · ₹27,000", style: { top: "15%", left: "2%" }, animation: "floatChip1 6s ease-in-out infinite" },
  { text: "🔋 Battery Swap · ₹150", style: { bottom: "18%", left: "6%" }, animation: "floatChip2 8s ease-in-out infinite" },
];

export default function CTABanner() {
  const settings = useSiteSettings();
  const phone = settings?.company_phone || "+91 94376 11129";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const rating = settings?.stats_rating || "4.8";
  const customers = settings?.stats_customers || "25,000+";

  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section className="cta-section">
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,81,140,0.2) 0%, transparent 65%)",
          top: -200,
          left: -150,
          animation: "orbFloat1 20s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 65%)",
          bottom: -150,
          right: -100,
          animation: "orbFloat2 25s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          height: 1,
          left: 0,
          right: 0,
          top: "50%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(13,81,140,0.3) 30%, rgba(14,165,233,0.2) 50%, rgba(13,81,140,0.3) 70%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {FLOATING_CHIPS.map((chip, i) => (
        <div
          key={i}
          className="cta-floating-chip"
          style={{
            position: "absolute",
            ...chip.style,
            background: "rgba(19,32,64,0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(79,195,247,0.15)",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 13,
            color: "rgba(232,244,255,0.8)",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "4px 4px 12px #0A1628, -3px -3px 8px #1C3058",
            animation: chip.animation,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {chip.text}
        </div>
      ))}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1, width: "100%" }}>
        <div className="cta-split-grid">
          {/* LEFT — headline */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -40 }}
            animate={leftIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(79,195,247,0.7)",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4FC3F7", animation: "pulseDot 2s ease infinite" }} />
              One Call. Every Power Need.
            </div>

            <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.0, margin: 0 }}>
              <span style={{ color: "#E8F4FF" }}>One call.</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4FC3F7, #0EA5E9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Every power
              </span>
              <br />
              <span style={{ color: "#E8F4FF" }}>need.</span>
            </h2>

            <p style={{ marginTop: 20, fontSize: 16, color: "rgba(232,244,255,0.55)", lineHeight: 1.7, maxWidth: 400 }}>
              Whether you need a new EV scooter, a battery for your solar system, or just want someone to fix your AC — we&apos;re the one number to call in Odisha.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              {FEATURE_PILLS.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={leftIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  style={{
                    background: "#132040",
                    borderRadius: 999,
                    boxShadow: "4px 4px 10px #0A1628, -3px -3px 8px #1C3058",
                    border: "1px solid rgba(255,255,255,0.05)",
                    padding: "8px 16px",
                    fontSize: 13,
                    color: "rgba(232,244,255,0.7)",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {pill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — action card */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 40 }}
            animate={rightIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              background: "#132040",
              borderRadius: 28,
              boxShadow: "12px 12px 32px #0A1628, -10px -10px 28px #1C3058, inset 0 1px 0 rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.04)",
              padding: "36px 32px",
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(232,244,255,0.4)", letterSpacing: "0.5px", margin: "0 0 6px" }}>
              Or call us directly:
            </p>
            <a
              href={phoneHref}
              style={{ fontSize: 36, fontWeight: 900, color: "#E8F4FF", letterSpacing: "-1px", lineHeight: 1, textDecoration: "none", transition: "color 0.2s ease", display: "block" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4FC3F7")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#E8F4FF")}
            >
              {phone}
            </a>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(13,81,140,0.2)",
                border: "1px solid rgba(79,195,247,0.15)",
                borderRadius: 999,
                padding: "4px 12px",
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "rgba(232,244,255,0.65)", fontWeight: 500 }}>
                ⭐ {rating}/5 · {customers} customers
              </span>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                href="/products"
                className="cta-btn-shimmer"
                style={{
                  height: 52,
                  background: "linear-gradient(135deg, #0D518C, #0EA5E9)",
                  color: "white",
                  border: "none",
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(13,81,140,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,81,140,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(13,81,140,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
              >
                Shop Products →
              </Link>

              <Link
                href="/services/enquiry"
                style={{
                  height: 52,
                  background: "#132040",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(232,244,255,0.8)",
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: "5px 5px 14px #0A1628, -4px -4px 12px #1C3058",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1A2A4A";
                  e.currentTarget.style.color = "#E8F4FF";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#132040";
                  e.currentTarget.style.color = "rgba(232,244,255,0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Book a Service →
              </Link>

              <Link
                href="/battery-swap"
                style={{
                  height: 52,
                  background: "transparent",
                  border: "1px solid rgba(52,199,138,0.3)",
                  color: "#34C78A",
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 600,
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(52,199,138,0.08)";
                  e.currentTarget.style.borderColor = "rgba(52,199,138,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(52,199,138,0.3)";
                }}
              >
                Battery Swap ₹150 →
              </Link>
            </div>

            <p style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "rgba(232,244,255,0.3)" }}>
              Mon–Sat · 8AM–8PM IST
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
