"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";

const INPUT: React.CSSProperties = {
  width: "100%",
  background: "#080f1e",
  border: "1px solid #1c3050",
  borderRadius: 10,
  padding: "12px 16px",
  color: "#f1f5f9",
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
    e.currentTarget.style.borderColor = "#38bdf8";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#1c3050";
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #050a14 0%, #080f1e 40%, #050a14 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#0c1525", border: "1px solid #1c3050", borderRadius: 20, padding: 40 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>Forgot Password</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.6 }}>
          Enter the email linked to your account and we&apos;ll send you a link to reset your password.
        </p>

        {sent ? (
          <div style={{ padding: "16px 18px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#10b981", fontWeight: 600, margin: 0 }}>
              Check your email for reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, fontSize: 12, color: "#ef4444" }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Email Address</label>
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
              style={{ padding: "14px", background: loading ? "#0891b2" : "#38bdf8", color: "#080f1e", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <Link href="/login" style={{ display: "block", marginTop: 20, fontSize: 13, color: "#38bdf8", textDecoration: "none", textAlign: "center" }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
