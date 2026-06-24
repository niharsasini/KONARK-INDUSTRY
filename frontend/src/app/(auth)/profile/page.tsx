"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, getMyOrders, logoutUser } from "@/lib/api";
import { useWishlistStore } from "@/store";
import Breadcrumb from "@/components/ui/Breadcrumb";

const QUICK_LINKS = [
  { icon: "📦", label: "My Orders", href: "/orders", desc: "Track and manage your orders" },
  { icon: "🔧", label: "Service Requests", href: "/services/enquiry", desc: "View your service bookings" },
  { icon: "📋", label: "Book a Service", href: "/services/enquiry", desc: "Schedule a technician visit" },
  { icon: "🛒", label: "My Cart", href: "/cart", desc: "View items in your cart" },
];

function Skeleton() {
  return (
    <div>
      <div className="skeleton" style={{ borderRadius: 20, height: 120, marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ borderRadius: 14, height: 80 }} />)}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const syncWishlist = useWishlistStore((s) => s.syncFromBackend);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("konark_token") : null;
    if (!token) { router.replace("/login"); return; }

    syncWishlist();

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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Profile" }]} />

        {/* Profile header */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "32px", display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", flexShrink: 0, background: "var(--grad-navy)", border: "2px solid rgba(15,76,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#ffffff" }}>
            {initial}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>{displayName}</h1>
            {user?.email && <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 2px" }}>{user.email}</p>}
            {user?.phone && <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: "0 0 2px" }}>{user.phone}</p>}
            {user?.city && <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>📍 {user.city}</p>}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 14, padding: "20px 16px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "var(--navy)", margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16, padding: "8px", boxShadow: "var(--shadow-sm)" }}>
          {QUICK_LINKS.map((link, i) => (
            <Link key={link.label} href={link.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 10, textDecoration: "none", borderBottom: i < QUICK_LINKS.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-section)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 20, width: 36, textAlign: "center" }}>{link.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>{link.label}</p>
                <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>{link.desc}</p>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, color: "var(--text-subtle)" }}>
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" />
              </svg>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button onClick={handleSignOut} style={{ fontSize: 13, color: "var(--text-subtle)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
