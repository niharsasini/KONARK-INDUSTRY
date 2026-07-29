"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PROMPT_KEY = "konark_auth_prompt_last_shown";
const PROMPT_INTERVAL = 2.5 * 60 * 1000;

export default function AuthPromptModal() {
  const [show, setShow] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("konark_user");
    if (isLoggedIn) return;

    const lastShown = localStorage.getItem(PROMPT_KEY);
    const now = Date.now();

    if (!lastShown) {
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }

    const elapsed = now - parseInt(lastShown, 10);
    if (elapsed > PROMPT_INTERVAL) {
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handleRequireAuth = (e) => {
      const isLoggedIn = localStorage.getItem("konark_token");
      if (isLoggedIn) return;
      setPendingRedirect(e.detail?.redirectPath || null);
      setShow(true);
    };
    window.addEventListener("konark:require-auth", handleRequireAuth);
    return () => window.removeEventListener("konark:require-auth", handleRequireAuth);
  }, []);

  const dismiss = () => {
    localStorage.setItem(PROMPT_KEY, Date.now().toString());
    setPendingRedirect(null);
    setShow(false);
  };

  const goRegister = () => {
    localStorage.setItem(PROMPT_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString());
    if (pendingRedirect) localStorage.setItem("konark_auth_redirect", pendingRedirect);
    setPendingRedirect(null);
    setShow(false);
    router.push("/register");
  };

  const goLogin = () => {
    localStorage.setItem(PROMPT_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString());
    if (pendingRedirect) localStorage.setItem("konark_auth_redirect", pendingRedirect);
    setPendingRedirect(null);
    setShow(false);
    router.push("/login");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="auth-prompt-modal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 360,
            background: "rgba(22,41,82,0.9)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(79,195,247,0.15)",
            borderRadius: 24,
            boxShadow: "0 32px 80px rgba(10,14,26,0.7)",
            padding: "28px",
          }}
        >
          {/* Close */}
          <button
            onClick={dismiss}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "transparent", border: "none",
              cursor: "pointer", color: "var(--text-subtle)", padding: 4,
              borderRadius: 6, display: "flex", alignItems: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--grad-primary)", marginBottom: 16 }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
              <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="var(--text-heading)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" fill="var(--text-heading)" />
            </svg>
          </div>

          <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 8px", paddingRight: 20 }}>
            Join 25,000+ Konark customers
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, margin: "0 0 18px" }}>
            Create a free account to track your orders, save products to wishlist, and get exclusive member deals.
          </p>

          {/* Benefit pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, background: "rgba(13,81,140,0.12)", border: "1px solid rgba(13,81,140,0.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 20 }}>
            {["Track your orders", "Save to wishlist", "Member-only prices"].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--green)" }}>
                <span style={{ fontWeight: 800 }}>✓</span>
                <span style={{ color: "var(--text-body)" }}>{b}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={goRegister}
            style={{
              width: "100%", padding: "13px", background: "var(--grad-primary)",
              color: "var(--text-heading)", fontWeight: 800, fontSize: 14,
              borderRadius: 10, border: "none", cursor: "pointer",
              marginBottom: 12, transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Create Free Account →
          </button>

          <p style={{ textAlign: "center", margin: 0 }}>
            <button
              onClick={goLogin}
              style={{ background: "transparent", border: "none", fontSize: 12, color: "var(--text-subtle)", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
            >
              Already have an account? <span style={{ color: "var(--navy)", fontWeight: 600 }}>Sign in</span>
            </button>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
