function Shimmer({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg,#0c1525,#1c3050,#0c1525)",
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
    <div style={{ background: "linear-gradient(135deg, #050a14 0%, #080f1e 40%, #050a14 100%)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
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
