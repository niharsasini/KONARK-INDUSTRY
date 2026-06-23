"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store";
import Breadcrumb from "@/components/ui/Breadcrumb";

function getDeliveryDate() {
  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  minDate.setDate(today.getDate() + 5);
  maxDate.setDate(today.getDate() + 7);
  while (minDate.getDay() === 0) minDate.setDate(minDate.getDate() + 1);
  while (maxDate.getDay() === 0) maxDate.setDate(maxDate.getDate() + 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(minDate)} – ${fmt(maxDate)}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();
  const delivery = sub > 5000 ? 0 : sub > 0 ? 199 : 0;
  const gst = Math.round(sub * 0.18);
  const total = sub + delivery + gst;

  const isEmpty = items.length === 0;

  return (
    <div style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #040b16 100%)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: "0 0 32px" }}>
          Your Cart{" "}
          <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 400 }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        {isEmpty ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>
              Your cart is empty
            </h3>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 28 }}>
              Browse our products and add items to your cart.
            </p>
            <Link
              href="/products"
              style={{ display: "inline-block", padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none" }}
            >
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "60% 38%", gap: 24, alignItems: "start" }} className="cart-grid">
            {/* Cart items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.slug} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 64, height: 64, background: "#111827", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: 4 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{item.category}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #1e2d40", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      style={{ width: 30, height: 30, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 16, cursor: "pointer" }}
                    >−</button>
                    <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      style={{ width: 30, height: 30, background: "transparent", border: "none", color: "#f1f5f9", fontSize: 16, cursor: "pointer" }}
                    >+</button>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", flexShrink: 0, minWidth: 80, textAlign: "right" }}>
                    {item.price ? `₹${(item.price * item.quantity).toLocaleString("en-IN")}` : "On Request"}
                  </p>
                  <button
                    onClick={() => removeItem(item.slug)}
                    style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18, flexShrink: 0, padding: 4 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  >×</button>
                </div>
              ))}

              <Link
                href="/products"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", textDecoration: "none", marginTop: 8 }}
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
                  { label: "Subtotal", value: sub ? `₹${sub.toLocaleString("en-IN")}` : "—" },
                  { label: "Delivery", value: delivery === 0 ? "FREE" : `₹${delivery}` },
                  { label: "GST (18%)", value: sub ? `₹${gst.toLocaleString("en-IN")}` : "—" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8" }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.value === "FREE" ? "#10b981" : "#f1f5f9", fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                  <span style={{ color: "#f1f5f9" }}>Total</span>
                  <span style={{ color: "#00d4ff" }}>{sub ? `₹${total.toLocaleString("en-IN")}` : "On Request"}</span>
                </div>
              </div>

              {sub > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 13 }}>🚚</span>
                  <p style={{ fontSize: 12, color: "#10b981", margin: 0 }}>Delivery by <strong>{getDeliveryDate()}</strong></p>
                </div>
              )}

              {sub > 0 && sub < 5000 && (
                <p style={{ fontSize: 11, color: "#10b981", marginBottom: 16 }}>
                  Add ₹{(5000 - sub).toLocaleString("en-IN")} more for free delivery.
                </p>
              )}

              <Link
                href="/checkout"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", marginBottom: 10 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
              >
                Proceed to Checkout
              </Link>

              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                {["🔒 Secure", "↩ Returns", "🛡 Warranty"].map((t) => (
                  <span key={t} style={{ fontSize: 11, color: "#94a3b8" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
