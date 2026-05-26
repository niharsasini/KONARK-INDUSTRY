"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

const ALL_PRODUCTS = [
  { id: 1, name: "Electric Scooter", category: "EV Scooter", type: "vehicle", price: 27000, stock: true, isNew: true, image: "/productimg/Electric Scooter.png" },
  { id: 2, name: "Electric Motor Cycle", category: "EV Scooter", type: "vehicle", price: 45000, stock: true, isNew: true, image: "/productimg/Electric Motor Cycle.png" },
  { id: 3, name: "E-Rickshaw", category: "E-Rickshaw", type: "vehicle", price: 85000, stock: true, isNew: false, image: "/productimg/E-Rickshaw.png" },
  { id: 4, name: "Utility Vehicle", category: "E-Rickshaw", type: "vehicle", price: 55000, stock: true, isNew: false, image: "/productimg/Utility Vehicle.png" },
  { id: 5, name: "Air Conditioner", category: "Fan/AC", type: "product", price: 26000, stock: true, isNew: false, image: "/productimg/Air Conditioner.png" },
  { id: 6, name: "BLDC Fan", category: "Fan/AC", type: "product", price: 2200, stock: true, isNew: true, image: "/productimg/BLDC Fan.png" },
  { id: 7, name: "BLDC Motor", category: "Industrial", type: "product", price: 6500, stock: true, isNew: false, image: "/productimg/BLDC Motor .png" },
  { id: 8, name: "Induction Cooker", category: "Fan/AC", type: "product", price: 1650, stock: true, isNew: false, image: "/productimg/Induction Cooker.png" },
  { id: 9, name: "Infra Red Cooker", category: "Fan/AC", type: "product", price: 1650, stock: true, isNew: false, image: "/productimg/Infra Red Cooker.png" },
  { id: 10, name: "Water Purifier", category: "Fan/AC", type: "product", price: 4800, stock: true, isNew: false, image: "/productimg/Water Purifier.png" },
  { id: 11, name: "Android TV", category: "Fan/AC", type: "product", price: 0, stock: true, isNew: true, image: "/productimg/Android TV.png" },
  { id: 12, name: "Hybrid Cold Storage", category: "Industrial", type: "product", price: 250, stock: true, isNew: true, image: "/productimg/Hybrid Cold Storage.png" },
  { id: 13, name: "Cooling Coil", category: "Industrial", type: "product", price: 300, stock: true, isNew: false, image: "/productimg/Cooling Coil.png" },
  { id: 14, name: "Condenser Coil", category: "Industrial", type: "product", price: 300, stock: true, isNew: false, image: "/productimg/Condenser Coil.png" },
  { id: 15, name: "AC Outer Body", category: "Industrial", type: "product", price: 6500, stock: true, isNew: false, image: "/productimg/Air Conditioner Outer Body.png" },
  { id: 16, name: "LFP Battery", category: "Battery", type: "product", price: 14000, stock: true, isNew: true, image: "/productimg/LFP Battery.png" },
  { id: 17, name: "BMS", category: "Battery", type: "product", price: 0, stock: true, isNew: true, image: "/productimg/BMS.png" },
  { id: 18, name: "Battery Charger", category: "Battery", type: "product", price: 0, stock: true, isNew: false, image: "/productimg/Battery Charger.png" },
  { id: 19, name: "PCB and Soldering", category: "Industrial", type: "service", price: 0, stock: true, isNew: false, image: "/productimg/PCB and Soldering.png" },
];

const CATEGORIES = ["EV Scooter", "E-Rickshaw", "Fan/AC", "Battery", "Solar", "Industrial"];

const TYPE_COLORS: Record<string, string> = {
  vehicle: "#00d4ff",
  product: "#10b981",
  service: "#a78bfa",
};

const EMPTY_FORM = { name: "", category: CATEGORIES[0], type: "product", price: "", description: "", stock: true, isNew: false, image: "" };

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || p.type === typeFilter.toLowerCase();
    return matchSearch && matchType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerOpen(false);
    setForm({ ...EMPTY_FORM });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
    borderRadius: 8, padding: "10px 14px", color: "#f1f5f9",
    fontSize: 13, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Products</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{ALL_PRODUCTS.length} products in catalogue</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Vehicle", "Product", "Service"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid",
                borderColor: typeFilter === t ? "#00d4ff" : "#1e2d40",
                background: typeFilter === t ? "rgba(0,212,255,0.08)" : "transparent",
                color: typeFilter === t ? "#00d4ff" : "#94a3b8",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#0f172a" }}>
              <tr>
                {["ID", "Image", "Name", "Category", "Type", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #1e2d40" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>#{p.id}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ width: 40, height: 40, background: "#0a0f1e", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                    {p.name}
                    {p.isNew && <span style={{ marginLeft: 6, fontSize: 10, background: "rgba(0,212,255,0.12)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>NEW</span>}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{p.category}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${TYPE_COLORS[p.type]}15`, color: TYPE_COLORS[p.type], textTransform: "capitalize" }}>
                      {p.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: p.price > 0 ? "#f1f5f9" : "#64748b" }}>
                    {p.price > 0 ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>In Stock</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 12, cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 12, cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} onClick={() => setDrawerOpen(false)} />
          <div style={{ width: 420, background: "#0f172a", borderLeft: "1px solid #1e2d40", height: "100%", overflowY: "auto", padding: "28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Add New Product</h2>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name", label: "Product Name", placeholder: "e.g. Electric Scooter Pro", type: "text" },
                { key: "image", label: "Image URL", placeholder: "/productimg/...", type: "text" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</label>
                  <input type={type} required={key === "name"} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {["vehicle", "product", "service"].map((t) => <option key={t} value={t} style={{ textTransform: "capitalize" }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Price (₹, 0 = Price on Request)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0" style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Product description..." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
                  <input type="checkbox" checked={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.checked }))} />
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
                  Mark as New
                </label>
              </div>
              <button type="submit" style={{ padding: "13px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer", marginTop: 8 }}>
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
            <Trash2 size={32} color="#ef4444" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>Delete Product?</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>This action cannot be undone. The product will be removed permanently.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 8, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={() => setDeleteId(null)} style={{ padding: "10px 24px", background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
