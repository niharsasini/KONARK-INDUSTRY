export default function StepIndicator({ current }: { current: number }) {
  const steps = ["Your Details", "Battery Info", "Schedule", "Confirm"];
  return (
    <>
      {/* Desktop step bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, gap: 0 }} className="step-bar-desktop">
        {steps.map((label, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 700, fontSize: 14,
                  background: done ? "var(--green)" : "var(--bg-card)",
                  color: done ? "var(--bg-page)" : active ? "var(--sky)" : "var(--slate)",
                  border: active ? "2px solid var(--sky)" : done ? "none" : "none",
                  boxShadow: active ? "var(--neu-shadow)" : done ? "none" : "var(--neu-inset)",
                }}>
                  {done ? "✓" : idx}
                </div>
                <span style={{ fontSize: 11, color: active ? "var(--sky)" : done ? "var(--green)" : "var(--text-subtle)", fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 3 && <div style={{ width: 80, height: 2, background: done ? "var(--green)" : "var(--border-default)", margin: "0 4px", marginBottom: 24 }} />}
            </div>
          );
        })}
      </div>
      {/* Mobile step text */}
      <p style={{ textAlign: "center", color: "var(--text-subtle)", fontSize: 13, marginBottom: 24 }} className="step-bar-mobile">
        Step {current} of 4 — <span style={{ color: "var(--sky)" }}>{steps[current - 1]}</span>
      </p>
    </>
  );
}
