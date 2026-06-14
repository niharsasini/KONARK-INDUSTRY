export default function NavButtons({ onNext, onBack, nextLabel = "Next →", disabled = false }: {
  onNext?: () => void; onBack?: () => void; nextLabel?: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
      {onBack && (
        <button onClick={onBack} style={{
          flex: "0 0 auto", padding: "12px 24px", background: "transparent",
          border: "1px solid #1e2d40", borderRadius: 8, color: "#94a3b8",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          ← Back
        </button>
      )}
      {onNext && (
        <button onClick={onNext} disabled={disabled} style={{
          flex: 1, padding: "14px 24px", background: disabled ? "#1e2d40" : "#00d4ff",
          border: "none", borderRadius: 8, color: disabled ? "#64748b" : "#0a0f1e",
          fontSize: 14, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
