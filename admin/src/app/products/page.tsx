"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { getAdminProducts, deleteProduct } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";

const TYPE_COLORS: Record<string, string> = {
  vehicle: "#00d4ff",
  product: "#10b981",
  service: "#a78bfa",
};

type Product = {
  slug: string;
  name: string;
  category: string;
  type: string;
  price: number;
  images: string[];
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProducts();
      setProducts(Array.isArray(data) ? data : (data as Record<string, Product[]>).products ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || p.type === typeFilter.toLowerCase();
    return matchSearch && matchType;
  });

  const confirmDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteSlug);
      setProducts((ps) => ps.filter((p) => p.slug !== deleteSlug));
      setDeleteSlug(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
    borderRadius: 8, padding: "10px 14px", color: "#f1f5f9",
    fontSize: 13, outline: "none", boxSizing: "border-box",
  };

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchProducts} /></div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Products</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{products.length} products in catalogue</p>
        </div>
        <button onClick={() => router.push("/products/new")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Vehicle", "Product", "Service"].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: typeFilter === t ? "#00d4ff" : "#1e2d40", background: typeFilter === t ? "rgba(0,212,255,0.08)" : "transparent", color: typeFilter === t ? "#00d4ff" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>📦</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 16 }}>No products found</p>
          <button onClick={() => router.push("/products/new")} style={{ padding: "10px 20px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}>Add First Product</button>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#0f172a" }}>
                <tr>
                  {["Image", "Name", "Category", "Type", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.slug} style={{ borderTop: "1px solid #1e2d40" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={p.images?.[0] || "/placeholder.svg"}
                        alt={p.name}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid #1e2d40", background: "#0f172a" }}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                      {p.name}
                      {p.is_new && <span style={{ marginLeft: 6, fontSize: 10, background: "rgba(0,212,255,0.12)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>NEW</span>}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{p.category}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${TYPE_COLORS[p.type] ?? "#94a3b8"}15`, color: TYPE_COLORS[p.type] ?? "#94a3b8", textTransform: "capitalize" }}>{p.type}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: p.price > 0 ? "#f1f5f9" : "#64748b" }}>
                      {p.price > 0 ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: p.in_stock ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: p.in_stock ? "#10b981" : "#ef4444" }}>
                        {p.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => router.push(`/products/${p.slug}/edit`)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 12, cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteSlug(p.slug)}
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
      )}

      {/* Delete confirm */}
      {deleteSlug !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
            <Trash2 size={32} color="#ef4444" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>Delete Product?</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteSlug(null)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 8, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} disabled={deleting}
                style={{ padding: "10px 24px", background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
