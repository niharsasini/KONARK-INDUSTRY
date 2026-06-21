"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getOrders, updateOrderStatus, exportOrders } from "@/lib/adminApi";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

const STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  confirmed: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  packed: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  shipped: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  delivered: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

type OrderItem = { name: string; qty: number; price: number; category: string };

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  items: OrderItem[];
  total_amount: number;
  city: string;
  order_status: string;
  payment_method: string;
  created_at: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Debounce search input -> search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    const filters: Record<string, string> = {
      skip: String((page - 1) * LIMIT),
      limit: String(LIMIT),
    };
    if (statusFilter !== "all") filters.order_status = statusFilter;
    if (search) filters.search = search;
    getOrders(filters)
      .then(({ items, total }) => {
        setOrders(Array.isArray(items) ? (items as Order[]) : []);
        setTotal(total);
      })
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const showToast = (text: string, ok: boolean) => {
    setToastMsg({ text, ok });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStatusUpdate = async (orderNumber: string, status: string) => {
    setUpdatingId(orderNumber);
    try {
      await updateOrderStatus(orderNumber, status);
      setOrders((prev) =>
        prev.map((o) => (o.order_number === orderNumber ? { ...o, order_status: status } : o))
      );
      showToast("Order status updated", true);
    } catch {
      showToast("Failed to update status", false);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCount = (s: string) => orders.filter((o) => o.order_status === s).length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const INPUT: React.CSSProperties = {
    background: "#0a0f1e",
    border: "1px solid #1e2d40",
    borderRadius: 8,
    padding: "9px 14px",
    color: "#f1f5f9",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Orders</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{total} total orders</p>
        </div>
        <button
          onClick={() => exportOrders()}
          style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          Export CSV
        </button>
      </div>

      {toastMsg && (
        <div
          style={{
            padding: "10px 16px",
            marginBottom: 16,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            background: toastMsg.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            color: toastMsg.ok ? "#10b981" : "#ef4444",
            border: `1px solid ${toastMsg.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          {toastMsg.text}
        </div>
      )}

      {/* Stats row (counts within current page only) */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "#111827", border: "1px solid #1e2d40", fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>
          Total: {total}
        </div>
        {STATUSES.map((s) => (
          <div key={s} style={{ padding: "7px 14px", borderRadius: 100, background: STATUS_COLORS[s].bg, border: `1px solid ${STATUS_COLORS[s].color}30`, fontSize: 12, fontWeight: 700, color: STATUS_COLORS[s].color, textTransform: "capitalize" }}>
            {s}: {statusCount(s)} (this page)
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search order #, customer, phone..."
          style={{ ...INPUT, flex: 1, minWidth: 240 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...INPUT, cursor: "pointer" }}>
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} style={{ textTransform: "capitalize" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: 44, background: "#0f172a", borderRadius: 8, marginBottom: 10, opacity: 1 - i * 0.12 }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchOrders} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#64748b" }}>No orders found</p>
        </div>
      ) : (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
                {["Order #", "Customer", "Phone", "Items", "Amount", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_number} style={{ borderBottom: "1px solid #1e2d4060" }}>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#00d4ff", fontFamily: "monospace", fontWeight: 600 }}>{o.order_number}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>{o.customer_name}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{o.city}</p>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{o.customer_phone}</td>
                  <td style={{ padding: "14px 16px", maxWidth: 220 }}>
                    {(o.items || []).slice(0, 2).map((it, i) => (
                      <p key={i} style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 2px" }}>
                        • {it.name} x{it.qty}
                      </p>
                    ))}
                    {(o.items || []).length > 2 && <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>+{o.items.length - 2} more</p>}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap" }}>
                    ₹{o.total_amount?.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <select
                      value={o.order_status}
                      disabled={updatingId === o.order_number}
                      onChange={(e) => handleStatusUpdate(o.order_number, e.target.value)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 100,
                        background: STATUS_COLORS[o.order_status]?.bg,
                        color: STATUS_COLORS[o.order_status]?.color,
                        border: `1px solid ${STATUS_COLORS[o.order_status]?.color}30`,
                        textTransform: "capitalize",
                        cursor: "pointer",
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => router.push(`/orders/${o.order_number}`)}
                      style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer", fontWeight: 500 }}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />
    </div>
  );
}
