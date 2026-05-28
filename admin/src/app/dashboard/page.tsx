"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Package, Mail, ShoppingBag, Users, TrendingUp, Plus, ExternalLink, Download } from "lucide-react";
import { getStats, getRecentActivity, getNotifications } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  "In Progress": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Done: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  Contacted: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  Resolved: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const QUICK_ACTIONS = [
  { label: "Add New Product", href: "/products/new", icon: Plus, primary: true },
  { label: "View All Enquiries", href: "/enquiries", icon: Mail, primary: false },
  { label: "Export Orders CSV", href: "#", icon: Download, primary: false, disabled: true },
  { label: "Go to Live Site", href: "http://localhost:3000", icon: ExternalLink, primary: false, external: true },
];

function RevenueChart({ data }: { data: { day: string; value: number }[] }) {
  const H = 120;
  const W = 400;
  const BAR_W = 34;
  const MAX_VAL = Math.max(...data.map((d) => d.value), 1);
  const GAP = (W - data.length * BAR_W) / (data.length + 1);

  return (
    <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Enquiries This Week</h2>
        <span style={{ fontSize: 11, color: "#94a3b8", background: "#0f172a", padding: "4px 10px", borderRadius: 100, border: "1px solid #1e2d40" }}>Last 7 days</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: "100%", height: "auto" }}>
        {data.map((d, i) => {
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
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [activity, setActivity] = useState<unknown[]>([]);
  const [chartData, setChartData] = useState<{ day: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, activityRes] = await Promise.all([
        getStats(),
        getRecentActivity(),
      ]);
      setStats(statsRes as Record<string, unknown>);
      const actArr = Array.isArray(activityRes) ? activityRes : (activityRes as Record<string, unknown[]>).enquiries ?? [];
      setActivity(actArr.slice(0, 5) as unknown[]);
      const chart = (activityRes as Record<string, unknown>).weekly_chart;
      if (Array.isArray(chart)) setChartData(chart as { day: string; value: number }[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="dashboard" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchData} /></div>;

  const statCards = [
    { label: "Total Products", value: String((stats as Record<string, unknown>)?.total_products ?? "—"), trend: "In catalogue", icon: Package, color: "#00d4ff" },
    { label: "Pending Enquiries", value: String((stats as Record<string, unknown>)?.pending_enquiries ?? "—"), trend: "Awaiting response", icon: Mail, color: "#f97316" },
    { label: "Test Ride Bookings", value: String((stats as Record<string, unknown>)?.test_ride_bookings ?? "—"), trend: "This week", icon: ShoppingBag, color: "#10b981" },
    { label: "Service Bookings", value: String((stats as Record<string, unknown>)?.service_bookings ?? "—"), trend: "This month", icon: Users, color: "#7c3aed" },
  ];

  const fallbackChart = chartData.length > 0
    ? chartData
    : [
        { day: "Mon", value: 0 }, { day: "Tue", value: 0 }, { day: "Wed", value: 0 },
        { day: "Thu", value: 0 }, { day: "Fri", value: 0 }, { day: "Sat", value: 0 }, { day: "Sun", value: 0 },
      ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Good morning, Admin</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Here's what's happening at Konark Industry today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        {statCards.map(({ label, value, trend, icon: Icon, color }) => (
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
        <RevenueChart data={fallbackChart} />
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
        </div>
      </div>

      {/* Recent enquiries */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Recent Enquiries</h2>
          <Link href="/enquiries" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
        </div>

        {activity.length === 0 ? (
          <p style={{ fontSize: 13, color: "#475569", textAlign: "center", padding: "24px 0" }}>No enquiries yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40" }}>
                {["Name", "Type", "Phone", "Date", "Status"].map((h) => (
                  <th key={h} style={{ padding: "0 12px 12px 0", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(activity as Record<string, string>[]).map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1e2d4060" }}>
                  <td style={{ padding: "13px 12px 13px 0", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{row.name}</td>
                  <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: "#94a3b8" }}>{row.enquiry_type ?? row.type}</td>
                  <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: "#94a3b8" }}>{row.phone}</td>
                  <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN") : row.date}</td>
                  <td style={{ padding: "13px 0" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[row.status]?.bg ?? "rgba(0,212,255,0.1)", color: STATUS_COLORS[row.status]?.color ?? "#00d4ff" }}>{row.status ?? "New"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
