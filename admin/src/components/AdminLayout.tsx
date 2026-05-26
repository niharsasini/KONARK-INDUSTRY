"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Mail,
  Wrench,
  Users,
  FileEdit,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Enquiries", href: "/enquiries", icon: Mail },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Content", href: "/content", icon: FileEdit },
  { label: "Settings", href: "/settings", icon: Settings },
];

const SIDEBAR_W = 260;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : SIDEBAR_W,
        background: "#0f172a",
        borderRight: "1px solid #1e2d40",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transition: "width 0.2s ease",
        overflowX: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 72 }}>
          {!collapsed && (
            <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" fill="#00d4ff" />
                </svg>
              </div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.05em" }}>KONARK</span>
                <span style={{ display: "block", fontSize: 9, color: "#00d4ff", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin Panel</span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, borderRadius: 6, flexShrink: 0, marginLeft: collapsed ? "auto" : 0, marginRight: collapsed ? "auto" : 0 }}
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "10px 0" : "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderLeft: active ? "3px solid #00d4ff" : "3px solid transparent",
                  background: active ? "rgba(0,212,255,0.06)" : "transparent",
                  color: active ? "#00d4ff" : "#94a3b8",
                  transition: "all 0.15s",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user info */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e2d40" }}>
          {!collapsed && (
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Logged in as</p>
              <p style={{ fontSize: 12, color: "#f1f5f9", margin: 0, fontWeight: 600 }}>admin@konarkindustry.com</p>
            </div>
          )}
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: collapsed ? "8px 0" : "8px 10px",
            background: "transparent", border: "none",
            cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 500,
            borderRadius: 6, width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={14} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: collapsed ? 64 : SIDEBAR_W,
        flex: 1,
        minHeight: "100vh",
        transition: "margin-left 0.2s ease",
        background: "#0a0f1e",
      }}>
        {children}
      </main>
    </div>
  );
}
