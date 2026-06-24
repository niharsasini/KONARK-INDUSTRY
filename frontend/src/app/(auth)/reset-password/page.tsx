"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/api";

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--bg-page)", minHeight: "100vh" }} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setError("");

    if (!token) {
      setError("Missing or invalid reset link.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 40, boxShadow: "var(--shadow-md)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 8px" }}>Reset Password</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
          Choose a new password for your account.
        </p>

        {success ? (
          <div style={{ padding: "16px 18px", background: "var(--green-bg)", border: "1px solid rgba(26,122,74,0.25)", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, margin: 0 }}>
              Password reset! Redirecting to login...
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
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  aria-label="New password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ ...INPUT, paddingRight: 44 }}
                  onFocus={focus}
                  onBlur={blur}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Confirm Password</label>
              <input
                aria-label="Confirm password"
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
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
              {loading ? "Resetting..." : "Reset Password"}
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
