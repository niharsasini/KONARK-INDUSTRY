"use client";
import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #050a14 0%, #080f1e 40%, #050a14 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ fontSize: 72, margin: "0 0 16px" }}>⚠️</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px" }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36 }}>
          An unexpected error occurred. Please try again or contact us if the problem persists.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{ padding: "12px 28px", background: "#38bdf8", color: "#080f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
          <Link href="/" style={{ padding: "12px 28px", border: "1px solid #1c3050", color: "#f1f5f9", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
