"use client";
import { useState } from "react";
import { X } from "lucide-react";

const STATUS_FLOW = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Confirmed: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  Packed: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  Shipped: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  Delivered: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

type Order = {
  id: string; customer: string; phone: string; city: string;
  products: string[]; total: string; status: string; date: string;
};

const INITIAL: Order[] = [
  { id: "ORD-001", customer: "Bikash Sahoo", phone: "81234 56789", city: "Rourkela", products: ["LFP Battery 48V 30Ah", "EV Charger 5A"], total: "₹28,500", status: "Delivered", date: "15 May 2026" },
  { id: "ORD-002", customer: "Ramesh Patra", phone: "94376 11129", city: "Bhubaneswar", products: ["Solar Panel 200W"], total: "₹12,000", status: "Shipped", date: "20 May 2026" },
  { id: "ORD-003", customer: "Manas Das", phone: "91234 56789", city: "Puri", products: ["Konark EV Max (Test Ride Deposit)"], total: "₹2,000", status: "Confirmed", date: "22 May 2026" },
  { id: "ORD-004", customer: "Sunita Behera", phone: "98765 43210", city: "Cuttack", products: ["Solar Panel 2kW Bundle"], total: "₹45,000", status: "Packed", date: "23 May 2026" },
  { id: "ORD-005", customer: "Anita Rath", phone: "63789 01234", city: "Sambalpur", products: ["Inverter 1500W", "LFP Battery 24V"], total: "₹18,750", status: "Pending", date: "25 May 2026" },
  { id: "ORD-006", customer: "Deepak Nayak", phone: "63210 98765", city: "Balasore", products: ["EV Charger 10A Fast"], total: "₹4,200", status: "Confirmed", date: "25 May 2026" },
  { id: "ORD-007", customer: "Kavita Pradhan", phone: "94567 89012", city: "Bhubaneswar", products: ["Konark Urban (Test Ride Deposit)"], total: "₹2,000", status: "Pending", date: "26 May 2026" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL);
  const [detailId, setDetailId] = useState<string | null>(null);

  const advanceStatus = (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx < STATUS_FLOW.length - 1)
      setOrders((os) => os.map((o) => o.id === id ? { ...o, status: STATUS_FLOW[idx + 1] } : o));
  };

  const detail = orders.find((o) => o.id === detailId);

  const statusCount = (s: string) => orders.filter((o) => o.status === s).length;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Orders</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{orders.length} total orders</p>
      </div>

      {/* Status summary */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {STATUS_FLOW.map((s) => (
          <div key={s} style={{ padding: "7px 14px", borderRadius: 100, background: STATUS_COLORS[s].bg, border: `1px solid ${STATUS_COLORS[s].color}30`, fontSize: 12, fontWeight: 700, color: STATUS_COLORS[s].color }}>
            {s}: {statusCount(s)}
          </div>
        ))}
      </div>

      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
              {["Order ID", "Customer", "Products", "Total", "Status", "Date", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #1e2d4060" }}>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#00d4ff", fontFamily: "monospace", fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: "14px 16px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>{o.customer}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{o.city}</p>
                </td>
                <td style={{ padding: "14px 16px", maxWidth: 200 }}>
                  {o.products.map((p, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 2px" }}>• {p}</p>
                  ))}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap" }}>{o.total}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: STATUS_COLORS[o.status]?.bg, color: STATUS_COLORS[o.status]?.color, whiteSpace: "nowrap" }}>{o.status}</span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{o.date}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setDetailId(o.id)}
                      style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>
                      View
                    </button>
                    {o.status !== "Delivered" && (
                      <button onClick={() => advanceStatus(o.id, o.status)}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "rgba(0,212,255,0.1)", color: "#00d4ff", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                        Advance →
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setDetailId(null)}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 18, padding: 32, width: "100%", maxWidth: 500 }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", margin: "0 0 6px" }}>{detail.id}</p>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>{detail.customer}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[detail.status]?.bg, color: STATUS_COLORS[detail.status]?.color }}>{detail.status}</span>
              </div>
              <button onClick={() => setDetailId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>

            {/* Status pipeline */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
              {STATUS_FLOW.map((s, i) => {
                const reached = STATUS_FLOW.indexOf(detail.status) >= i;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: reached ? "#00d4ff" : "#1e2d40", margin: "0 auto 4px" }} />
                      <p style={{ fontSize: 9, color: reached ? "#00d4ff" : "#475569", margin: 0, fontWeight: 600, letterSpacing: "0.04em" }}>{s}</p>
                    </div>
                    {i < STATUS_FLOW.length - 1 && <div style={{ flex: 1, height: 1, background: STATUS_FLOW.indexOf(detail.status) > i ? "#00d4ff" : "#1e2d40" }} />}
                  </div>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["Phone", detail.phone], ["City", detail.city], ["Order Date", detail.date], ["Total", detail.total]].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>{k}</p>
                  <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: "14px", background: "rgba(0,212,255,0.03)", border: "1px solid #1e2d40", borderRadius: 10, marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px", fontWeight: 600 }}>Products Ordered</p>
              {detail.products.map((p, i) => (
                <p key={i} style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 6px" }}>• {p}</p>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {detail.status !== "Delivered" && (
                <button onClick={() => { advanceStatus(detail.id, detail.status); setDetailId(null); }}
                  style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Advance to {STATUS_FLOW[STATUS_FLOW.indexOf(detail.status) + 1]} →
                </button>
              )}
              <button onClick={() => setDetailId(null)}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
