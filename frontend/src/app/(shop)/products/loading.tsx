function Shimmer({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="skeleton"
      style={{
        borderRadius: 16,
        ...style,
      }}
    />
  );
}

export default function Loading() {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <Shimmer style={{ height: 32, width: 220, marginBottom: 24, borderRadius: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
          {[...Array(8)].map((_, i) => (
            <Shimmer key={i} style={{ height: 320 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
