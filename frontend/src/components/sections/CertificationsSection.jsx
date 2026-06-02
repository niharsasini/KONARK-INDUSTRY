"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Replace with actual Google Drive PDF links
const CERTS = [
  {
    iconText: "SI", accentColor: "#FF9933",
    title: "Startup India",
    issuer: "Ministry of Commerce & Industry",
    certNumber: "DIPP182913",
    validDate: "Valid till December 2032",
    href: "https://drive.google.com",
  },
  {
    iconText: "SO", accentColor: "#00d4ff",
    title: "Startup Odisha",
    issuer: "Govt. of Odisha — MSME Dept.",
    certNumber: "OSP/SP/02193",
    validDate: "Issued April 2025",
    href: "https://drive.google.com",
  },
  {
    iconText: "MSME", accentColor: "#7c3aed",
    title: "Udyam Registration",
    issuer: "Ministry of MSMEs, Govt. of India",
    certNumber: "UDYAM-OD-19-0064755",
    validDate: "Registered January 2024",
    href: "https://drive.google.com",
  },
  {
    iconText: "IEC", accentColor: "#f97316",
    title: "Importer-Exporter Code",
    issuer: "Directorate General of Foreign Trade",
    certNumber: "IEC: ABBFK1614L",
    validDate: "Issued November 2024",
    href: "https://drive.google.com",
  },
];

function CertCard({ cert, index, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={cert.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 80 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cert-card cert-card-stair"
      style={{
        border: `1px solid ${hovered ? cert.accentColor + "60" : "#1e2d40"}`,
        transform: `translateX(${index * 20}px) ${hovered ? "scale(1.02)" : "scale(1)"}`,
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.4), 0 0 20px ${cert.accentColor}20` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: cert.accentColor, opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s" }} />

      {/* Icon */}
      <div
        className="cert-icon"
        style={{
          background: `${cert.accentColor}20`,
          border: `2px solid ${cert.accentColor}50`,
          color: cert.accentColor,
          fontSize: cert.iconText.length > 2 ? 9 : 14,
          letterSpacing: cert.iconText.length > 2 ? "0.04em" : "0",
          boxShadow: hovered ? `0 0 20px ${cert.accentColor}30` : "none",
          borderRadius: "50%",
          width: 64,
          height: 64,
          flexShrink: 0,
        }}
      >
        {cert.iconText}
      </div>

      {/* Details */}
      <div className="cert-info">
        <p className="cert-name">{cert.title}</p>
        <p className="cert-issuer" style={{ color: cert.accentColor }}>{cert.issuer}</p>
        <p className="cert-number">{cert.certNumber}</p>
        <p className="cert-valid">{cert.validDate}</p>
      </div>

      {/* View */}
      <span
        className="cert-view"
        style={{ color: cert.accentColor, border: `1px solid ${cert.accentColor}50`, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
      >
        View →
      </span>
    </motion.a>
  );
}

export default function CertificationsSection() {
  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section className="certs-section" style={{ borderTop: "1px solid #1e2d40", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.08), transparent)", transform: "translateY(-50%)", pointerEvents: "none" }} />

      <div className="certs-inner certs-layout">
        {/* LEFT */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -40 }}
          animate={leftIn ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="certs-left-sticky"
          style={{ position: "sticky", top: 120 }}
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
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>by India.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 28 }}>
            Every certificate below is issued by the Government of India or Government of Odisha and is publicly verifiable on official portals.
          </p>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#0f172a", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>✓</div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.7 }}>
              All certificates are active and verifiable on respective government portals.
            </p>
          </div>
        </motion.div>

        {/* RIGHT — cert cards */}
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
