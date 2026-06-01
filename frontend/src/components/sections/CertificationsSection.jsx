"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CERTS = [
  {
    badge: "DIPP RECOGNISED",
    iconText: "SI",
    accentColor: "#FF9933",
    title: "Startup India",
    issuer: "Ministry of Commerce & Industry",
    subtitle: "Dept. for Promotion of Industry & Internal Trade",
    certNumber: "Cert No: DIPP182913",
    validDate: "Valid till December 2032",
    govtTag: "Government of India ✓",
  },
  {
    badge: "STATE RECOGNISED",
    iconText: "SO",
    accentColor: "#00d4ff",
    title: "Startup Odisha",
    issuer: "Govt. of Odisha — MSME Dept.",
    subtitle: "Odisha Startup Policy 2016",
    certNumber: "Reg No: OSP/SP/02193",
    validDate: "Issued April 2025",
    govtTag: "Government of Odisha ✓",
  },
  {
    badge: "MSME REGISTERED",
    iconText: "MSME",
    accentColor: "#7c3aed",
    title: "Udyam Registration",
    issuer: "Ministry of Micro, Small & Medium Enterprises",
    subtitle: "Manufacturing — Motor Vehicles Category",
    certNumber: "UDYAM-OD-19-0064755",
    validDate: "Registered January 2024",
    govtTag: "Government of India ✓",
  },
  {
    badge: "EXPORT CERTIFIED",
    iconText: "IEC",
    accentColor: "#f97316",
    title: "Importer-Exporter Code",
    issuer: "Directorate General of Foreign Trade",
    subtitle: "Ministry of Commerce & Industry",
    certNumber: "IEC: ABBFK1614L",
    validDate: "Issued November 2024",
    govtTag: "DGFT Approved ✓",
  },
];

function CertCard({ cert, index, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#0f172a",
        border: `1px solid ${hovered ? `${cert.accentColor}66` : "#1e2d40"}`,
        borderRadius: 16,
        padding: 24,
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
        transition: "all 300ms",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Top color bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3,
        background: cert.accentColor,
        borderRadius: "16px 16px 0 0",
      }} />

      {/* Badge */}
      <span style={{
        display: "inline-block",
        fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: cert.accentColor,
        background: `${cert.accentColor}18`,
        border: `1px solid ${cert.accentColor}40`,
        padding: "3px 10px", borderRadius: 4,
        alignSelf: "flex-start",
        marginTop: 6,
      }}>
        {cert.badge}
      </span>

      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: `${cert.accentColor}18`,
        border: `2px solid ${cert.accentColor}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: cert.iconText.length > 2 ? 9 : 14,
        fontWeight: 900, color: cert.accentColor,
        letterSpacing: cert.iconText.length > 2 ? "0.04em" : "0",
        flexShrink: 0,
      }}>
        {cert.iconText}
      </div>

      {/* Title + issuer */}
      <div>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.2 }}>
          {cert.title}
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#00d4ff", margin: 0, lineHeight: 1.5 }}>
          {cert.issuer}
        </p>
        <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0", lineHeight: 1.5 }}>
          {cert.subtitle}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1e2d40" }} />

      {/* Number + date */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", margin: 0, letterSpacing: "0.04em" }}>
          {cert.certNumber}
        </p>
        <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>
          {cert.validDate}
        </p>
      </div>

      {/* Govt tag */}
      <div style={{ marginTop: "auto" }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: "#10b981",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <svg viewBox="0 0 16 16" fill="#10b981" style={{ width: 12, height: 12, flexShrink: 0 }}>
            <path d="M8 0l2.06 2.39L13 1l.39 3.06L16 5.94l-2.39 2.06L14.5 11l-2.94-.83L9 12.94 8 10.12 7 12.94l-2.56-1.77L1.5 11l.89-2.94L0 5.94 2.61 3.88.86 1l2.94.83L8 0zm0 3.5L6.5 6H4l2 1.5L5.5 10l2.5-1.5 2.5 1.5L10 7.5l2-1.5h-2.5L8 3.5z"/>
          </svg>
          {cert.govtTag}
        </span>
      </div>
    </motion.div>
  );
}

export default function CertificationsSection() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{
      background: "#060d1a",
      padding: "80px 0",
      borderTop: "1px solid #1e2d40",
    }}>
      {/* Header */}
      <motion.div
        ref={headRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headIn ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: 48, padding: "0 24px" }}
      >
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
          borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)",
          color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16,
        }}>
          GOVT. RECOGNISED
        </span>
        <h2 style={{
          fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 900, color: "#f1f5f9",
          margin: "0 0 12px", lineHeight: 1.2,
        }}>
          Certified. Recognised. Trusted.
        </h2>
        <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Konark Industry is officially recognised by the Government of India and Government of Odisha
          as a verified manufacturer and exporter.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
        }}
        className="certs-grid"
      >
        {CERTS.map((cert, i) => (
          <CertCard key={cert.title} cert={cert} index={i} inView={gridIn} />
        ))}
      </div>

      {/* Verification strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={gridIn ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          maxWidth: 1100,
          margin: "32px auto 0",
          padding: "0 24px",
        }}
      >
        <div style={{
          background: "#0a0f1e",
          border: "1px solid #1e2d40",
          borderRadius: 10,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          <svg viewBox="0 0 20 20" fill="none" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path d="M10 2l2.39 2.75 3.49-.93.45 3.55 3.11 1.63-2.39 2.75.93 3.49-3.55.45L12 17.72l-2-2.28-2 2.28-1.83-2.03-3.55-.45.93-3.49L1.16 9l3.11-1.63.45-3.55L8.21 4.75 10 2z"
              stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M6.5 10l2.5 2.5 4-4.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0, textAlign: "center" }}>
            All registrations are active and verifiable on respective government portals.
          </p>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 1024px) {
          .certs-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .certs-grid {
            grid-template-columns: 1fr !important;
            padding: 0 16px !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
