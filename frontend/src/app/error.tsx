"use client";
import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ fontSize: 72, margin: "0 0 16px" }}>⚠️</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 12px" }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 36 }}>
          An unexpected error occurred. Please try again or contact us if the problem persists.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{ padding: "12px 28px", background: "var(--grad-navy)", color: "#ffffff", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "var(--shadow-navy)" }}
          >
            Try Again
          </button>
          <Link href="/" style={{ padding: "12px 28px", border: "1px solid var(--border-default)", color: "var(--text-body)", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
