import Link from "next/link";

export default function PowerLogo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, var(--navy), var(--sky))",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(13,81,140,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
          <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, lineHeight: 1 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: "var(--text-heading)", letterSpacing: "-0.3px", lineHeight: 1 }}>KONARK</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--navy)", letterSpacing: "2.5px", textTransform: "uppercase", lineHeight: 1, marginTop: 2 }}>INDUSTRY</span>
      </div>
    </Link>
  );
}
