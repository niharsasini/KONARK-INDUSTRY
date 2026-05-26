"use client";
import { useState } from "react";
import Link from "next/link";

const INPUT = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid #1e2d40",
  borderRadius: 10,
  padding: "12px 16px",
  color: "#f1f5f9",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#00d4ff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#1e2d40";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div style={{
      background: "#0a0f1e", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="#00d4ff" />
              </svg>
            </div>
            <div style={{ lineHeight: 1 }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#fff" }}>KONARK</span>
              <span style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: "#00d4ff", textTransform: "uppercase" }}>INDUSTRY</span>
            </div>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>Sign in to your Konark account</p>
        </div>

        {/* Card */}
        <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: "36px 32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                Email Address
              </label>
              <input type="email" value={form.email} onChange={set("email")} required
                placeholder="you@example.com" style={INPUT} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Password
                </label>
                <Link href="/contact" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <input type="password" value={form.password} onChange={set("password")} required
                placeholder="••••••••" style={INPUT} onFocus={focus} onBlur={blur} />
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", background: loading ? "#0891b2" : "#00d4ff",
              color: "#0a0f1e", fontWeight: 800, fontSize: 15, borderRadius: 10,
              border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ borderTop: "1px solid #1e2d40", marginTop: 24, paddingTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              Don't have an account?{" "}
              <Link href="/register" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>Register →</Link>
            </p>
            <Link href="/products" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
