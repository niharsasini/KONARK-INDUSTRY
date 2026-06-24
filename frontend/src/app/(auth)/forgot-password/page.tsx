"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";

const INPUT: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border-default)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "var(--text-body)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const focus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#0f4c81";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#d4c9b8";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 40, boxShadow: "var(--shadow-md)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 8px" }}>Forgot Password</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
          Enter the email linked to your account and we&apos;ll send you a link to reset your password.
        </p>

        {sent ? (
          <div style={{ padding: "16px 18px", background: "var(--green-bg)", border: "1px solid rgba(26,122,74,0.25)", borderRadius: 12, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, margin: 0 }}>
              Check your email for reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div style={{ padding: "10px 14px", background: "var(--red-bg)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 8, fontSize: 12, color: "var(--red)" }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Email Address</label>
              <input
                aria-label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={INPUT}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "14px", background: loading ? "#0a3460" : "var(--grad-navy)", color: "#ffffff", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "var(--shadow-navy)" }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <Link href="/login" style={{ display: "block", marginTop: 20, fontSize: 13, color: "#0f4c81", textDecoration: "none", textAlign: "center" }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
