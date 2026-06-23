import Link from "next/link";

export default function SwapSuccess({ result, copied, onCopyToken }: {
  result: { token: string; phone: string; email: string };
  copied: boolean;
  onCopyToken: () => void;
}) {
  return (
    <main style={{ minHeight: "100vh", background: "#080f1e", padding: "80px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "rgba(56,189,248,0.12)",
          border: "2px solid #38bdf8", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 24px", boxShadow: "0 0 32px rgba(56,189,248,0.25)",
        }}>✓</div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9", margin: "0 0 8px" }}>Request Submitted! 🎉</h1>
        <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 36 }}>
          We'll call you on <strong style={{ color: "#f1f5f9" }}>{result.phone}</strong> within 2 hours to confirm your slot.
        </p>

        {/* Token card */}
        <div style={{
          background: "#0c1525", border: "2px solid #38bdf8", borderRadius: 16,
          padding: 28, marginBottom: 28, boxShadow: "0 0 32px rgba(56,189,248,0.12)",
        }}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: "0 0 10px" }}>YOUR SWAP TOKEN</p>
          <p style={{ fontSize: 32, fontWeight: 900, fontFamily: "monospace", color: "#38bdf8", letterSpacing: "0.06em", margin: "0 0 12px" }}>
            {result.token}
          </p>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px" }}>Save this token to track your request</p>
          <button
            onClick={onCopyToken}
            style={{
              padding: "8px 20px", background: copied ? "#10b981" : "rgba(56,189,248,0.12)",
              border: `1px solid ${copied ? "#10b981" : "#38bdf8"}`, borderRadius: 8,
              color: copied ? "#fff" : "#38bdf8", fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Token"}
          </button>
        </div>

        {result.email && (
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 28 }}>
            📩 Confirmation sent to <span style={{ color: "#94a3b8" }}>{result.email}</span>
          </p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/battery-swap/track" style={{
            padding: "12px 24px", background: "#38bdf8", color: "#080f1e",
            fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none",
          }}>
            Track My Swap →
          </Link>
          <Link href="/" style={{
            padding: "12px 24px", background: "transparent", color: "#94a3b8",
            fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: "none",
            border: "1px solid #1c3050",
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
