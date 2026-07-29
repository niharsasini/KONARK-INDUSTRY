"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";

const INPUT: React.CSSProperties = {
  width: "100%", background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)",
  borderRadius: 10, padding: "12px 16px", color: "var(--text-heading)",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If a valid token AND auth cookie are both already present, skip the login form.
    // Checking the token too (not just the cookie) avoids bouncing back here in a loop
    // if the cookie is stale but the token was cleared (e.g. after a 401).
    const token = localStorage.getItem("konark_admin_token");
    const hasAuthCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("admin_auth=true"));
    if (token && hasAuthCookie) {
      router.replace("/dashboard");
    }
  }, [router]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--navy)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,81,140,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(92,103,149,0.2)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || data.message || "Invalid credentials.");
      }

      const data = await res.json();
      const token = data.access_token;

      if (!token) {
        throw new Error("No token received.");
      }

      // Store token temporarily so the /me request below can authenticate.
      localStorage.setItem("konark_admin_token", token);

      // The login response only contains tokens, not a user object —
      // fetch the profile separately to verify the admin role.
      const meRes = await fetch(`${backendUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!meRes.ok) {
        localStorage.removeItem("konark_admin_token");
        throw new Error("Failed to verify account.");
      }

      const userData = await meRes.json();

      if (userData.role !== "admin") {
        localStorage.removeItem("konark_admin_token");
        throw new Error("Access denied. Admin account required.");
      }

      localStorage.setItem("konark_admin_user", JSON.stringify(userData));

      // Set cookie with proper attributes
      document.cookie = "admin_auth=true; path=/; max-age=86400; SameSite=Lax";

      // Small delay to ensure the cookie is set before the middleware sees the
      // next navigation request
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "var(--bg-page)", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      backgroundImage: "linear-gradient(rgba(13,81,140,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(13,81,140,0.03) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,81,140,0.1)", margin: "0 auto 20px" }}>
            <Shield size={24} color="var(--navy)" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 6px" }}>Admin Sign In</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Konark Industry · Control Panel</p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 20, padding: "36px 32px" }}>
          {error && (
            <div style={{ padding: "12px 14px", background: "rgba(255,112,67,0.08)", border: "1px solid rgba(255,112,67,0.25)", borderRadius: 8, marginBottom: 20, fontSize: 13, color: "var(--orange)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Email Address</label>
              <input type="email" value={form.email} onChange={set("email")} required placeholder="admin@konarkindustry.com" style={INPUT} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} required placeholder="••••••••••••" style={{ ...INPUT, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ padding: "14px", background: loading ? "var(--navy-dark)" : "var(--navy)", color: "var(--text-heading)", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 4, transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--navy-dark)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = loading ? "var(--navy-dark)" : "var(--navy)"; }}
            >
              {loading ? "Verifying..." : "Sign In to Admin →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", margin: "20px 0 0" }}>
            🔒 Authorized access only · Konark Industry
          </p>
        </div>
      </div>
    </div>
  );
}
