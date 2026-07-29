"use client";
import { useState, useEffect } from "react";
import { getDailyAnalytics, getTopProducts, getRevenueAnalytics, getStats, getOrdersByStatus, getEnquiriesByType, exportOrders } from "@/lib/adminApi";

type DailyPoint = { date: string; enquiries: number; orders: number };
type TopProduct = { product_id: string; name: string; total_qty: number; total_revenue: number };
type RevenuePoint = { month: string; month_label: string; revenue: number; order_count: number };
type Stats = { total_customers: number; total_orders: number };
type StatusCount = { status: string; count: number };
type TypeCount = { type: string; count: number };

const RANGE_OPTIONS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--orange)",
  confirmed: "var(--navy)",
  packed: "#a78bfa",
  shipped: "#60a5fa",
  delivered: "var(--green)",
  cancelled: "var(--red)",
};

export default function ReportsPage() {
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [ordersByStatus, setOrdersByStatus] = useState<StatusCount[]>([]);
  const [enquiriesByType, setEnquiriesByType] = useState<TypeCount[]>([]);
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getDailyAnalytics(),
      getTopProducts(),
      getRevenueAnalytics(),
      getStats(),
      getOrdersByStatus(),
      getEnquiriesByType(),
    ])
      .then(([d, t, r, s, obs, ebt]) => {
        setDaily((d as DailyPoint[]) || []);
        setTopProducts((t as TopProduct[]) || []);
        setRevenue((r as RevenuePoint[]) || []);
        setStats(s as Stats);
        setOrdersByStatus((obs as StatusCount[]) || []);
        setEnquiriesByType((ebt as TypeCount[]) || []);
      })
      .catch((err) => setError(err.message || "Failed to load reports"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxRevenue = Math.max(1, ...revenue.map((r) => r.revenue));
  const dailyInRange = daily.slice(-rangeDays);
  const enquiriesThisRange = dailyInRange.reduce((s, d) => s + d.enquiries, 0);
  const ordersThisRange = dailyInRange.reduce((s, d) => s + d.orders, 0);
  const currentMonth = revenue[revenue.length - 1];
  const previousMonth = revenue[revenue.length - 2];
  const avgOrderValue = currentMonth && currentMonth.order_count > 0 ? currentMonth.revenue / currentMonth.order_count : 0;
  const momDelta = previousMonth && previousMonth.revenue > 0
    ? ((currentMonth?.revenue ?? 0) - previousMonth.revenue) / previousMonth.revenue * 100
    : null;

  const maxStatusCount = Math.max(1, ...ordersByStatus.map((s) => s.count));
  const maxTypeCount = Math.max(1, ...enquiriesByType.map((t) => t.count));

  const exportReportCsv = () => {
    const lines = [
      "Metric,Value",
      `Revenue This Month,${currentMonth?.revenue ?? 0}`,
      `Orders This Month,${currentMonth?.order_count ?? 0}`,
      `Total Customers,${stats?.total_customers ?? 0}`,
      `Avg Order Value,${avgOrderValue.toFixed(0)}`,
      "",
      "Order Status,Count",
      ...ordersByStatus.map((s) => `${s.status},${s.count}`),
      "",
      "Enquiry Type,Count",
      ...enquiriesByType.map((t) => `${t.type},${t.count}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "konark-report.csv";
    a.click();
  };

  if (loading) {
    return (
      <div style={{ padding: "32px 40px" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 80, background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, marginBottom: 16, opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px 40px" }}>
        <div style={{ background: "rgba(255,92,92,0.06)", border: "1px solid rgba(255,92,92,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--red)", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchAll} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "var(--navy)", color: "var(--text-heading)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1300 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Reports &amp; Analytics</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={rangeDays} onChange={(e) => setRangeDays(Number(e.target.value))}
            style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.2)", background: "var(--bg-card)", color: "var(--text-heading)", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none" }}>
            {RANGE_OPTIONS.map((r) => <option key={r.days} value={r.days}>{r.label}</option>)}
          </select>
          <button onClick={exportReportCsv} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Export Report CSV
          </button>
          <button onClick={() => exportOrders()} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Export Orders CSV
          </button>
        </div>
      </div>

      {/* Revenue chart */}
      <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>Monthly Revenue (last {revenue.length} months)</h3>
          {momDelta !== null && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: momDelta >= 0 ? "rgba(52,199,138,0.1)" : "rgba(255,92,92,0.1)", color: momDelta >= 0 ? "var(--green)" : "var(--red)" }}>
              {momDelta >= 0 ? "▲" : "▼"} {Math.abs(momDelta).toFixed(1)}% vs last month
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180 }}>
          {revenue.map((r) => (
            <div key={r.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{r.revenue > 0 ? `₹${(r.revenue / 1000).toFixed(0)}k` : ""}</span>
              <div
                title={`${r.month_label}: ₹${r.revenue.toLocaleString("en-IN")}`}
                style={{
                  width: "100%", maxWidth: 36, borderRadius: "4px 4px 0 0",
                  background: "linear-gradient(180deg, var(--navy), var(--navy-dark))",
                  height: `${Math.max(2, (r.revenue / maxRevenue) * 130)}px`,
                }}
              />
              <span style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{r.month_label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Orders by status + Enquiries by type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }} className="reports-grid">
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px" }}>Orders by Status</h3>
          {ordersByStatus.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No order data yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ordersByStatus.map((s) => (
                <div key={s.status} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", width: 80, textTransform: "capitalize", flexShrink: 0 }}>{s.status}</span>
                  <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: 6, height: 18, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(s.count / maxStatusCount) * 100}%`, background: STATUS_COLORS[s.status] ?? "var(--navy)", borderRadius: 6, minWidth: s.count > 0 ? 4 : 0 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", width: 28, textAlign: "right", flexShrink: 0 }}>{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px" }}>Enquiries by Type</h3>
          {enquiriesByType.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No enquiry data yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {enquiriesByType.map((t) => (
                <div key={t.type} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", width: 100, textTransform: "capitalize", flexShrink: 0 }}>{t.type.replace(/_/g, " ")}</span>
                  <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: 6, height: 18, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(t.count / maxTypeCount) * 100}%`, background: "#7c3aed", borderRadius: 6, minWidth: t.count > 0 ? 4 : 0 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", width: 28, textAlign: "right", flexShrink: 0 }}>{t.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two columns: top products + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 24 }} className="reports-grid">
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px" }}>Top Products by Orders</h3>
          {topProducts.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No order data yet</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(92,103,149,0.2)" }}>
                  {["Product", "Orders", "Revenue"].map((h) => (
                    <th key={h} style={{ padding: "8px 6px", textAlign: h === "Product" ? "left" : "right", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.product_id} style={{ borderBottom: "1px solid rgba(92,103,149,0.08)" }}>
                    <td style={{ padding: "10px 6px", fontSize: 13, color: "var(--text-heading)" }}>{p.name}</td>
                    <td style={{ padding: "10px 6px", fontSize: 13, color: "var(--text-muted)", textAlign: "right" }}>{p.total_qty}</td>
                    <td style={{ padding: "10px 6px", fontSize: 13, color: "var(--navy)", textAlign: "right", fontWeight: 600 }}>₹{p.total_revenue.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px" }}>Activity ({RANGE_OPTIONS.find((r) => r.days === rangeDays)?.label.toLowerCase()})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Enquiries", value: enquiriesThisRange, color: "var(--navy)" },
              { label: "Orders Placed", value: ordersThisRange, color: "var(--green)" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{row.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: row.color, background: `${row.color}15`, padding: "2px 12px", borderRadius: 100 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="reports-stats">
        {[
          { label: "Revenue This Month", value: `₹${(currentMonth?.revenue || 0).toLocaleString("en-IN")}` },
          { label: "Orders This Month", value: currentMonth?.order_count ?? 0 },
          { label: "Total Customers", value: stats?.total_customers ?? 0 },
          { label: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: "18px 20px" }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reports-grid { grid-template-columns: 1fr !important; }
          .reports-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
