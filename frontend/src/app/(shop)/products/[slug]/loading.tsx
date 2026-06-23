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
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "45% 55%", gap: 40 }}>
        <Shimmer style={{ height: 420 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Shimmer style={{ height: 22, width: "30%", borderRadius: 4 }} />
          <Shimmer style={{ height: 36, width: "80%", borderRadius: 8 }} />
          <Shimmer style={{ height: 32, width: "40%", borderRadius: 8 }} />
          <Shimmer style={{ height: 60 }} />
          <Shimmer style={{ height: 48 }} />
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }`}</style>
    </div>
  );
}
