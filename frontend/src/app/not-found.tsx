import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Konark Industry",
};

export default function NotFound() {
  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{
          fontSize: "clamp(80px, 15vw, 120px)", fontWeight: 900, margin: "0 0 8px",
          background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}>404</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px" }}>Page not found</h1>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
            Go Home
          </Link>
          <Link href="/products" style={{ padding: "12px 28px", border: "1px solid #1e2d40", color: "#f1f5f9", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
