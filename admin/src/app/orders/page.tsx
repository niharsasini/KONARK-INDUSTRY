export default function OrdersPage() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>Orders</h1>
      <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>Order management — integration with payment gateway coming soon.</p>
      <div style={{ marginTop: 40, padding: "48px", background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, textAlign: "center" }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>📦</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>No orders yet</p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Orders will appear here once customers complete purchases.</p>
      </div>
    </div>
  );
}
