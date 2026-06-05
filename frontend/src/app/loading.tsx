export default function Loading() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)" }}>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="#00d4ff" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.05em" }}>KONARK INDUSTRY</span>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #1e2d40", borderTopColor: "#00d4ff", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
