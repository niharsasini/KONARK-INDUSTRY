"use client";
import { useState } from "react";
import Link from "next/link";

const INPUT = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid #1e2d40",
  borderRadius: 10,
  padding: "12px 16px",
  color: "#f1f5f9",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const LABEL = { display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 6 };

export default function CheckoutPage() {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", pincode: "", payment: "upi" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#00d4ff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#1e2d40";
    e.currentTarget.style.boxShadow = "none";
  };

  if (step === "success") {
    return (
      <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px" }}>Order Placed!</h1>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 12 }}>
            Your order has been confirmed. Our team will call you on{" "}
            <strong style={{ color: "#00d4ff" }}>{form.phone}</strong> to confirm delivery.
          </p>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 32 }}>
            Estimated delivery: 5–7 business days to {form.city || "your city"}.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" style={{ padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
              Continue Shopping
            </Link>
            <Link href="/orders" style={{ padding: "12px 28px", border: "1px solid #1e2d40", color: "#94a3b8", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>Checkout</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          {["Delivery Details", "Payment"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", border: "2px solid",
                borderColor: (step === "details" && i === 0) || (step === "payment" && i <= 1) ? "#00d4ff" : "#1e2d40",
                background: (step === "details" && i === 0) || (step === "payment" && i <= 1) ? "rgba(0,212,255,0.15)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#00d4ff",
              }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: (step === "details" && i === 0) || (step === "payment" && i <= 1) ? "#f1f5f9" : "#64748b", fontWeight: 600 }}>{s}</span>
              {i === 0 && <span style={{ color: "#1e2d40" }}>›</span>}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }} className="checkout-grid">
          {/* Form */}
          <div>
            {step === "details" && (
              <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "28px" }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Delivery Details</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { k: "name", label: "Full Name", type: "text", placeholder: "Rajesh Kumar", full: true },
                    { k: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                    { k: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                    { k: "city", label: "City", type: "text", placeholder: "Bhubaneswar" },
                    { k: "pincode", label: "PIN Code", type: "text", placeholder: "751024" },
                  ].map((f) => (
                    <div key={f.k} style={{ gridColumn: f.full ? "1 / -1" : undefined }}>
                      <label style={LABEL}>{f.label}</label>
                      <input type={f.type} value={(form as Record<string, string>)[f.k]} onChange={set(f.k)} required placeholder={f.placeholder} style={INPUT} onFocus={focus} onBlur={blur} />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={LABEL}>Full Address</label>
                    <textarea value={form.address} onChange={set("address")} rows={3} required placeholder="House/Flat No., Street, Area" style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
                <button onClick={() => setStep("payment")} style={{
                  marginTop: 24, width: "100%", padding: "14px", background: "#00d4ff",
                  color: "#0a0f1e", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: "pointer",
                }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "28px" }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Payment Method</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {[
                    { value: "upi", label: "UPI / QR Code", desc: "Pay via GPay, PhonePe, or any UPI app" },
                    { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                    { value: "bank", label: "Bank Transfer", desc: "Direct NEFT/IMPS transfer" },
                  ].map((opt) => (
                    <label key={opt.value} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                      border: `1px solid ${form.payment === opt.value ? "#00d4ff" : "#1e2d40"}`,
                      borderRadius: 10, cursor: "pointer",
                      background: form.payment === opt.value ? "rgba(0,212,255,0.06)" : "transparent",
                      transition: "all 0.2s",
                    }}>
                      <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={set("payment")} style={{ accentColor: "#00d4ff", width: 16, height: 16 }} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{opt.label}</p>
                        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep("details")} style={{ flex: 1, padding: "13px", border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 14, borderRadius: 10, cursor: "pointer" }}>
                    ← Back
                  </button>
                  <button onClick={() => setStep("success")} style={{ flex: 2, padding: "13px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 800, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
                    Place Order →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "24px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px" }}>Order Summary</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #1e2d40", marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, background: "#111827", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="/productimg/Electric Scooter.png" alt="" style={{ maxWidth: 44, maxHeight: 44, objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>Konark X1 Electric Scooter</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Qty: 1</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>₹27,000</span>
            </div>
            {[
              { label: "Subtotal", value: "₹27,000" },
              { label: "Delivery", value: "FREE", green: true },
              { label: "GST (18%)", value: "₹4,860" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>
                <span>{r.label}</span>
                <span style={{ color: r.green ? "#10b981" : "#f1f5f9", fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800 }}>
              <span style={{ color: "#f1f5f9" }}>Total</span>
              <span style={{ color: "#00d4ff" }}>₹31,860</span>
            </div>
            <div style={{ marginTop: 16, padding: "10px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, fontSize: 12, color: "#10b981" }}>
              🚚 Free delivery on orders above ₹5,000
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
