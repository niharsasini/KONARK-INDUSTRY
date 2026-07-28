"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/api";

const CITIES = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Berhampur", "Sambalpur", "Balasore", "Brahmapur", "Other"];

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

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "var(--text-muted)", letterSpacing: "0.08em",
  textTransform: "uppercase", marginBottom: 7,
};

function PasswordStrength({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#c0392b", "#d97706", "#d97706", "#1a7a4a"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "var(--border-default)", transition: "background 0.3s" }} />
      ))}
      <span style={{ fontSize: 11, color: colors[score], fontWeight: 600, marginLeft: 6, minWidth: 40 }}>{labels[score]}</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "", city: CITIES[0], agree: false });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--navy)";
    (e.currentTarget.style as any).boxShadow = "0 0 0 3px rgba(15,76,129,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border-default)";
    (e.currentTarget.style as any).boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setToast("Passwords do not match.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    setLoading(true);
    try {
      await registerUser(form.name, form.phone, form.email, form.password, form.city);
      const firstName = form.name.split(" ")[0];
      setToast(`Welcome to Konark, ${firstName}!`);
      const redirect = localStorage.getItem("konark_auth_redirect");
      localStorage.removeItem("konark_auth_redirect");
      setTimeout(() => router.push(redirect || "/"), 1800);
    } catch (err: unknown) {
      setToast(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))", display: "flex" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "14px 20px", background: toast.includes("match") ? "var(--red-bg)" : "var(--green-bg)",
          border: `1px solid ${toast.includes("match") ? "rgba(192,57,43,0.4)" : "rgba(26,122,74,0.4)"}`,
          borderRadius: 12, fontSize: 14, fontWeight: 700,
          color: toast.includes("match") ? "var(--red)" : "var(--green)",
          boxShadow: "var(--shadow-lg)",
        }}>
          {toast}
        </div>
      )}

      {/* Left panel */}
      <div style={{
        flex: "0 0 40%", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 56px",
        background: "var(--grad-hero)",
        borderRight: "1px solid var(--navy-dark)", position: "relative", overflow: "hidden",
      }} className="reg-left">
        <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)" }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
              <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" fill="#ffffff" />
            </svg>
          </div>
          <div>
            <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#ffffff" }}>KONARK</span>
            <span style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: "#d4952e", textTransform: "uppercase" }}>INDUSTRY</span>
          </div>
        </Link>

        <h1 style={{ fontSize: "clamp(24px, 2.5vw, 40px)", fontWeight: 900, color: "#ffffff", margin: "0 0 10px", lineHeight: 1.15 }}>
          Join Konark Industry
        </h1>
        <p style={{ fontSize: 14, color: "#c4b8a5", margin: "0 0 40px", lineHeight: 1.7 }}>
          India's most trusted homegrown energy brand.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { icon: "📦", text: "Track all your orders in one place" },
            { icon: "❤️", text: "Save products to your wishlist" },
            { icon: "🔔", text: "Get notified about deals and launches" },
            { icon: "🛠", text: "Manage your service bookings" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <p style={{ fontSize: 13, color: "#c4b8a5", margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: "#9a8e7a", margin: "0 0 4px" }}>Trusted by</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", margin: 0 }}>25,000+</p>
          <p style={{ fontSize: 11, color: "#9a8e7a", margin: 0 }}>customers across India</p>
        </div>
      </div>

      {/* Right: form */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 48px", overflowY: "auto" }} className="reg-right">
        <div style={{ width: "100%", maxWidth: 440 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 6px" }}>Create Your Account</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 28px" }}>
            Already have one?{" "}
            <Link href="/login" style={{ color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL}>Full Name *</label>
              <input aria-label="Full name" required value={form.name} onChange={set("name")} placeholder="Rajesh Kumar" style={INPUT} onFocus={focus} onBlur={blur} />
            </div>

            <div>
              <label style={LABEL}>Phone Number</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--text-subtle)", fontWeight: 600 }}>+91</span>
                <input aria-label="Phone number" type="tel" value={form.phone} onChange={set("phone")} placeholder="98765 43210" style={{ ...INPUT, paddingLeft: 44 }} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            <div>
              <label style={LABEL}>Email Address *</label>
              <input aria-label="Email address" required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" style={INPUT} onFocus={focus} onBlur={blur} />
            </div>

            <div>
              <label style={LABEL}>City</label>
              <select value={form.city} onChange={set("city")} style={{ ...INPUT, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                {CITIES.map((c) => <option key={c} value={c} style={{ background: "var(--bg-card)" }}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={LABEL}>Password *</label>
              <div style={{ position: "relative" }}>
                <input aria-label="Password" required type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 8 characters" minLength={8} style={{ ...INPUT, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div>
              <label style={LABEL}>Confirm Password *</label>
              <div style={{ position: "relative" }}>
                <input aria-label="Confirm password" required type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password" style={{ ...INPUT, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <input type="checkbox" required checked={form.agree} onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))} style={{ marginTop: 2, accentColor: "var(--navy)", flexShrink: 0 }} />
              I agree to the{" "}
              <Link href="/contact" style={{ color: "var(--navy)", textDecoration: "none" }}>Terms of Service</Link>{" "}
              and{" "}
              <Link href="/contact" style={{ color: "var(--navy)", textDecoration: "none" }}>Privacy Policy</Link>
            </label>

            <button type="submit" disabled={loading} style={{ padding: "14px", background: loading ? "var(--navy-dark)" : "var(--grad-navy)", color: "#ffffff", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 4, transition: "background 0.2s", boxShadow: "var(--shadow-navy)" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--navy-dark)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = loading ? "var(--navy-dark)" : "var(--navy)"; }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .reg-left { display: none !important; }
          .reg-right { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}
