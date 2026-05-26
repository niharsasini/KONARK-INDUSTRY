"use client";
import Link from "next/link";
import { Package, Mail, ShoppingBag, Users, TrendingUp, Plus, ExternalLink, Download } from "lucide-react";

const STAT_CARDS = [
  { label: "Total Products", value: "19", trend: "+2 this month", icon: Package, color: "#00d4ff" },
  { label: "Pending Enquiries", value: "8", trend: "+3 today", icon: Mail, color: "#f97316" },
  { label: "Test Ride Bookings", value: "3", trend: "This week", icon: ShoppingBag, color: "#10b981" },
  { label: "Service Bookings", value: "12", trend: "+5 this month", icon: Users, color: "#7c3aed" },
];

const SAMPLE_ENQUIRIES = [
  { name: "Ramesh Patra", type: "Test Ride", phone: "94376 11129", date: "25 May", status: "New" },
  { name: "Sunita Behera", type: "Product Enquiry", phone: "98765 43210", date: "24 May", status: "In Progress" },
  { name: "Manas Das", type: "Service Booking", phone: "91234 56789", date: "23 May", status: "Done" },
  { name: "Priya Mohanty", type: "Test Ride", phone: "70123 45678", date: "22 May", status: "New" },
  { name: "Bikash Sahoo", type: "Product Enquiry", phone: "81234 56789", date: "21 May", status: "In Progress" },
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

const CHART_DATA = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 42 },
  { day: "Wed", value: 88 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 72 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 38 },
];

const MAX_VAL = Math.max(...CHART_DATA.map((d) => d.value));

function RevenueChart() {
  const H = 120;
  const W = 400;
  const BAR_W = 34;
  const GAP = (W - CHART_DATA.length * BAR_W) / (CHART_DATA.length + 1);

  return (
    <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Enquiries This Week</h2>
        <span style={{ fontSize: 11, color: "#94a3b8", background: "#0f172a", padding: "4px 10px", borderRadius: 100, border: "1px solid #1e2d40" }}>Last 7 days</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: "100%", height: "auto" }}>
        {CHART_DATA.map((d, i) => {
          const barH = (d.value / MAX_VAL) * H;
          const x = GAP + i * (BAR_W + GAP);
          const y = H - barH;
          return (
            <g key={d.day}>
              <rect x={x} y={y} width={BAR_W} height={barH} rx={4} fill="rgba(0,212,255,0.15)" />
              <rect x={x} y={y} width={BAR_W} height={4} rx={2} fill="#00d4ff" />
              <text x={x + BAR_W / 2} y={H + 18} textAnchor="middle" fill="#64748b" fontSize={10}>{d.day}</text>
              <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle" fill="#94a3b8" fontSize={9}>{d.value}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Good morning, Admin 👋</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Here's what's happening at Konark Industry today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        {STAT_CARDS.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</p>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color={color} />
              </div>
            </div>
            <p style={{ fontSize: 34, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={11} color="#10b981" />
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 28 }}>
        <RevenueChart />
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, primary, disabled, external }) => (
              <Link key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, textDecoration: "none", background: primary ? "#00d4ff" : "transparent", border: primary ? "none" : "1px solid #1e2d40", color: primary ? "#0a0f1e" : disabled ? "#475569" : "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s", pointerEvents: disabled ? "none" : "auto" }}
                onMouseEnter={(e) => { if (!disabled && !primary) e.currentTarget.style.borderColor = "#00d4ff"; }}
                onMouseLeave={(e) => { if (!disabled && !primary) e.currentTarget.style.borderColor = "#1e2d40"; }}
              >
                <Icon size={14} /> {label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "14px", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#00d4ff", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Catalog</p>
            {[{ label: "EV Vehicles", count: 4 }, { label: "Products", count: 14 }, { label: "Services", count: 1 }].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1e2d4050", fontSize: 12 }}>
                <span style={{ color: "#94a3b8" }}>{s.label}</span>
                <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent enquiries */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Recent Enquiries</h2>
          <Link href="/enquiries" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2d40" }}>
              {["Name", "Type", "Phone", "Date", "Status"].map((h) => (
                <th key={h} style={{ padding: "0 12px 12px 0", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ENQUIRIES.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1e2d4060" }}>
                <td style={{ padding: "13px 12px 13px 0", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{row.name}</td>
                <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: "#94a3b8" }}>{row.type}</td>
                <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: "#94a3b8" }}>{row.phone}</td>
                <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                <td style={{ padding: "13px 0" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[row.status]?.bg, color: STATUS_COLORS[row.status]?.color }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
