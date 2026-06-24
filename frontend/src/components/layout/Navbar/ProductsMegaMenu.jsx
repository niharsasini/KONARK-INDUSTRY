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
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border-light)",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(26,15,0,0.18), 0 0 0 1px rgba(15,76,129,0.05)",
        padding: 24,
        zIndex: 200,
        minWidth: 620,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 160px",
        gap: 0,
      }}
    >
      {/* Column 1 — EV Vehicles */}
      <div style={{ paddingRight: 20, borderRight: "1px solid var(--border-light)" }}>
        <ColHeader emoji="⚡" title="EV Vehicles" color="var(--navy)" />
        <ProdItem icon="🛵" iconBg="rgba(15,76,129,0.12)" label="EV Scooters" href="/products?cat=ev-scooter" />
        <ProdItem icon="🛺" iconBg="rgba(15,76,129,0.10)" label="E-Rickshaws" href="/products?cat=e-rickshaw" />
        <ProdItem icon="🏍" iconBg="rgba(15,76,129,0.10)" label="Electric Motorcycles" href="/products?cat=electric-motorcycle" />
        <Link
          href="/test-ride"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 8, textDecoration: "none", marginTop: 8, background: "rgba(15,76,129,0.10)", border: "1px solid rgba(15,76,129,0.25)", transition: "background 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,76,129,0.18)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(15,76,129,0.10)")}
        >
          <span style={{ fontSize: 15 }}>🎯</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>Book Test Ride</span>
        </Link>
      </div>

      {/* Column 2 — Shop Products */}
      <div style={{ paddingLeft: 20, paddingRight: 20, borderRight: "1px solid var(--border-light)" }}>
        <ColHeader emoji="🛒" title="Shop Products" color="var(--purple)" />
        <ProdItem icon="💨" iconBg="rgba(91,33,182,0.10)" label="BLDC Fans" href="/products?cat=fan" />
        <ProdItem icon="❄️" iconBg="rgba(91,33,182,0.08)" label="Air Conditioners" href="/products?cat=ac" />
        <ProdItem icon="🔋" iconBg="rgba(91,33,182,0.08)" label="LFP Batteries" href="/products?cat=battery" />
        <ProdItem icon="☀️" iconBg="rgba(91,33,182,0.08)" label="Solar Inverters" href="/products?cat=solar" />
        <ProdItem icon="⚙️" iconBg="rgba(91,33,182,0.08)" label="Industrial Motors" href="/products?cat=industrial" />
      </div>

      {/* Column 3 — Featured Product card */}
      <div style={{ paddingLeft: 20, display: "flex", flexDirection: "column" }}>
        <ColHeader emoji="⭐" title="Featured" color="var(--gold)" />
        <Link
          href="/products?cat=ev-scooter"
          style={{ display: "block", textDecoration: "none", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, overflow: "hidden", flex: 1, transition: "border-color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(15,76,129,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
        >
          <div style={{ background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px", height: 90 }}>
            <Image src="/productimg/Electric Scooter.png" alt="EV Scooter" width={140} height={80} style={{ maxHeight: 80, width: "auto", objectFit: "contain" }} />
          </div>
          <div style={{ padding: "10px 10px 12px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-heading)", marginBottom: 2 }}>EV Scooter Pro</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--gold)", marginBottom: 6 }}>₹89,999</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>View →</div>
          </div>
        </Link>
      </div>

      {/* Bottom bar */}
      <div style={{ gridColumn: "1 / -1", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/products"
          style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-heading)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Browse all products →
        </Link>
        <Link
          href="/battery-swap"
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--purple)", textDecoration: "none", fontWeight: 600, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--purple)")}
        >
          🔋 Battery Swap —&nbsp;
          <span style={{ fontSize: 9, background: "var(--purple)", color: "#fff", padding: "2px 6px", borderRadius: 3, fontWeight: 800, letterSpacing: "0.04em" }}>NEW</span>
        </Link>
      </div>
    </motion.div>
  );
}
