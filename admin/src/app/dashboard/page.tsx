"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Mail, ShoppingBag, Users, TrendingUp, Plus, ExternalLink, Download, IndianRupee, Battery, Wrench } from "lucide-react";
import { getStats, exportOrders } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "rgba(255,112,67,0.1)", color: "var(--orange)" },
  confirmed: { bg: "rgba(13,81,140,0.1)", color: "var(--navy)" },
  packed: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  shipped: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  delivered: { bg: "rgba(52,199,138,0.1)", color: "var(--green)" },
  cancelled: { bg: "rgba(255,112,67,0.1)", color: "var(--orange)" },
  New: { bg: "rgba(13,81,140,0.1)", color: "var(--navy)" },
  Contacted: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  "In Progress": { bg: "rgba(255,112,67,0.1)", color: "var(--orange)" },
  Resolved: { bg: "rgba(52,199,138,0.1)", color: "var(--green)" },
};

type RecentOrder = { order_number: string; customer_name: string; total_amount: number; order_status: string; created_at: string };
type RecentEnquiry = { id: string; name: string; enquiry_type: string; phone: string; status: string; created_at: string };

type DashboardStats = {
  total_products: number;
  total_customers: number;
  pending_enquiries: number;
  unread_enquiries: number;
  pending_orders: number;
  confirmed_orders: number;
  total_orders: number;
  today_orders: number;
  month_orders: number;
  service_bookings_today: number;
  total_service_bookings: number;
  pending_service_bookings: number;
  revenue_this_month: number;
  revenue_today: number;
  revenue_total: number;
  new_customers_today: number;
  new_customers_month: number;
  total_battery_swaps: number;
  pending_battery_swaps: number;
  unread_notifications: number;
  recent_orders: RecentOrder[];
  recent_enquiries: RecentEnquiry[];
};

const QUICK_ACTIONS = [
  { label: "View Orders", href: "/orders", icon: ShoppingBag, primary: true },
  { label: "View Enquiries", href: "/enquiries", icon: Mail, primary: false },
  { label: "Add New Product", href: "/products/new", icon: Plus, primary: false },
  { label: "View Battery Swaps", href: "/battery-swap", icon: Battery, primary: false },
  { label: "Go to Live Site", href: "http://localhost:3000", icon: ExternalLink, primary: false, external: true },
];

function fmtCurrency(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStats();
      setStats(data as DashboardStats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="dashboard" /></div>;
  if (error || !stats) return <div style={{ padding: "32px 40px" }}><ErrorState message={error || "No data"} onRetry={fetchData} /></div>;

  const revenueCards = [
    { label: "Today's Revenue", value: fmtCurrency(stats.revenue_today), icon: IndianRupee, color: "var(--green)" },
    { label: "This Month's Revenue", value: fmtCurrency(stats.revenue_this_month), icon: TrendingUp, color: "var(--navy)" },
    { label: "Total Revenue", value: fmtCurrency(stats.revenue_total), icon: IndianRupee, color: "#7c3aed" },
    { label: "Avg Order Value", value: fmtCurrency(stats.total_orders > 0 ? stats.revenue_total / stats.total_orders : 0), icon: TrendingUp, color: "var(--orange)" },
  ];

  const orderCards = [
    { label: "Total Orders", value: stats.total_orders, icon: ShoppingBag, color: "var(--navy)" },
    { label: "Pending Orders", value: stats.pending_orders, icon: ShoppingBag, color: "var(--orange)" },
    { label: "Today's Orders", value: stats.today_orders, icon: ShoppingBag, color: "var(--green)" },
    { label: "This Month's Orders", value: stats.month_orders, icon: ShoppingBag, color: "#7c3aed" },
  ];

  const otherCards = [
    { label: "Total Customers", value: stats.total_customers, icon: Users, color: "var(--navy)" },
    { label: "New Customers Today", value: stats.new_customers_today, icon: Users, color: "var(--green)" },
    { label: "Pending Enquiries", value: stats.pending_enquiries, icon: Mail, color: "var(--orange)" },
    { label: "Pending Services", value: stats.pending_service_bookings, icon: Wrench, color: "#7c3aed" },
  ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>Good morning, Admin</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Here's what's happening at Konark Industry today.</p>
        </div>
        <button onClick={() => exportOrders()}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <Download size={13} /> Export Orders CSV
        </button>
      </div>

      {/* Row 1: Revenue */}
      <CardRow cards={revenueCards} />
      {/* Row 2: Orders */}
      <CardRow cards={orderCards} />
      {/* Row 3: Other */}
      <CardRow cards={otherCards} />

      {/* Quick actions */}
      <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: "24px", marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, primary, external }) => (
            <Link key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 14px", borderRadius: 10, textDecoration: "none", background: primary ? "var(--navy)" : "transparent", border: primary ? "none" : "1px solid rgba(92,103,149,0.2)", color: primary ? "var(--text-heading)" : "var(--text-heading)", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "center" }}
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity: orders + enquiries */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>Recent Orders</h2>
            <Link href="/orders" style={{ fontSize: 12, color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
          </div>
          {stats.recent_orders.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>No orders yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(92,103,149,0.2)" }}>
                  {["Order #", "Customer", "Amount", "Status"].map((h) => (
                    <th key={h} style={{ padding: "0 10px 10px 0", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((o) => (
                  <tr key={o.order_number} style={{ borderBottom: "1px solid rgba(92,103,149,0.2)", cursor: "pointer" }} onClick={() => router.push(`/orders/${o.order_number}`)}>
                    <td style={{ padding: "11px 10px 11px 0", fontSize: 12, color: "var(--navy)", fontFamily: "monospace", fontWeight: 600 }}>{o.order_number}</td>
                    <td style={{ padding: "11px 10px 11px 0", fontSize: 13, color: "var(--text-heading)" }}>{o.customer_name}</td>
                    <td style={{ padding: "11px 10px 11px 0", fontSize: 13, color: "var(--text-heading)", fontWeight: 700 }}>{fmtCurrency(o.total_amount)}</td>
                    <td style={{ padding: "11px 0" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: STATUS_COLORS[o.order_status]?.bg ?? "rgba(13,81,140,0.1)", color: STATUS_COLORS[o.order_status]?.color ?? "var(--navy)", textTransform: "capitalize" }}>{o.order_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>Recent Enquiries</h2>
            <Link href="/enquiries" style={{ fontSize: 12, color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
          </div>
          {stats.recent_enquiries.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>No enquiries yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {stats.recent_enquiries.map((e) => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--bg-surface)", borderRadius: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)", margin: "0 0 2px" }}>{e.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{e.enquiry_type?.replace(/_/g, " ")}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: STATUS_COLORS[e.status]?.bg ?? "rgba(13,81,140,0.1)", color: STATUS_COLORS[e.status]?.color ?? "var(--navy)" }}>{e.status ?? "New"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardRow({ cards }: { cards: { label: string; value: string | number; icon: typeof Package; color: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 18 }}>
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</p>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={15} color={color} />
            </div>
          </div>
          <p style={{ fontSize: 28, fontWeight: 800, color: "var(--text-heading)", margin: 0, lineHeight: 1 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}
