function Shimmer({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="skeleton"
      style={{
        borderRadius: 14,
        ...style,
      }}
    />
  );
}

export default function Loading() {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <Shimmer style={{ height: 32, width: 180, marginBottom: 32, borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[...Array(3)].map((_, i) => (
            <Shimmer key={i} style={{ height: 100 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
