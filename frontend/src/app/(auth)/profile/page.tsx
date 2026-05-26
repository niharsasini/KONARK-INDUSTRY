"use client";
import Link from "next/link";

const STATS = [
  { label: "Orders Placed", value: "2" },
  { label: "Products Reviewed", value: "1" },
  { label: "Wishlist Items", value: "3" },
];

const QUICK_LINKS = [
  { icon: "📦", label: "My Orders", href: "/orders", desc: "Track and manage your orders" },
  { icon: "🔧", label: "Service Requests", href: "/services/enquiry", desc: "View your service bookings" },
  { icon: "📋", label: "Book a Service", href: "/services/enquiry", desc: "Schedule a technician visit" },
  { icon: "🛒", label: "My Cart", href: "/cart", desc: "View items in your cart" },
];

export default function ProfilePage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Profile header */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20,
          padding: "32px", display: "flex", alignItems: "center", gap: 24,
          marginBottom: 24, flexWrap: "wrap",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))",
            border: "2px solid rgba(0,212,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "#00d4ff",
          }}>
            K
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Konark Customer</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 2px" }}>customer@example.com</p>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Member since January 2024</p>
          </div>
          <Link href="/contact" style={{
            padding: "8px 18px", border: "1px solid #1e2d40", color: "#94a3b8",
            fontSize: 13, fontWeight: 600, borderRadius: 8, textDecoration: "none",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            Edit Profile
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#00d4ff", margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "8px" }}>
          {QUICK_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
                borderRadius: 10, textDecoration: "none",
                borderBottom: i < QUICK_LINKS.length - 1 ? "1px solid #1e2d40" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 20, width: 36, textAlign: "center" }}>{link.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{link.label}</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{link.desc}</p>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, color: "#475569" }}>
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" />
              </svg>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/login" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
