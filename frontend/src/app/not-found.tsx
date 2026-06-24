import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Konark Industry",
};

export default function NotFound() {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{
          fontSize: "clamp(80px, 15vw, 120px)", fontWeight: 900, margin: "0 0 8px",
          background: "var(--grad-navy)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}>404</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 12px" }}>Page not found</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 36 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ padding: "12px 28px", background: "var(--grad-navy)", color: "#ffffff", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", boxShadow: "var(--shadow-navy)" }}>
            Go Home
          </Link>
          <Link href="/products" style={{ padding: "12px 28px", border: "1px solid var(--border-default)", color: "var(--text-body)", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
