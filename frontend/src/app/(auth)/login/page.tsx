"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Package, Star, ShieldCheck } from "lucide-react";
import { loginUser } from "@/lib/api";

const INPUT: React.CSSProperties = {
  width: "100%",
  background: "#0a0f1e",
  border: "1px solid #1e2d40",
  borderRadius: 10,
  padding: "12px 16px",
  color: "#f1f5f9",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const BENEFITS = [
  { icon: Package, text: "Track all your orders in real time" },
  { icon: Star, text: "Save products to your personal wishlist" },
  { icon: ShieldCheck, text: "Access member-only prices and deals" },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64, display: "flex" }}>
      {/* Left panel */}
      <div style={{
        flex: "0 0 60%", display: "flex", flexDirection: "column", alignItems: "flex-start",
        justifyContent: "center", padding: "60px 80px",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 100%)",
        borderRight: "1px solid #1e2d40", position: "relative", overflow: "hidden",
      }} className="login-left">
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 60 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)" }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
              <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" fill="#00d4ff" />
            </svg>
          </div>
          <div>
            <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#fff" }}>KONARK</span>
            <span style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: "#00d4ff", textTransform: "uppercase" }}>INDUSTRY</span>
          </div>
        </Link>

        <h1 style={{ fontSize: "clamp(32px, 3vw, 52px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.1 }}>
          Welcome back.
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, maxWidth: 440, margin: "0 0 48px" }}>
          Sign in to track orders, manage your wishlist, and access member-only prices.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color="#00d4ff" />
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: "16px 20px", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            "Konark's EVs are built for Odisha roads. Outstanding quality and after-sales service."
          </p>
          <p style={{ fontSize: 11, color: "#64748b", margin: "8px 0 0" }}>— Ramesh Patra, Bhubaneswar</p>
        </div>
      </div>

      {/* Right panel: form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }} className="login-right">
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>Sign In</h2>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 32px" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>Register free →</Link>
          </p>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, marginBottom: 20, fontSize: 13, color: "#ef4444" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Email Address</label>
              <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" style={INPUT} onFocus={focus} onBlur={blur} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Password</label>
                <Link href="/contact" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} required placeholder="••••••••" style={{ ...INPUT, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ padding: "14px", background: loading ? "#0891b2" : "#00d4ff", color: "#0a0f1e", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", marginTop: 4 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#00b8d9"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = loading ? "#0891b2" : "#00d4ff"; }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            <div style={{ position: "relative", textAlign: "center", margin: "4px 0" }}>
              <div style={{ height: 1, background: "#1e2d40", position: "absolute", top: "50%", left: 0, right: 0 }} />
              <span style={{ position: "relative", background: "#0a0f1e", padding: "0 12px", fontSize: 12, color: "#475569" }}>or</span>
            </div>

            <Link href="/products" style={{ display: "block", padding: "13px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none", textAlign: "center", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              Continue as Guest
            </Link>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}
