"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { getOrder, updateOrderStatus, cancelOrder } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";

const STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  confirmed: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  packed: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  shipped: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  delivered: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

type OrderItem = { name: string; qty: number; price: number; category?: string };

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  gst_amount: number;
  total_amount: number;
  delivery_address: string;
  city: string;
  pincode: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
};

function printInvoice(order: Order) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${order.order_number}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
        .header { display: flex; justify-content: space-between; }
        .company { font-size: 24px; font-weight: bold; }
        .invoice-no { color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f0f0f0; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; }
        .footer { margin-top: 40px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="company">KONARK INDUSTRY</div>
          <div>Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002</div>
          <div>+91 94376 11129</div>
          <div>konarkindustrie@gmail.com</div>
        </div>
        <div style="text-align:right">
          <div class="invoice-no">INVOICE #${order.order_number}</div>
          <div>Date: ${new Date(order.created_at).toLocaleDateString("en-IN")}</div>
        </div>
      </div>
      <hr/>
      <div>
        <strong>Bill To:</strong><br/>
        ${order.customer_name}<br/>
        ${order.customer_phone}<br/>
        ${order.customer_email || ""}<br/>
        ${order.delivery_address}, ${order.city} ${order.pincode}
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || [])
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>₹${item.price?.toLocaleString("en-IN")}</td>
              <td>₹${(item.qty * item.price)?.toLocaleString("en-IN")}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="text-align:right">
        <div>Subtotal: ₹${order.subtotal?.toLocaleString("en-IN") || 0}</div>
        <div>Delivery: ₹${order.delivery_charge?.toLocaleString("en-IN") || 0}</div>
        <div>GST: ₹${order.gst_amount?.toLocaleString("en-IN") || 0}</div>
        <div class="total">Total: ₹${order.total_amount?.toLocaleString("en-IN") || 0}</div>
        <div>Payment: ${order.payment_method?.toUpperCase() || "COD"} (${order.payment_status})</div>
      </div>
      <div class="footer">
        Thank you for your business! This is a computer generated invoice.
      </div>
    </body>
    </html>
  `;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const fetchOrder = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrder(orderNumber)
      .then((data) => setOrder(data as Order))
      .catch((err) => setError(err.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const showToast = (text: string, ok: boolean) => {
    setToastMsg({ text, ok });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.order_number, status);
      setOrder((o) => (o ? { ...o, order_status: status } : o));
      showToast("Order status updated", true);
    } catch {
      showToast("Failed to update status", false);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!order || !confirm("Cancel this order? This cannot be undone.")) return;
    setCancelling(true);
    try {
      await cancelOrder(order.order_number);
      setOrder((o) => (o ? { ...o, order_status: "cancelled" } : o));
      showToast("Order cancelled", true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to cancel order", false);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error || !order) return <div style={{ padding: "32px 40px" }}><ErrorState message={error || "Order not found"} onRetry={fetchOrder} /></div>;

  const canCancel = order.order_status !== "shipped" && order.order_status !== "delivered" && order.order_status !== "cancelled";

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000 }}>
      <button onClick={() => router.push("/orders")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={14} /> Back to Orders
      </button>

      {toastMsg && (
        <div style={{ padding: "10px 16px", marginBottom: 16, borderRadius: 8, fontSize: 13, fontWeight: 600, background: toastMsg.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: toastMsg.ok ? "#10b981" : "#ef4444", border: `1px solid ${toastMsg.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }}>
          {toastMsg.text}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", margin: "0 0 6px" }}>{order.order_number}</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>{order.customer_name}</h1>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[order.order_status]?.bg, color: STATUS_COLORS[order.order_status]?.color, textTransform: "capitalize" }}>
            {order.order_status}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => printInvoice(order)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 8, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Printer size={14} /> Print Invoice
          </button>
          <select value={order.order_status} disabled={updating} onChange={(e) => handleStatusChange(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: "#0a0f1e", color: "#f1f5f9", fontSize: 13, cursor: "pointer", outline: "none" }}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: cancelling ? "not-allowed" : "pointer" }}>
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {/* Customer & delivery info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px" }}>Customer</h2>
          {[
            ["Name", order.customer_name],
            ["Phone", order.customer_phone],
            ["Email", order.customer_email || "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px", fontWeight: 600 }}>{k}</p>
              <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px" }}>Delivery</h2>
          {[
            ["Address", `${order.delivery_address}, ${order.city} ${order.pincode}`],
            ["Payment Method", order.payment_method?.toUpperCase()],
            ["Payment Status", order.payment_status],
            ["Order Date", new Date(order.created_at).toLocaleString("en-IN")],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px", fontWeight: 600 }}>{k}</p>
              <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, textTransform: k === "Payment Status" ? "capitalize" : "none" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px" }}>Items Ordered</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2d40" }}>
              {["Item", "Qty", "Price", "Total"].map((h, i) => (
                <th key={h} style={{ padding: "8px 6px", textAlign: i === 0 ? "left" : "right", fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1e2d4060" }}>
                <td style={{ padding: "10px 6px", fontSize: 13, color: "#f1f5f9" }}>{it.name}</td>
                <td style={{ padding: "10px 6px", fontSize: 13, color: "#94a3b8", textAlign: "right" }}>{it.qty}</td>
                <td style={{ padding: "10px 6px", fontSize: 13, color: "#94a3b8", textAlign: "right" }}>₹{it.price.toLocaleString("en-IN")}</td>
                <td style={{ padding: "10px 6px", fontSize: 13, color: "#f1f5f9", fontWeight: 600, textAlign: "right" }}>₹{(it.qty * it.price).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2d40", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Subtotal: ₹{order.subtotal.toLocaleString("en-IN")}</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Delivery: ₹{order.delivery_charge.toLocaleString("en-IN")}</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>GST: ₹{order.gst_amount.toLocaleString("en-IN")}</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Total: ₹{order.total_amount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {order.notes && (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>Order Notes</h2>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{order.notes}</p>
        </div>
      )}
    </div>
  );
}
