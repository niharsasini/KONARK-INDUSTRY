import Link from "next/link";

/* Shared building blocks for ProductsMegaMenu / ServicesMegaMenu */

export function ColHeader({ emoji, title, color }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color,
      textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: 12, paddingBottom: 8,
      borderBottom: "1px solid #1c3050",
    }}>
      {emoji} {title}
    </div>
  );
}

export function ProdItem({ icon, iconBg, label, href, highlight, isNew }) {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56,189,248,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: iconBg || "rgba(56,189,248,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: highlight ? "#38bdf8" : "#f1f5f9", display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        {isNew && <span style={{ fontSize: 9, background: "#38bdf8", color: "#080f1e", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>NEW</span>}
      </span>
    </Link>
  );
}

export function SvcItem({ icon, iconBg, label, desc, href }) {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56,189,248,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, flexShrink: 0, marginTop: 1,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{desc}</div>
      </div>
    </Link>
  );
}
