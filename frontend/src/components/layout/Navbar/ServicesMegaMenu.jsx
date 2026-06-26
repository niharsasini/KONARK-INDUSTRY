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
        top: "calc(100% + 4px)",
        left: 0,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border-light)",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(26,15,0,0.18), 0 0 0 1px rgba(15,76,129,0.05)",
        padding: 24,
        zIndex: 200,
        minWidth: 560,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
      }}
    >
      {/* Transparent bridge — covers the gap between nav link and panel */}
      <div style={{ position: "absolute", top: -8, left: 0, right: 0, height: 8, background: "transparent" }} />
      {/* Column 1 — Home & EV Services */}
      <div style={{ paddingRight: 20, borderRight: "1px solid var(--border-light)" }}>
        <ColHeader emoji="🏠" title="Home & EV Services" color="var(--navy)" />
        <SvcItem icon="❄️" iconBg="rgba(15,76,129,0.12)" label="AC Repair & Service" desc="All brands, same day" href="/services/enquiry" />
        <SvcItem icon="⚡" iconBg="rgba(15,76,129,0.10)" label="EV Charging Station Install" desc="Home & commercial" href="https://www.soumyashipower.in/" />
        <SvcItem icon="🔋" iconBg="rgba(91,33,182,0.12)" label="Battery Swap" desc="Fast swap, home pickup" href="/battery-swap" />
      </div>

      {/* Column 2 — Energy & Power */}
      <div style={{ paddingLeft: 20 }}>
        <ColHeader emoji="🌿" title="Energy & Power" color="var(--gold)" />
        <SvcItem icon="☀️" iconBg="rgba(193,127,36,0.12)" label="Solar Power Plant" desc="Rooftop & captive up to 1MW" href="https://www.soumyashipower.in/" />
        <SvcItem icon="💨" iconBg="rgba(15,76,129,0.10)" label="Wind Power Plant" desc="Hybrid wind-solar systems" href="https://www.soumyashipower.in/" />
        <SvcItem icon="🔧" iconBg="rgba(26,122,74,0.10)" label="All Services" desc="View the full list" href="/services" />
      </div>

      {/* Bottom bar */}
      <div style={{ gridColumn: "1 / -1", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/services"
          style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-heading)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          View all services →
        </Link>
        <Link
          href="/services/enquiry"
          style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--navy)", padding: "8px 16px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--navy-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--navy)")}
        >
          Book a Service Now →
        </Link>
      </div>
    </motion.div>
  );
}
