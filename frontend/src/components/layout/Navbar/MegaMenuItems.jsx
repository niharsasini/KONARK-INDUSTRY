import Link from "next/link";

/* Shared building blocks for ProductsMegaMenu / ServicesMegaMenu */

export function ColHeader({ emoji, title, color }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color,
      textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: 12, paddingBottom: 8,
      borderBottom: "1px solid var(--border-light)",
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
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,76,129,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: iconBg || "rgba(15,76,129,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: highlight ? "var(--navy)" : "var(--text-heading)", display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        {isNew && <span style={{ fontSize: 9, background: "var(--navy)", color: "#fff", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>NEW</span>}
      </span>
    </Link>
  );
}

export function SvcItem({ icon, iconBg, label, desc, href }) {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,76,129,0.06)")}
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
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 1 }}>{desc}</div>
      </div>
    </Link>
  );
}
