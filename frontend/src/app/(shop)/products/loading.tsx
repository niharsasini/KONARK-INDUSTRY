function Shimmer({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg,#0f172a,#1e2d40,#0f172a)",
        backgroundSize: "1000px 100%",
        animation: "shimmer 2s infinite",
        borderRadius: 16,
        ...style,
      }}
    />
  );
}

export default function Loading() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <Shimmer style={{ height: 32, width: 220, marginBottom: 24, borderRadius: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
          {[...Array(8)].map((_, i) => (
            <Shimmer key={i} style={{ height: 320 }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }`}</style>
    </div>
  );
}
