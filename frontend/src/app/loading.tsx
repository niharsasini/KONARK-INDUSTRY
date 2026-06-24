export default function Loading() {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,76,129,0.1)" }}>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="var(--navy)" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", letterSpacing: "0.05em" }}>KONARK INDUSTRY</span>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border-default)", borderTopColor: "var(--navy)", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
