"use client";
import { RefreshCw, WifiOff } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid rgba(192,57,43,0.35)",
      borderRadius: 14,
      padding: "48px 32px",
      textAlign: "center",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(192,57,43,0.1)",
        border: "1px solid rgba(192,57,43,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
      }}>
        <WifiOff size={22} color="#c0392b" />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a0f00", margin: "0 0 8px" }}>
        Could not load data
      </h3>
      <p style={{ fontSize: 13, color: "#6b5a45", margin: "0 0 24px", lineHeight: 1.6 }}>
        {message || "Backend may be offline. Check your connection and try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 22px", background: "transparent",
            border: "1px solid rgba(192,57,43,0.4)",
            borderRadius: 8, color: "#c0392b",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(192,57,43,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}
