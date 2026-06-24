import Link from "next/link";

export default function SwapSuccess({ result, copied, onCopyToken }: {
  result: { token: string; phone: string; email: string };
  copied: boolean;
  onCopyToken: () => void;
}) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "var(--green-bg)",
          border: "2px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 24px", boxShadow: "var(--shadow-md)",
        }}>✓</div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-heading)", margin: "0 0 8px" }}>Request Submitted! 🎉</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 36 }}>
          We'll call you on <strong style={{ color: "var(--text-heading)" }}>{result.phone}</strong> within 2 hours to confirm your slot.
        </p>

        {/* Token card */}
        <div style={{
          background: "var(--bg-card)", border: "2px solid var(--navy)", borderRadius: 16,
          padding: 28, marginBottom: 28, boxShadow: "var(--shadow-navy)",
        }}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px" }}>YOUR SWAP TOKEN</p>
          <p style={{ fontSize: 32, fontWeight: 900, fontFamily: "monospace", color: "var(--navy)", letterSpacing: "0.06em", margin: "0 0 12px" }}>
            {result.token}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px" }}>Save this token to track your request</p>
          <button
            onClick={onCopyToken}
            style={{
              padding: "8px 20px", background: copied ? "var(--green)" : "var(--navy-bg)",
              border: `1px solid ${copied ? "var(--green)" : "var(--navy)"}`, borderRadius: 8,
              color: copied ? "#fff" : "var(--navy)", fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Token"}
          </button>
        </div>

        {result.email && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>
            📩 Confirmation sent to <span style={{ color: "var(--text-muted)" }}>{result.email}</span>
          </p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/battery-swap/track" style={{
            padding: "12px 24px", background: "var(--grad-navy)", color: "#fff",
            fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none",
            boxShadow: "var(--shadow-navy)",
          }}>
            Track My Swap →
          </Link>
          <Link href="/" style={{
            padding: "12px 24px", background: "var(--bg-card)", color: "var(--text-muted)",
            fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: "none",
            border: "1px solid var(--border-default)",
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
