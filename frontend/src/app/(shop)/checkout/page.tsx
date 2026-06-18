"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store";
import { createOrder } from "@/lib/api";
import toast from "react-hot-toast";

const SERVICEABLE_PINCODES = [
  '751001','751002','751003','751004','751005',
  '751006','751007','751008','751009','751010',
  '751011','751012','751013','751014','751015',
  '751016','751017','751018','751019','751020',
  '751021','751022','751023','751024','751025',
  '753001','753002','753003','753004','753005',
  '754001','754002','760001','760002','761001',
  '769001','769002','769003','768001','768002',
];

const MAJOR_CITIES = [
  'Bhubaneswar','Cuttack','Puri','Rourkela',
  'Berhampur','Sambalpur','Balasore','Brahmapur',
  'Baripada','Jharsuguda','Bargarh',
];

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

const LABEL = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#94a3b8",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  marginBottom: 6,
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", pincode: "", notes: "", gstin: "" });
  const [payment, setPayment] = useState("cod");
  const [pincodeStatus, setPincodeStatus] = useState<"none" | "ok" | "warn">("none");
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const sub = subtotal();
  const delivery = sub >= 5000 ? 0 : sub > 0 ? 199 : 0;
  const gst = parseFloat((sub * 0.18).toFixed(2));
  const total = parseFloat((sub + delivery + gst).toFixed(2));

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

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const cartItems = useCartStore.getState().items;
      const result = await createOrder({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || undefined,
        items: cartItems.map((item) => ({
          product_id: item.id,
          name: item.name,
          category: item.category,
          qty: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal: sub,
        delivery_charge: delivery,
        gst_amount: gst,
        total_amount: total,
        delivery_address: form.address,
        city: form.city,
        pincode: form.pincode || "",
        payment_method: payment,
        notes: form.notes || "",
      }) as { order_number?: string };
      clearCart();
      setOrderNumber(result?.order_number || "KI-" + Date.now());
      setStep("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Order failed. Please try again or call us.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px" }}>Order Placed!</h1>
          {orderNumber && (
            <p style={{ fontSize: 13, color: "#00d4ff", fontWeight: 700, margin: "0 0 8px" }}>Order #{orderNumber}</p>
          )}
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
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={LABEL}>Full Name</label>
                    <input aria-label="Full name" type="text" value={form.name} onChange={set("name")} required placeholder="Rajesh Kumar" style={INPUT} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={LABEL}>Phone Number</label>
                    <input aria-label="Phone number" type="tel" value={form.phone} onChange={set("phone")} required placeholder="+91 98765 43210" style={INPUT} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={LABEL}>Email (optional)</label>
                    <input aria-label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" style={INPUT} onFocus={focus} onBlur={blur} />
                  </div>
                  <div style={{ position: "relative" }}>
                    <label style={LABEL}>City</label>
                    <input
                      aria-label="City"
                      type="text"
                      value={form.city}
                      onChange={(e) => {
                        set("city")(e);
                        const q = e.target.value.toLowerCase();
                        setCityOptions(q.length > 0 ? MAJOR_CITIES.filter((c) => c.toLowerCase().startsWith(q)) : []);
                      }}
                      onBlur={() => setTimeout(() => setCityOptions([]), 200)}
                      required
                      placeholder="Bhubaneswar"
                      style={INPUT}
                      onFocus={focus}
                    />
                    {cityOptions.length > 0 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                        {cityOptions.map((c) => (
                          <button key={c} type="button" onClick={() => { setForm((f) => ({ ...f, city: c })); setCityOptions([]); }} style={{ display: "block", width: "100%", padding: "10px 14px", background: "transparent", border: "none", color: "#f1f5f9", fontSize: 13, textAlign: "left", cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >{c}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={LABEL}>PIN Code</label>
                    <input
                      aria-label="PIN code"
                      type="text"
                      value={form.pincode}
                      maxLength={6}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setForm((f) => ({ ...f, pincode: val }));
                        if (val.length === 6) {
                          setPincodeStatus(SERVICEABLE_PINCODES.includes(val) ? "ok" : "warn");
                        } else {
                          setPincodeStatus("none");
                        }
                      }}
                      placeholder="751024"
                      style={INPUT}
                      onFocus={focus}
                      onBlur={blur}
                    />
                    {pincodeStatus === "ok" && <p style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>✓ Delivery available</p>}
                    {pincodeStatus === "warn" && <p style={{ fontSize: 12, color: "#f97316", marginTop: 4 }}>⚠ Delivery may take extra time. Call +91 94376 11129 to confirm.</p>}
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={LABEL}>Full Address</label>
                    <textarea aria-label="Full delivery address" value={form.address} onChange={set("address")} rows={3} required placeholder="House/Flat No., Street, Area" style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} onFocus={focus} onBlur={blur} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={LABEL}>GSTIN (Optional — for business orders)</label>
                    <input
                      aria-label="GSTIN number"
                      type="text"
                      value={form.gstin}
                      onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
                      maxLength={15}
                      placeholder="22AAAAA0000A1Z5"
                      style={INPUT}
                      onFocus={focus}
                      onBlur={blur}
                    />
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Add your GSTIN to receive a GST invoice for your order.</p>
                  </div>
                </div>
                <button
                  onClick={() => { if (!form.name || !form.phone || !form.address || !form.city) { toast.error("Please fill all required fields."); return; } setStep("payment"); }}
                  style={{ marginTop: 24, width: "100%", padding: "14px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 800, fontSize: 15, borderRadius: 10, border: "none", cursor: "pointer" }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "28px" }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Payment Method</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {[
                    { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                    { value: "upi", label: "UPI / QR Code", desc: "Pay via GPay, PhonePe, or any UPI app" },
                    { value: "bank", label: "Bank Transfer", desc: "Direct NEFT/IMPS transfer" },
                  ].map((opt) => (
                    <label key={opt.value} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                      border: `1px solid ${payment === opt.value ? "#00d4ff" : "#1e2d40"}`,
                      borderRadius: 10, cursor: "pointer",
                      background: payment === opt.value ? "rgba(0,212,255,0.06)" : "transparent",
                      transition: "all 0.2s",
                    }}>
                      <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={(e) => setPayment(e.target.value)} style={{ accentColor: "#00d4ff", width: 16, height: 16 }} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{opt.label}</p>
                        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {error && <p style={{ fontSize: 13, color: "#ef4444", marginBottom: 12 }}>{error}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep("details")} style={{ flex: 1, padding: "13px", border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 14, borderRadius: 10, cursor: "pointer" }}>
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || items.length === 0}
                    style={{ flex: 2, padding: "13px", background: loading ? "#0e7490" : "#00d4ff", color: "#0a0f1e", fontWeight: 800, fontSize: 14, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: items.length === 0 ? 0.5 : 1 }}
                  >
                    {loading ? "Placing Order..." : "Place Order →"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "24px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px" }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
              {items.map((item) => (
                <div key={item.slug} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid #1e2d40" }}>
                  <div style={{ width: 44, height: 44, background: "#111827", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: 3 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", flexShrink: 0 }}>
                    {item.price ? `₹${(item.price * item.quantity).toLocaleString("en-IN")}` : "—"}
                  </span>
                </div>
              ))}
            </div>
            {[
              { label: "Subtotal", value: sub ? `₹${sub.toLocaleString("en-IN")}` : "—" },
              { label: "Delivery", value: delivery === 0 ? "FREE" : `₹${delivery}`, green: delivery === 0 },
              { label: "GST (18%)", value: sub ? `₹${gst.toLocaleString("en-IN")}` : "—" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>
                <span>{r.label}</span>
                <span style={{ color: r.green ? "#10b981" : "#f1f5f9", fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800 }}>
              <span style={{ color: "#f1f5f9" }}>Total</span>
              <span style={{ color: "#00d4ff" }}>{sub ? `₹${total.toLocaleString("en-IN")}` : "On Request"}</span>
            </div>
            {sub > 0 && sub < 5000 && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, fontSize: 12, color: "#10b981" }}>
                🚚 Add ₹{(5000 - sub).toLocaleString("en-IN")} more for free delivery
              </div>
            )}
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
