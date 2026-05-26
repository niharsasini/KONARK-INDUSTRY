"use client";
import Link from "next/link";
import { Package, Mail, ShoppingBag, Users, TrendingUp, Plus, ExternalLink, Download } from "lucide-react";

const STAT_CARDS = [
  { label: "Total Products", value: "19", trend: "+2 this month", icon: Package, color: "#00d4ff" },
  { label: "Pending Enquiries", value: "0", trend: "Ready for real data", icon: Mail, color: "#f97316" },
  { label: "Orders This Month", value: "0", trend: "Ready for real data", icon: ShoppingBag, color: "#10b981" },
  { label: "New Customers", value: "0", trend: "Ready for real data", icon: Users, color: "#7c3aed" },
];

const SAMPLE_ENQUIRIES = [
  { name: "Ramesh Patra", type: "Test Ride", phone: "94376 11129", date: "25 May 2026", status: "New" },
  { name: "Sunita Behera", type: "Product Enquiry", phone: "98765 43210", date: "24 May 2026", status: "In Progress" },
  { name: "Manas Das", type: "Service Booking", phone: "91234 56789", date: "23 May 2026", status: "Done" },
  { name: "Priya Mohanty", type: "Test Ride", phone: "70123 45678", date: "22 May 2026", status: "New" },
  { name: "Bikash Sahoo", type: "Product Enquiry", phone: "81234 56789", date: "21 May 2026", status: "In Progress" },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  "In Progress": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Done: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const QUICK_ACTIONS = [
  { label: "Add New Product", href: "/products/new", icon: Plus, primary: true },
  { label: "View All Enquiries", href: "/enquiries", icon: Mail, primary: false },
  { label: "Export Orders CSV", href: "#", icon: Download, primary: false, disabled: true },
  { label: "Go to Live Site", href: "http://localhost:3000", icon: ExternalLink, primary: false, external: true },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Welcome back, Admin · Konark Industry Panel</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
        {STAT_CARDS.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</p>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <p style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={12} color="#10b981" />
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-col: enquiries + quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28 }}>
        {/* Recent Enquiries table */}
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Recent Enquiries</h2>
            <Link href="/enquiries" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2d40" }}>
                  {["Name", "Type", "Phone", "Date", "Status"].map((h) => (
                    <th key={h} style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px 12px 0", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ENQUIRIES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e2d4060" }}>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{row.name}</td>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: "#94a3b8" }}>{row.type}</td>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: "#94a3b8" }}>{row.phone}</td>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                    <td style={{ padding: "14px 0 14px 0" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[row.status]?.bg, color: STATUS_COLORS[row.status]?.color }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 20px" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, primary, disabled, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", borderRadius: 10, textDecoration: "none",
                  background: primary ? "#00d4ff" : "transparent",
                  border: primary ? "none" : "1px solid #1e2d40",
                  color: primary ? "#0a0f1e" : disabled ? "#475569" : "#f1f5f9",
                  fontSize: 13, fontWeight: 600,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                  transition: "all 0.15s",
                  pointerEvents: disabled ? "none" : "auto",
                }}
                onMouseEnter={(e) => { if (!disabled && !primary) e.currentTarget.style.borderColor = "#00d4ff"; }}
                onMouseLeave={(e) => { if (!disabled && !primary) e.currentTarget.style.borderColor = "#1e2d40"; }}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: "16px", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 10 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#00d4ff", margin: "0 0 8px" }}>Catalog Summary</p>
            {[{ label: "EV Vehicles", count: 4 }, { label: "Products", count: 14 }, { label: "Services", count: 1 }].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1e2d4050", fontSize: 12 }}>
                <span style={{ color: "#94a3b8" }}>{s.label}</span>
                <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
