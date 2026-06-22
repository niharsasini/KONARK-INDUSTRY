function Shimmer({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg,#0f172a,#1e2d40,#0f172a)",
        backgroundSize: "1000px 100%",
        animation: "shimmer 2s infinite",
        borderRadius: 14,
        ...style,
      }}
    />
  );
}

export default function Loading() {
  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <Shimmer style={{ height: 28, width: 160, marginBottom: 32, borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[...Array(3)].map((_, i) => (
            <Shimmer key={i} style={{ height: 90 }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }`}</style>
    </div>
  );
}
