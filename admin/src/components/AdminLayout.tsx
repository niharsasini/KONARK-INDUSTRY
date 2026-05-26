"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Mail, Wrench,
  Users, FileEdit, Settings, LogOut, Menu, X,
  Bell, ExternalLink, ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingBag, badge: 3 },
  { label: "Enquiries", href: "/enquiries", icon: Mail, badge: 8 },
  { label: "Services", href: "/services", icon: Wrench, badge: 12 },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Content", href: "/content", icon: FileEdit },
  { label: "Settings", href: "/settings", icon: Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/products/new": "Add Product",
  "/orders": "Orders",
  "/enquiries": "Enquiries",
  "/services": "Service Bookings",
  "/customers": "Customers",
  "/content": "Content Management",
  "/settings": "Settings",
};

const NOTIFICATIONS = [
  { id: 1, text: "New test ride booking from Rahul Panda, Bhubaneswar", time: "2 min ago", dot: "cyan" },
  { id: 2, text: "Service enquiry: AC Repair from Sunita Das, Cuttack", time: "18 min ago", dot: "orange" },
  { id: 3, text: "New product enquiry: LFP Battery from Pradeep Sahoo", time: "1 hr ago", dot: "purple" },
];

const DOT_COLORS: Record<string, string> = { cyan: "#00d4ff", orange: "#f97316", purple: "#a78bfa" };

const SIDEBAR_W = 260;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);

  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  const pageTitle = PAGE_TITLES[pathname] || "Admin";

  const unreadCount = NOTIFICATIONS.filter((n) => !readIds.includes(n.id)).length;

  const signOut = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/admin-login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : SIDEBAR_W,
        background: "#0f172a",
        borderRight: "1px solid #1e2d40",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0,
        zIndex: 50, transition: "width 0.2s ease", overflowX: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, gap: 8 }}>
          {!collapsed && (
            <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 13, height: 13 }}>
                  <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" fill="#00d4ff" />
                </svg>
              </div>
              <div style={{ lineHeight: 1, overflow: "hidden" }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>KONARK</span>
                <span style={{ display: "block", fontSize: 9, color: "#00d4ff", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Admin Panel</span>
              </div>
            </Link>
          )}
          <button onClick={() => setCollapsed((c) => !c)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, borderRadius: 6, flexShrink: 0, marginLeft: collapsed ? "auto" : 0, marginRight: collapsed ? "auto" : 0 }}>
            {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 6px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV.map(({ label, href, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} title={collapsed ? label : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: collapsed ? "10px 0" : "9px 12px",
                  borderRadius: 8, textDecoration: "none",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderLeft: active ? "3px solid #00d4ff" : "3px solid transparent",
                  background: active ? "rgba(0,212,255,0.06)" : "transparent",
                  color: active ? "#00d4ff" : "#94a3b8",
                  transition: "all 0.15s", fontSize: 13,
                  fontWeight: active ? 600 : 400, position: "relative",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
                {!collapsed && badge ? (
                  <span style={{ fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, background: active ? "#00d4ff" : "#1e2d40", color: active ? "#0a0f1e" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                    {badge}
                  </span>
                ) : null}
                {collapsed && badge ? (
                  <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#00d4ff" }} />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "10px 10px", borderTop: "1px solid #1e2d40" }}>
          {!collapsed && (
            <Link href="http://localhost:3000" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, textDecoration: "none", color: "#94a3b8", fontSize: 12, marginBottom: 4, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ExternalLink size={12} /> View Live Site
            </Link>
          )}
          {!collapsed && (
            <div style={{ padding: "8px 10px", marginBottom: 4 }}>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Logged in as</p>
              <p style={{ fontSize: 11, color: "#f1f5f9", margin: 0, fontWeight: 600 }}>admin@konarkindustry.com</p>
            </div>
          )}
          <button onClick={signOut}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: collapsed ? "8px 0" : "8px 10px", background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 500, borderRadius: 6, width: "100%", justifyContent: collapsed ? "center" : "flex-start", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={14} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ marginLeft: collapsed ? 64 : SIDEBAR_W, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left 0.2s ease", minWidth: 0 }}>
        {/* Top header */}
        <header style={{ height: 64, background: "#0f172a", borderBottom: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{pageTitle}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Bell */}
            <div style={{ position: "relative" }}>
              <button onClick={() => { setBellOpen((o) => !o); setReadIds(NOTIFICATIONS.map((n) => n.id)); }}
                style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", padding: 6, borderRadius: 8, transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, background: "#ef4444", borderRadius: "50%", fontSize: 10, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 340, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", overflow: "hidden", zIndex: 60 }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Notifications</p>
                    <button onClick={() => setBellOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={14} /></button>
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} style={{ padding: "14px 16px", borderBottom: "1px solid #1e2d4060", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: DOT_COLORS[n.dot], flexShrink: 0, marginTop: 4 }} />
                      <div>
                        <p style={{ fontSize: 12, color: "#f1f5f9", margin: "0 0 4px", lineHeight: 1.5 }}>{n.text}</p>
                        <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,212,255,0.12)", border: "2px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#00d4ff" }}>
                AD
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Admin</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, background: "#0a0f1e", minHeight: "calc(100vh - 64px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
