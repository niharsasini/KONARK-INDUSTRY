"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("konark_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("konark_cookie_consent", "all");
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("konark_cookie_consent", "necessary");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9000,
      display: "flex", justifyContent: "center", padding: "12px 16px",
      background: "rgba(10,15,30,0.98)", backdropFilter: "blur(12px)",
      borderTop: "1px solid #1e2d40",
    }}>
      <div style={{ maxWidth: 900, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, flex: 1, minWidth: 200 }}>
          We use cookies to improve your experience. By using our site, you agree to our{" "}
          <Link href="/contact" style={{ color: "#00d4ff", textDecoration: "none" }}>Privacy Policy</Link>.
        </p>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={acceptNecessary}
            style={{ padding: "8px 16px", border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer" }}
          >
            Necessary Only
          </button>
          <button
            onClick={accept}
            style={{ padding: "8px 16px", background: "#00d4ff", color: "#0a0f1e", fontSize: 12, fontWeight: 700, borderRadius: 8, border: "none", cursor: "pointer" }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
