"use client";
import { useEffect } from "react";
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

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".cart-header", {
        y: 32, opacity: 0, duration: 0.6,
      });
      await animateIn(".cart-item", {
        x: -32, opacity: 0,
        stagger: 0.1, duration: 0.5,
      });
      await animateIn(".cart-summary", {
        x: 40, opacity: 0, duration: 0.6,
      });
    };
    run();
  }, [items.length]);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <h1 className="cart-header" style={{ fontSize: 28, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 32px" }}>
          Your Cart{" "}
          <span style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 400 }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        {isEmpty ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 10px" }}>
              Your cart is empty
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
              Browse our products and add items to your cart.
            </p>
            <Link
              href="/products"
              style={{ display: "inline-block", padding: "12px 28px", background: "var(--grad-navy)", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", boxShadow: "var(--shadow-navy)" }}
            >
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "60% 38%", gap: 24, alignItems: "start" }} className="cart-grid">
            {/* Cart items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.slug} className="cart-item" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ width: 64, height: 64, background: "var(--bg-section)", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: 4 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 2px" }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{item.category}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-default)", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      style={{ width: 30, height: 30, background: "transparent", border: "none", color: "var(--text-heading)", fontSize: 16, cursor: "pointer" }}
                    >−</button>
                    <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      style={{ width: 30, height: 30, background: "transparent", border: "none", color: "var(--text-heading)", fontSize: 16, cursor: "pointer" }}
                    >+</button>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", flexShrink: 0, minWidth: 80, textAlign: "right" }}>
                    {item.price ? `₹${(item.price * item.quantity).toLocaleString("en-IN")}` : "On Request"}
                  </p>
                  <button
                    onClick={() => removeItem(item.slug)}
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, flexShrink: 0, padding: 4 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >×</button>
                </div>
              ))}

              <Link
                href="/products"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginTop: 8 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="cart-summary" style={{ background: "var(--bg-card)", border: "1px solid rgba(13,81,140,0.08)", borderRadius: 20, padding: "24px", boxShadow: "var(--neu-shadow)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 20px" }}>Order Summary</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Subtotal", value: sub ? `₹${sub.toLocaleString("en-IN")}` : "—" },
                  { label: "Delivery", value: delivery === 0 ? "FREE" : `₹${delivery}` },
                  { label: "GST (18%)", value: sub ? `₹${gst.toLocaleString("en-IN")}` : "—" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.value === "FREE" ? "var(--green)" : "var(--text-heading)", fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-heading)", fontSize: 16, fontWeight: 700 }}>Total</span>
                  <span style={{ color: "var(--gold)", fontSize: 24, fontWeight: 900 }}>{sub ? `₹${total.toLocaleString("en-IN")}` : "On Request"}</span>
                </div>
              </div>

              {sub > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 13 }}>🚚</span>
                  <p style={{ fontSize: 12, color: "var(--green)", margin: 0 }}>Delivery by <strong>{getDeliveryDate()}</strong></p>
                </div>
              )}

              {sub > 0 && sub < 5000 && (
                <p style={{ fontSize: 11, color: "var(--green)", marginBottom: 16 }}>
                  Add ₹{(5000 - sub).toLocaleString("en-IN")} more for free delivery.
                </p>
              )}

              <Link
                href="/checkout"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 13px", background: "var(--grad-primary)", color: "#FFFFFF", fontWeight: 700, fontSize: 14, borderRadius: 14, textDecoration: "none", marginBottom: 10, boxShadow: "var(--shadow-navy)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Proceed to Checkout
              </Link>

              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                {["🔒 Secure", "↩ Returns", "🛡 Warranty"].map((t) => (
                  <span key={t} style={{ fontSize: 11, color: "var(--text-muted)" }}>{t}</span>
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
