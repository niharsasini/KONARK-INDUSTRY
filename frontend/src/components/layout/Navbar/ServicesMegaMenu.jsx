import Link from "next/link";
import { motion } from "framer-motion";
import { DROPDOWN_VARIANTS } from "./constants";
import { ColHeader, SvcItem } from "./MegaMenuItems";

export default function ServicesMegaMenu({ onPanelEnter, onPanelLeave }) {
  return (
    <motion.div
      className="mega-menu-panel"
      variants={DROPDOWN_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.15 }}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        background: "rgba(13, 20, 36, 0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)",
        padding: 24,
        zIndex: 200,
        minWidth: 560,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
      }}
    >
      {/* Column 1 — Home & EV Services */}
      <div style={{ paddingRight: 20, borderRight: "1px solid #1e2d40" }}>
        <ColHeader emoji="🏠" title="Home & EV Services" color="#00d4ff" />
        <SvcItem icon="❄️" iconBg="rgba(0,212,255,0.12)" label="AC Repair & Service" desc="All brands, same day" href="/services/enquiry" />
        <SvcItem icon="⚡" iconBg="rgba(0,212,255,0.10)" label="EV Charging Station Install" desc="Home & commercial" href="https://www.soumyashipower.in/" />
        <SvcItem icon="🔋" iconBg="rgba(124,58,237,0.12)" label="Battery Swap" desc="Fast swap, home pickup" href="/battery-swap" />
      </div>

      {/* Column 2 — Energy & Power */}
      <div style={{ paddingLeft: 20 }}>
        <ColHeader emoji="🌿" title="Energy & Power" color="#f97316" />
        <SvcItem icon="☀️" iconBg="rgba(249,115,22,0.12)" label="Solar Power Plant" desc="Rooftop & captive up to 1MW" href="https://www.soumyashipower.in/" />
        <SvcItem icon="💨" iconBg="rgba(0,212,255,0.10)" label="Wind Power Plant" desc="Hybrid wind-solar systems" href="https://www.soumyashipower.in/" />
        <SvcItem icon="🔧" iconBg="rgba(16,185,129,0.10)" label="All Services" desc="View the full list" href="/services" />
      </div>

      {/* Bottom bar */}
      <div style={{ gridColumn: "1 / -1", marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/services"
          style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 500, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          View all services →
        </Link>
        <Link
          href="/services/enquiry"
          style={{ fontSize: 13, fontWeight: 700, color: "#0a0f1e", background: "#00d4ff", padding: "8px 16px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
        >
          Book a Service Now →
        </Link>
      </div>
    </motion.div>
  );
}
