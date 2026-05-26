"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const CATEGORIES = ["EV Scooter", "E-Rickshaw", "Fan/AC", "Battery", "Solar", "Industrial"];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
  borderRadius: 8, padding: "11px 14px", color: "#f1f5f9",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: "#94a3b8", display: "block",
  marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
};

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "", category: CATEGORIES[0], type: "product",
    price: "", description: "", stock: true, isNew: false, image: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Add New Product</h1>
      </div>

      {saved && (
        <div style={{ padding: "14px 20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
          ✅ Product saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Product Name *</label>
            <input required value={form.name} onChange={set("name")} placeholder="e.g. Electric Scooter Pro" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={set("category")} style={{ ...inputStyle, cursor: "pointer" }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Type</label>
            <select value={form.type} onChange={set("type")} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="vehicle">Vehicle</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={set("price")} placeholder="0 = Price on Request" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input value={form.image} onChange={set("image")} placeholder="/productimg/product-name.png" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea rows={4} value={form.description} onChange={set("description")} placeholder="Product description..." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 28 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
              <input type="checkbox" checked={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.checked }))} />
              In Stock
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
              Mark as New
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: "1px solid #1e2d40" }}>
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
            <Save size={15} /> Save Product
          </button>
          <Link href="/products" style={{ display: "flex", alignItems: "center", padding: "12px 24px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 10, color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
