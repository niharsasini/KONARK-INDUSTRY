"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, getMyOrders, logoutUser } from "@/lib/api";
import { useWishlistStore } from "@/store";

const QUICK_LINKS = [
  { icon: "📦", label: "My Orders", href: "/orders", desc: "Track and manage your orders" },
  { icon: "🔧", label: "Service Requests", href: "/services/enquiry", desc: "View your service bookings" },
  { icon: "📋", label: "Book a Service", href: "/services/enquiry", desc: "Schedule a technician visit" },
  { icon: "🛒", label: "My Cart", href: "/cart", desc: "View items in your cart" },
];

function Skeleton() {
  return (
    <div style={{ animation: "pulse 1.5s infinite" }}>
      <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: 32, height: 120, marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[1, 2, 3].map((i) => <div key={i} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, height: 80 }} />)}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("konark_token") : null;
    if (!token) { router.replace("/login"); return; }

    Promise.all([getCurrentUser(), getMyOrders()])
      .then(([userData, ordersData]: any[]) => {
        setUser(userData);
        const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];
        setOrderCount(orders.length);
      })
      .catch(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("konark_user") : null;
        if (stored) try { setUser(JSON.parse(stored)); } catch {}
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSignOut = () => {
    logoutUser();
    router.push("/login");
  };

  if (loading) return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}><Skeleton /></div>
    </div>
  );

  const displayName = user?.name || "Konark Customer";
  const initial = displayName.charAt(0).toUpperCase();

  const STATS = [
    { label: "Orders Placed", value: String(orderCount) },
    { label: "Wishlist Items", value: String(wishlistCount) },
    { label: "Member", value: user?.created_at ? new Date(user.created_at).getFullYear().toString() : "2024" },
  ];

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Profile header */}
        <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 20, padding: "32px", display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))", border: "2px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#00d4ff" }}>
            {initial}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>{displayName}</h1>
            {user?.email && <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 2px" }}>{user.email}</p>}
            {user?.phone && <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 2px" }}>{user.phone}</p>}
            {user?.city && <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>📍 {user.city}</p>}
          </div>
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
            <Link key={link.label} href={link.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 10, textDecoration: "none", borderBottom: i < QUICK_LINKS.length - 1 ? "1px solid #1e2d40" : "none", transition: "background 0.15s" }}
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
          <button onClick={handleSignOut} style={{ fontSize: 13, color: "#64748b", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
