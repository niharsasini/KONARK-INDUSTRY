"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2, Star } from "lucide-react";
import { getAdminProducts, deleteProduct, toggleStock, toggleFeatured } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

const TYPE_COLORS: Record<string, string> = {
  vehicle: "#0f4c81",
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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string> = {
        skip: String((page - 1) * LIMIT),
        limit: String(LIMIT),
      };
      if (search) filters.search = search;
      if (typeFilter !== "All") filters.type = typeFilter.toLowerCase();
      const { items, total } = await getAdminProducts(filters);
      setProducts(Array.isArray(items) ? items : []);
      setTotal(total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [search, typeFilter]);

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const confirmDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteSlug);
      setProducts((ps) => ps.filter((p) => p.slug !== deleteSlug));
      setTotal((t) => t - 1);
      setDeleteSlug(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStock = async (slug: string) => {
    try {
      await toggleStock(slug);
      setProducts((ps) => ps.map((p) => (p.slug === slug ? { ...p, in_stock: !p.in_stock } : p)));
    } catch {
      showToast("Failed to toggle stock status");
    }
  };

  const handleToggleFeatured = async (slug: string) => {
    try {
      await toggleFeatured(slug);
      setProducts((ps) => ps.map((p) => (p.slug === slug ? { ...p, is_featured: !p.is_featured } : p)));
    } catch {
      showToast("Failed to toggle featured status");
    }
  };

  const toggleSelected = (slug: string) => {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  };

  const toggleSelectAll = () => {
    setSelected((s) => (s.length === products.length ? [] : products.map((p) => p.slug)));
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} products? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      for (const slug of selected) {
        await deleteProduct(slug);
      }
      setProducts((ps) => ps.filter((p) => !selected.includes(p.slug)));
      setTotal((t) => t - selected.length);
      showToast(`${selected.length} products deleted`);
      setSelected([]);
    } catch {
      showToast("Bulk delete failed partway — please refresh and check.");
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkStock = async (makeInStock: boolean) => {
    setBulkBusy(true);
    try {
      for (const slug of selected) {
        const p = products.find((x) => x.slug === slug);
        if (p && p.in_stock !== makeInStock) await toggleStock(slug);
      }
      setProducts((ps) => ps.map((p) => (selected.includes(p.slug) ? { ...p, in_stock: makeInStock } : p)));
      showToast(`${selected.length} products marked ${makeInStock ? "in stock" : "out of stock"}`);
      setSelected([]);
    } catch {
      showToast("Bulk update failed partway — please refresh and check.");
    } finally {
      setBulkBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#ffffff", border: "1px solid #e8dfd0",
    borderRadius: 8, padding: "10px 14px", color: "#1a0f00",
    fontSize: 13, outline: "none", boxSizing: "border-box",
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchProducts} /></div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a0f00", margin: "0 0 4px" }}>Products</h1>
          <p style={{ fontSize: 13, color: "#6b5a45", margin: 0 }}>{total} products in catalogue</p>
        </div>
        <button onClick={() => router.push("/products/new")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#0f4c81", color: "#ffffff", fontWeight: 700, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: "10px 16px", marginBottom: 16, borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(15,76,129,0.1)", color: "#0f4c81", border: "1px solid rgba(15,76,129,0.3)" }}>
          {toastMsg}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b5a45" }} />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Vehicle", "Product", "Service"].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: typeFilter === t ? "#0f4c81" : "#e8dfd0", background: typeFilter === t ? "rgba(15,76,129,0.08)" : "transparent", color: typeFilter === t ? "#0f4c81" : "#6b5a45", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 16px", background: "rgba(15,76,129,0.06)", border: "1px solid rgba(15,76,129,0.2)", borderRadius: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f4c81" }}>{selected.length} selected</span>
          <button disabled={bulkBusy} onClick={handleBulkDelete} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(192,57,43,0.4)", background: "rgba(192,57,43,0.1)", color: "#c0392b", fontSize: 12, fontWeight: 600, cursor: bulkBusy ? "not-allowed" : "pointer" }}>Delete Selected</button>
          <button disabled={bulkBusy} onClick={() => handleBulkStock(true)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e8dfd0", background: "transparent", color: "#10b981", fontSize: 12, fontWeight: 600, cursor: bulkBusy ? "not-allowed" : "pointer" }}>Mark In Stock</button>
          <button disabled={bulkBusy} onClick={() => handleBulkStock(false)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e8dfd0", background: "transparent", color: "#6b5a45", fontSize: 12, fontWeight: 600, cursor: bulkBusy ? "not-allowed" : "pointer" }}>Mark Out of Stock</button>
          <button onClick={() => setSelected([])} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e8dfd0", background: "transparent", color: "#6b5a45", fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>Clear Selection</button>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6b5a45" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>📦</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#6b5a45", marginBottom: 16 }}>No products found</p>
          <button onClick={() => router.push("/products/new")} style={{ padding: "10px 20px", background: "#0f4c81", color: "#ffffff", fontWeight: 700, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}>Add First Product</button>
        </div>
      )}

      {/* Table */}
      {products.length > 0 && (
        <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9f4ec" }}>
                <tr>
                  <th style={{ padding: "14px 16px" }}>
                    <input type="checkbox" checked={selected.length === products.length} onChange={toggleSelectAll} />
                  </th>
                  {["Image", "Name", "Category", "Type", "Price", "Stock", "Featured", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b5a45", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.slug} style={{ borderTop: "1px solid #e8dfd0" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,76,129,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <input type="checkbox" checked={selected.includes(p.slug)} onChange={() => toggleSelected(p.slug)} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={p.images?.[0] || "/placeholder.svg"}
                        alt={p.name}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid #e8dfd0", background: "#f9f4ec" }}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1a0f00" }}>
                      {p.name}
                      {p.is_new && <span style={{ marginLeft: 6, fontSize: 10, background: "rgba(15,76,129,0.12)", color: "#0f4c81", border: "1px solid rgba(15,76,129,0.25)", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>NEW</span>}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b5a45" }}>{p.category}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${TYPE_COLORS[p.type] ?? "#6b5a45"}15`, color: TYPE_COLORS[p.type] ?? "#6b5a45", textTransform: "capitalize" }}>{p.type}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: p.price > 0 ? "#1a0f00" : "#6b5a45" }}>
                      {p.price > 0 ? `₹${p.price.toLocaleString("en-IN")}` : "On Request"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => handleToggleStock(p.slug)}
                        style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: p.in_stock ? "rgba(16,185,129,0.1)" : "rgba(192,57,43,0.1)", color: p.in_stock ? "#10b981" : "#c0392b", border: "none", cursor: "pointer" }}>
                        {p.in_stock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => handleToggleFeatured(p.slug)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                        title={p.is_featured ? "Unfeature" : "Mark as featured"}>
                        <Star size={16} color={p.is_featured ? "#f97316" : "#6b5a45"} fill={p.is_featured ? "#f97316" : "none"} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => router.push(`/products/${p.slug}/edit`)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "transparent", border: "1px solid #e8dfd0", borderRadius: 6, color: "#6b5a45", fontSize: 12, cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0f4c81")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e8dfd0")}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteSlug(p.slug)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "transparent", border: "1px solid #e8dfd0", borderRadius: 6, color: "#6b5a45", fontSize: 12, cursor: "pointer" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.color = "#c0392b"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8dfd0"; e.currentTarget.style.color = "#6b5a45"; }}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />

      {/* Delete confirm */}
      {deleteSlug !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 16, padding: "32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
            <Trash2 size={32} color="#c0392b" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a0f00", margin: "0 0 8px" }}>Delete Product?</h3>
            <p style={{ fontSize: 13, color: "#6b5a45", margin: "0 0 24px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteSlug(null)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #e8dfd0", borderRadius: 8, color: "#6b5a45", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} disabled={deleting}
                style={{ padding: "10px 24px", background: "#c0392b", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
