"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// TODO: Replace with actual Google Drive links for each certificate PDF
const CERTS = [
  {
    iconText: "SI", accentColor: "#FF9933",
    title: "Startup India",
    issuer: "Ministry of Commerce & Industry",
    certNumber: "DIPP182913",
    validDate: "Valid till December 2032",
    href: "https://drive.google.com/drive/folders/your-folder-id",
  },
  {
    iconText: "SO", accentColor: "#00d4ff",
    title: "Startup Odisha",
    issuer: "Govt. of Odisha — MSME Dept.",
    certNumber: "OSP/SP/02193",
    validDate: "Issued April 2025",
    href: "https://drive.google.com/drive/folders/your-folder-id",
  },
  {
    iconText: "MSME", accentColor: "#7c3aed",
    title: "Udyam Registration",
    issuer: "Ministry of MSMEs, Govt. of India",
    certNumber: "UDYAM-OD-19-0064755",
    validDate: "Registered January 2024",
    href: "https://drive.google.com/drive/folders/your-folder-id",
  },
  {
    iconText: "IEC", accentColor: "#f97316",
    title: "Importer-Exporter Code",
    issuer: "Directorate General of Foreign Trade",
    certNumber: "IEC: ABBFK1614L",
    validDate: "Issued November 2024",
    href: "https://drive.google.com/drive/folders/your-folder-id",
  },
];

function CertCard({ cert, index, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0f172a",
        border: `1px solid ${hovered ? cert.accentColor + "60" : "#1e2d40"}`,
        borderRadius: 16, padding: 24,
        display: "flex", alignItems: "center", gap: 20,
        transform: `translateX(${index * 20}px) ${hovered ? "scale(1.02)" : "scale(1)"}`,
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.4), 0 0 20px ${cert.accentColor}20` : "none",
        transition: "all 0.3s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        marginBottom: index < CERTS.length - 1 ? 16 : 0,
      }}
      className="cert-card-stair"
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: cert.accentColor, opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s",
      }} />

      {/* Icon circle */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
        background: `${cert.accentColor}20`,
        border: `2px solid ${cert.accentColor}50`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: cert.iconText.length > 2 ? 9 : 14,
        fontWeight: 900, color: cert.accentColor,
        letterSpacing: cert.iconText.length > 2 ? "0.04em" : "0",
        boxShadow: hovered ? `0 0 20px ${cert.accentColor}30` : "none",
        transition: "box-shadow 0.3s",
      }}>
        {cert.iconText}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>{cert.title}</p>
        <p style={{ fontSize: 13, color: cert.accentColor, margin: "0 0 8px", fontWeight: 600 }}>{cert.issuer}</p>
        <p style={{ fontSize: 12, fontFamily: "monospace", color: "#94a3b8", margin: "0 0 2px", letterSpacing: "0.04em" }}>{cert.certNumber}</p>
        <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{cert.validDate}</p>
      </div>

      {/* View button */}
      <a
        href={cert.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{
          flexShrink: 0, padding: "7px 14px", borderRadius: 8,
          border: `1px solid ${cert.accentColor}50`,
          color: cert.accentColor, fontSize: 12, fontWeight: 700,
          textDecoration: "none", background: "transparent",
          transition: "all 0.2s", whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${cert.accentColor}18`; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        View →
      </a>
    </motion.div>
  );
}

export default function CertificationsSection() {
  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{
      background: "#0a0f1e", padding: "100px 24px",
      borderTop: "1px solid #1e2d40", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative horizontal glow line */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.08), transparent)",
        transform: "translateY(-50%)", pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "35% 65%", gap: 64, alignItems: "start",
      }} className="certs-layout">
        {/* LEFT */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -40 }}
          animate={leftIn ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ position: "sticky", top: 120 }}
          className="certs-left-sticky"
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff",
            fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 20,
          }}>
            GOVT. RECOGNISED
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.2 }}>
            <span style={{ color: "#f1f5f9" }}>Certified</span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>by India.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 28 }}>
            Every certificate below is issued by the Government of India or Government of Odisha and is publicly verifiable on official portals.
          </p>

          {/* Verification note */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            background: "#0f172a", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 12, padding: "16px 18px",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 14,
            }}>✓</div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.7 }}>
              All certificates are active and verifiable on respective government portals.
            </p>
          </div>
        </motion.div>

        {/* RIGHT — staircase cards */}
        <div ref={rightRef}>
          {CERTS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} inView={rightIn} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .certs-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .certs-left-sticky { position: static !important; }
          .cert-card-stair { transform: translateX(0) !important; }
        }
      `}</style>
    </section>
  );
}
