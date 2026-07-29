import Link from "next/link";

export default function PowerLogo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,81,140,0.12)", filter: "drop-shadow(0 0 6px rgba(13,81,140,0.4))" }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
          <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="var(--sky)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" fill="var(--sky)" />
        </svg>
      </div>
      <div style={{ lineHeight: 1 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 900, color: "var(--text-heading)", letterSpacing: "0.05em" }}>KONARK</span>
        <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)" }}>INDUSTRY</span>
      </div>
    </Link>
  );
}
