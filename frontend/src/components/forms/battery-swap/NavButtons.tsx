export default function NavButtons({ onNext, onBack, nextLabel = "Next →", disabled = false }: {
  onNext?: () => void; onBack?: () => void; nextLabel?: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
      {onBack && (
        <button onClick={onBack} style={{
          flex: "0 0 auto", padding: "12px 24px", background: "var(--bg-card)",
          border: "1px solid var(--border-default)", borderRadius: 8, color: "var(--text-muted)",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          ← Back
        </button>
      )}
      {onNext && (
        <button onClick={onNext} disabled={disabled} style={{
          flex: 1, padding: "14px 24px", background: disabled ? "var(--border-default)" : "var(--grad-navy)",
          border: "none", borderRadius: 8, color: disabled ? "var(--text-subtle)" : "#fff",
          fontSize: 14, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: disabled ? "none" : "var(--shadow-navy)",
          transition: "background 0.2s",
        }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
