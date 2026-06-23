function Shimmer({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg,#0c1525,#1c3050,#0c1525)",
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
    <div style={{ background: "linear-gradient(135deg, #050a14 0%, #080f1e 40%, #050a14 100%)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <Shimmer style={{ height: 32, width: 180, marginBottom: 32, borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[...Array(3)].map((_, i) => (
            <Shimmer key={i} style={{ height: 100 }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }`}</style>
    </div>
  );
}
