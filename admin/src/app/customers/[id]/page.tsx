"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCustomer, toggleCustomerStatus } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  confirmed: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  packed: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  shipped: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  delivered: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

type RecentOrder = {
  order_number: string;
  total_amount: number;
  order_status: string;
  created_at: string;
};

type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string | null;
  order_count: number;
  total_spent: number;
  recent_orders: RecentOrder[];
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchCustomer = useCallback(() => {
    setLoading(true);
    setError(null);
    getCustomer(id)
      .then((data) => setCustomer(data as CustomerDetail))
      .catch((err) => setError(err.message || "Failed to load customer"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  const handleToggle = async () => {
    if (!customer) return;
    setToggling(true);
    try {
      await toggleCustomerStatus(customer.id);
      setCustomer((c) => (c ? { ...c, is_active: !c.is_active } : c));
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error || !customer) return <div style={{ padding: "32px 40px" }}><ErrorState message={error || "Customer not found"} onRetry={fetchCustomer} /></div>;

  const initials = customer.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000 }}>
      <button onClick={() => router.push("/customers")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={14} /> Back to Customers
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#00d4ff" }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>{customer.name}</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{customer.email} · {customer.phone}</p>
          </div>
        </div>
        <button onClick={handleToggle} disabled={toggling}
          style={{
            background: customer.is_active ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
            border: `1px solid ${customer.is_active ? "#ef4444" : "#10b981"}`,
            color: customer.is_active ? "#ef4444" : "#10b981",
            padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            cursor: toggling ? "not-allowed" : "pointer",
          }}>
          {customer.is_active ? "Deactivate Account" : "Activate Account"}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Orders", value: customer.order_count },
          { label: "Total Spent", value: `₹${customer.total_spent.toLocaleString("en-IN")}` },
          { label: "City", value: customer.city || "—" },
          { label: "Status", value: customer.is_active ? "Active" : "Inactive" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: "18px 20px" }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Profile details */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Profile</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            ["Email", customer.email],
            ["Phone", customer.phone],
            ["City", customer.city || "—"],
            ["Verified", customer.is_verified ? "Yes" : "No"],
            ["Registered", new Date(customer.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
            ["Last Login", customer.last_login ? new Date(customer.last_login).toLocaleDateString("en-IN") : "Never"],
          ].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>{k}</p>
              <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order history */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Order History</h2>
        {customer.recent_orders.length === 0 ? (
          <p style={{ fontSize: 13, color: "#64748b" }}>No orders placed yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40" }}>
                {["Order #", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} style={{ padding: "8px 6px", textAlign: "left", fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customer.recent_orders.map((o) => (
                <tr key={o.order_number}
                  style={{ borderBottom: "1px solid #1e2d4060", cursor: "pointer" }}
                  onClick={() => router.push(`/orders/${o.order_number}`)}
                >
                  <td style={{ padding: "10px 6px", fontSize: 12, color: "#00d4ff", fontFamily: "monospace", fontWeight: 600 }}>{o.order_number}</td>
                  <td style={{ padding: "10px 6px", fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>₹{o.total_amount.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "10px 6px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[o.order_status]?.bg, color: STATUS_COLORS[o.order_status]?.color, textTransform: "capitalize" }}>{o.order_status}</span>
                  </td>
                  <td style={{ padding: "10px 6px", fontSize: 12, color: "#94a3b8" }}>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
