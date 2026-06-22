import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DROPDOWN_VARIANTS } from "./constants";
import { ColHeader, ProdItem } from "./MegaMenuItems";

export default function ProductsMegaMenu({ onPanelEnter, onPanelLeave }) {
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
        minWidth: 620,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 160px",
        gap: 0,
      }}
    >
      {/* Column 1 — EV Vehicles */}
      <div style={{ paddingRight: 20, borderRight: "1px solid #1e2d40" }}>
        <ColHeader emoji="⚡" title="EV Vehicles" color="#00d4ff" />
        <ProdItem icon="🛵" iconBg="rgba(0,212,255,0.12)" label="EV Scooters" href="/products?cat=ev-scooter" />
        <ProdItem icon="🛺" iconBg="rgba(0,212,255,0.10)" label="E-Rickshaws" href="/products?cat=e-rickshaw" />
        <ProdItem icon="🏍" iconBg="rgba(0,212,255,0.10)" label="Electric Motorcycles" href="/products?cat=electric-motorcycle" />
        <Link
          href="/test-ride"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 8, textDecoration: "none", marginTop: 8, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", transition: "background 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.22)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.12)")}
        >
          <span style={{ fontSize: 15 }}>🎯</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#00d4ff" }}>Book Test Ride</span>
        </Link>
      </div>

      {/* Column 2 — Shop Products */}
      <div style={{ paddingLeft: 20, paddingRight: 20, borderRight: "1px solid #1e2d40" }}>
        <ColHeader emoji="🛒" title="Shop Products" color="#a78bfa" />
        <ProdItem icon="💨" iconBg="rgba(167,139,250,0.12)" label="BLDC Fans" href="/products?cat=fan" />
        <ProdItem icon="❄️" iconBg="rgba(167,139,250,0.10)" label="Air Conditioners" href="/products?cat=ac" />
        <ProdItem icon="🔋" iconBg="rgba(167,139,250,0.10)" label="LFP Batteries" href="/products?cat=battery" />
        <ProdItem icon="☀️" iconBg="rgba(167,139,250,0.10)" label="Solar Inverters" href="/products?cat=solar" />
        <ProdItem icon="⚙️" iconBg="rgba(167,139,250,0.10)" label="Industrial Motors" href="/products?cat=industrial" />
      </div>

      {/* Column 3 — Featured Product card */}
      <div style={{ paddingLeft: 20, display: "flex", flexDirection: "column" }}>
        <ColHeader emoji="⭐" title="Featured" color="#f59e0b" />
        <Link
          href="/products?cat=ev-scooter"
          style={{ display: "block", textDecoration: "none", background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, overflow: "hidden", flex: 1, transition: "border-color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
        >
          <div style={{ background: "#0d1424", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px", height: 90 }}>
            <Image src="/productimg/Electric Scooter.png" alt="EV Scooter" width={140} height={80} style={{ maxHeight: 80, width: "auto", objectFit: "contain" }} />
          </div>
          <div style={{ padding: "10px 10px 12px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>EV Scooter Pro</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00d4ff", marginBottom: 6 }}>₹89,999</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>View →</div>
          </div>
        </Link>
      </div>

      {/* Bottom bar */}
      <div style={{ gridColumn: "1 / -1", marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/products"
          style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 500, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          Browse all products →
        </Link>
        <Link
          href="/battery-swap"
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#a78bfa", textDecoration: "none", fontWeight: 600, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#a78bfa")}
        >
          🔋 Battery Swap —&nbsp;
          <span style={{ fontSize: 9, background: "#7c3aed", color: "#fff", padding: "2px 6px", borderRadius: 3, fontWeight: 800, letterSpacing: "0.04em" }}>NEW</span>
        </Link>
      </div>
    </motion.div>
  );
}
