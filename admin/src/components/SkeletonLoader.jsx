"use client";

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

const skeletonBg = {
  background: "linear-gradient(90deg, #1e2d40 25%, #263548 50%, #1e2d40 75%)",
  backgroundSize: "800px 100%",
  animation: "shimmer 1.4s infinite linear",
  borderRadius: 8,
};

function Box({ w = "100%", h = 18, style = {} }) {
  return <div style={{ width: w, height: h, ...skeletonBg, ...style }} />;
}

export function StatCardsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 32 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <Box w="60%" h={12} />
            <Box w={34} h={34} style={{ borderRadius: 8 }} />
          </div>
          <Box w="40%" h={34} style={{ marginBottom: 8 }} />
          <Box w="50%" h={11} />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ background: "#0f172a", padding: "14px 16px", display: "flex", gap: 20 }}>
        {[...Array(cols)].map((_, i) => (
          <Box key={i} w={`${60 + i * 10}px`} h={12} />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} style={{ padding: "14px 16px", borderTop: "1px solid #1e2d40", display: "flex", gap: 20, alignItems: "center" }}>
          {[...Array(cols)].map((_, j) => (
            <Box key={j} w={`${50 + j * 15}px`} h={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({ variant = "table" }) {
  return (
    <>
      <style>{shimmer}</style>
      {variant === "stats" && <StatCardsSkeleton />}
      {variant === "table" && <TableSkeleton />}
      {variant === "dashboard" && (
        <>
          <StatCardsSkeleton />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 28 }}>
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
              <Box w="30%" h={16} style={{ marginBottom: 20 }} />
              <Box w="100%" h={120} />
            </div>
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
              <Box w="40%" h={16} style={{ marginBottom: 18 }} />
              {[...Array(4)].map((_, i) => (
                <Box key={i} w="100%" h={40} style={{ marginBottom: 10 }} />
              ))}
            </div>
          </div>
          <TableSkeleton rows={5} cols={5} />
        </>
      )}
    </>
  );
}
