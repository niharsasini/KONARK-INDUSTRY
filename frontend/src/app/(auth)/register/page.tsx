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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1000);
  };

  return (
    <div style={{
      background: "#0a0f1e", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
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
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>Create an account</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>Join 25,000+ Konark customers</p>
        </div>

        <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: "36px 32px" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 10px" }}>Account Created!</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24, lineHeight: 1.7 }}>
                Welcome to Konark Industry. You can now sign in with your credentials.
              </p>
              <Link href="/login" style={{ display: "inline-block", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 10, textDecoration: "none" }}>
                Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Rajesh Kumar" },
                { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                { key: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={set(f.key)}
                    required={f.key !== "phone"}
                    placeholder={f.placeholder}
                    style={INPUT}
                    onFocus={focus}
                    onBlur={blur}
                    minLength={f.key === "password" ? 8 : undefined}
                  />
                </div>
              ))}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "14px", background: loading ? "#0891b2" : "#00d4ff",
                color: "#0a0f1e", fontWeight: 800, fontSize: 15, borderRadius: 10,
                border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
              }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
          )}

          {!success && (
            <div style={{ borderTop: "1px solid #1e2d40", marginTop: 24, paddingTop: 20, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>Sign In →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
