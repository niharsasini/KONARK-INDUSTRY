"use client";
import Link from "next/link";

const SAMPLE_ORDERS = [
  {
    id: "KI-2024-0091",
    date: "12 Jan 2024",
    status: "Delivered",
    statusColor: "#10b981",
    item: "Konark X1 Electric Scooter",
    category: "Electric Vehicles",
    image: "/productimg/Electric Scooter.png",
    price: "₹27,000",
    slug: "electric-scooter",
  },
  {
    id: "KI-2024-0087",
    date: "5 Jan 2024",
    status: "Shipped",
    statusColor: "#00d4ff",
    item: "BLDC Fan (Pack of 2)",
    category: "Home Appliances",
    image: "/productimg/BLDC Fan.png",
    price: "₹4,400",
    slug: "bldc-fan",
  },
];

export default function OrdersPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>My Orders</h1>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 32px" }}>Track and manage your Konark orders</p>

        {SAMPLE_ORDERS.length === 0 ? (
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
            {SAMPLE_ORDERS.map((order) => (
              <div key={order.id} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>Order {order.id}</span>
                    <span style={{ fontSize: 12, color: "#64748b", marginLeft: 12 }}>{order.date}</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                    background: `${order.statusColor}18`, color: order.statusColor,
                    border: `1px solid ${order.statusColor}30`,
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 56, height: 56, background: "#111827", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={order.image} alt={order.item} style={{ maxWidth: 48, maxHeight: 48, objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{order.item}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{order.category}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#00d4ff", margin: "0 0 6px" }}>{order.price}</p>
                    <Link href={`/products/${order.slug}`} style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    >
                      View Product →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
