"use client";
import Link from "next/link";

const SAMPLE_ITEMS = [
  { id: 1, name: "Electric Scooter", category: "Electric Vehicles", price: 27000, qty: 1, image: "/productimg/Electric Scooter.png", slug: "electric-scooter" },
  { id: 16, name: "LFP Battery", category: "Batteries", price: 0, qty: 2, image: "/productimg/LFP Battery.png", slug: "lfp-battery" },
];

export default function CartPage() {
  const subtotal = SAMPLE_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 5000 ? 0 : 199;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: "0 0 32px" }}>
          Your Cart <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 400 }}>({SAMPLE_ITEMS.length} items)</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "60% 38%", gap: 24, alignItems: "start" }} className="cart-grid">
          {/* Cart items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SAMPLE_ITEMS.map((item) => (
              <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 64, height: 64, background: "#111827", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src={item.image} alt={item.name} style={{ maxWidth: 56, maxHeight: 56, objectFit: "contain" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{item.category}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #1e2d40", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <button style={{ width: 30, height: 30, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 16, cursor: "pointer" }}>−</button>
                  <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{item.qty}</span>
                  <button style={{ width: 30, height: 30, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 16, cursor: "pointer" }}>+</button>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", flexShrink: 0, minWidth: 80, textAlign: "right" }}>
                  {item.price ? `₹${(item.price * item.qty).toLocaleString("en-IN")}` : "On Request"}
                </p>
                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18, flexShrink: 0, padding: 4 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  ×
                </button>
              </div>
            ))}

            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", textDecoration: "none", marginTop: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "24px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 20px" }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Subtotal", value: subtotal ? `₹${subtotal.toLocaleString("en-IN")}` : "—" },
                { label: "Delivery", value: delivery === 0 ? "FREE" : `₹${delivery}` },
                { label: "GST (18%)", value: subtotal ? `₹${gst.toLocaleString("en-IN")}` : "—" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8" }}>
                  <span>{row.label}</span>
                  <span style={{ color: row.value === "FREE" ? "#10b981" : "#f1f5f9", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                <span style={{ color: "#f1f5f9" }}>Total</span>
                <span style={{ color: "#00d4ff" }}>{subtotal ? `₹${total.toLocaleString("en-IN")}` : "On Request"}</span>
              </div>
            </div>

            {delivery > 0 && (
              <p style={{ fontSize: 11, color: "#10b981", marginBottom: 16 }}>Add ₹{(5000 - subtotal).toLocaleString("en-IN")} more for free delivery.</p>
            )}

            <Link
              href="/checkout"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", marginBottom: 10 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
            >
              Proceed to Checkout
            </Link>

            {/* Trust icons */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
              {["🔒 Secure", "↩ Returns", "🛡 Warranty"].map((t) => (
                <span key={t} style={{ fontSize: 11, color: "#94a3b8" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
