"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#00d4ff",
  processing: "#a78bfa",
  shipped: "#00d4ff",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

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

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("konark_token") : null;
    if (!token) { setLoading(false); return; }
    getMyOrders()
      .then((data: any) => setOrders(Array.isArray(data) ? data : data?.orders || []))
      .catch(() => setError("Could not load orders. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
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
              const statusColor = STATUS_COLORS[order.status?.toLowerCase()] || "#94a3b8";
              const firstItem = order.items?.[0];
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
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Processing"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {firstItem && (
                      <div style={{ width: 56, height: 56, background: "#111827", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img src={firstItem.image || "/productimg/Electric Scooter.png"} alt={firstItem.name} style={{ maxWidth: 48, maxHeight: 48, objectFit: "contain" }} />
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
