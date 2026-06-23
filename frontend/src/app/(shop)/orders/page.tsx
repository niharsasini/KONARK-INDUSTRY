"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { getMyOrders, cancelOrder } from "@/lib/api";
import Breadcrumb from "@/components/ui/Breadcrumb";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#00d4ff",
  packed: "#a78bfa",
  shipped: "#00d4ff",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

function downloadInvoice(order: any) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${order.order_number}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { display:flex; justify-content:space-between; margin-bottom: 30px; }
    .company-name { font-size:24px; font-weight:bold; color:#0a0f1e; }
    .invoice-title { font-size:28px; color:#00d4ff; font-weight:bold; }
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0; }
    table { width:100%; border-collapse:collapse; margin:20px 0; }
    th { background:#0a0f1e; color:white; padding:10px; text-align:left; }
    td { padding:10px; border-bottom:1px solid #eee; }
    .total-row { font-weight:bold; font-size:18px; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; background:#dcfce7; color:#166534; font-size:12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">KONARK INDUSTRY</div>
      <div style="color:#666;margin-top:4px">
        Bhimatangi Housing Colony<br/>
        Bhubaneswar, Odisha 751002<br/>
        +91 94376 11129<br/>
        konarkindustrie@gmail.com
      </div>
    </div>
    <div style="text-align:right">
      <div class="invoice-title">INVOICE</div>
      <div style="color:#666;margin-top:8px">
        #${order.order_number}<br/>
        Date: ${new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  </div>

  <hr style="border:1px solid #eee;margin:20px 0"/>

  <div class="info-grid">
    <div>
      <strong>Bill To:</strong><br/>
      <div style="margin-top:8px;color:#666">
        ${order.customer_name || ""}<br/>
        ${order.customer_phone || ""}<br/>
        ${order.customer_email || ""}<br/>
        ${order.delivery_address || ""}
      </div>
    </div>
    <div>
      <strong>Order Details:</strong><br/>
      <div style="margin-top:8px;color:#666">
        Order #: ${order.order_number}<br/>
        Status: <span class="badge">${order.order_status}</span><br/>
        Payment: ${order.payment_method || "COD"}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${(order.items || []).map((item: any, i: number) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>₹${item.price?.toLocaleString("en-IN")}</td>
          <td>₹${(item.qty * item.price)?.toLocaleString("en-IN")}</td>
        </tr>
      `).join("")}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" style="text-align:right;padding:10px">Subtotal:</td>
        <td>₹${order.subtotal?.toLocaleString("en-IN") || 0}</td>
      </tr>
      <tr class="total-row">
        <td colspan="4" style="text-align:right;padding:10px">Total:</td>
        <td style="color:#00d4ff">₹${order.total_amount?.toLocaleString("en-IN") || 0}</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#666;font-size:12px;text-align:center">
    Thank you for shopping with Konark Industry!<br/>
    For support: +91 94376 11129 | konarkindustrie@gmail.com<br/>
    This is a computer generated invoice.
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${order.order_number}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 24px", height: 90, animation: "pulse 1.5s infinite" }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("konark_token") : null;
    if (!token) { setLoading(false); return; }
    setLoading(true);
    getMyOrders()
      .then((data: any) => setOrders(Array.isArray(data) ? data : data?.orders || []))
      .catch(() => setError("Could not load orders. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderNumber: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderNumber);
    try {
      await cancelOrder(orderNumber);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cannot cancel this order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>My Orders</h1>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 32px" }}>Track and manage your Konark orders</p>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p style={{ fontSize: 16, color: "#ef4444", marginBottom: 12 }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "#00d4ff", color: "#0a0f1e", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>No orders yet</h3>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 28 }}>Your order history will appear here once you make a purchase.</p>
            <Link href="/products" style={{ display: "inline-block", padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map((order: any) => {
              const orderStatus = (order.order_status || "pending").toLowerCase();
              const statusColor = STATUS_COLORS[orderStatus] || "#94a3b8";
              const firstItem = order.items?.[0];
              const canCancel = CANCELLABLE_STATUSES.includes(orderStatus);
              return (
                <div key={order.id || order.order_number} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>
                        Order {order.order_number || order.id}
                      </span>
                      <span style={{ fontSize: 12, color: "#64748b", marginLeft: 12 }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                      {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {firstItem && (
                      <div style={{ width: 56, height: 56, background: "#111827", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                        <Image src={firstItem.image || "/productimg/Electric Scooter.png"} alt={firstItem.name} fill style={{ objectFit: "contain", padding: 4 }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>
                        {firstItem?.name || "Order items"}
                        {order.items?.length > 1 && <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}> +{order.items.length - 1} more</span>}
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#00d4ff", margin: "0 0 6px" }}>
                        {order.total_amount ? `₹${Number(order.total_amount).toLocaleString("en-IN")}` : "—"}
                      </p>
                      <button
                        onClick={() => downloadInvoice(order)}
                        style={{ background: "transparent", border: "1px solid #1e2d40", color: "#64748b", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", marginBottom: 6, display: "block", marginLeft: "auto" }}
                      >
                        📄 Invoice
                      </button>
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order.order_number)}
                          disabled={cancellingId === order.order_number}
                          style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.4)", background: "transparent", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: cancellingId === order.order_number ? "not-allowed" : "pointer", opacity: cancellingId === order.order_number ? 0.6 : 1 }}
                        >
                          {cancellingId === order.order_number ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 32, padding: "20px 24px", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 6px" }}>Need help with an order?</p>
          <Link href="/services/enquiry" style={{ fontSize: 13, color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>
            Contact our support team →
          </Link>
        </div>
      </div>
    </div>
  );
}
