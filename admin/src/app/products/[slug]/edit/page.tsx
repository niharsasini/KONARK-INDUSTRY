"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { getProduct, updateProduct } from "@/lib/adminApi";

const CATEGORIES = [
  "Electric Vehicles",
  "Home Appliances",
  "Industrial Equipment",
  "Industrial Components",
  "Batteries",
  "Electronics",
  "Industrial Services",
];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
  borderRadius: 8, padding: "11px 14px", color: "#f1f5f9",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: "#94a3b8", display: "block",
  marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
};

type SpecRow = { key: string; val: string };

type ProductResponse = {
  slug: string;
  name: string;
  category: string;
  type: string;
  price: number;
  short_description: string;
  description: string;
  images: string[];
  specs: Record<string, string>;
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [form, setForm] = useState({
    name: "", category: CATEGORIES[0], type: "product",
    price: "0", shortDescription: "", description: "",
    inStock: true, isNew: false, isFeatured: false,
  });
  const [images, setImages] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: "", val: "" }]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const product = (await getProduct(slug)) as ProductResponse;
        setForm({
          name: product.name,
          category: product.category,
          type: product.type,
          price: String(product.price),
          shortDescription: product.short_description,
          description: product.description,
          inStock: product.in_stock,
          isNew: product.is_new,
          isFeatured: product.is_featured,
        });
        setImages(product.images?.length ? product.images : [""]);
        const specRows = Object.entries(product.specs ?? {}).map(([key, val]) => ({ key, val: String(val) }));
        setSpecs(specRows.length ? specRows : [{ key: "", val: "" }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setFetching(false);
      }
    })();
  }, [slug]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const updateSpec = (i: number, field: "key" | "val", value: string) =>
    setSpecs((rows) => rows.map((r, j) => (j === i ? { ...r, [field]: value } : r)));
  const addSpecRow = () => setSpecs((rows) => [...rows, { key: "", val: "" }]);
  const removeSpecRow = (i: number) => setSpecs((rows) => rows.filter((_, j) => j !== i));

  const addImageField = () => setImages((imgs) => [...imgs, ""]);
  const removeImageField = (i: number) => setImages((imgs) => imgs.filter((_, j) => j !== i));
  const updateImage = (i: number, value: string) =>
    setImages((imgs) => imgs.map((img, j) => (j === i ? value : img)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const specsObj: Record<string, string> = {};
      specs.forEach(({ key, val }) => {
        if (key.trim()) specsObj[key.trim()] = val.trim();
      });

      await updateProduct(slug, {
        name: form.name,
        category: form.category,
        type: form.type,
        price: Number(form.price) || 0,
        short_description: form.shortDescription,
        description: form.description,
        images: images.map((i) => i.trim()).filter(Boolean),
        specs: specsObj,
        in_stock: form.inStock,
        is_new: form.isNew,
        is_featured: form.isFeatured,
      });

      setSaved(true);
      setTimeout(() => router.push("/products"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ padding: "32px 40px", color: "#94a3b8" }}>Loading product...</div>;
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Edit Product</h1>
      </div>

      {saved && (
        <div style={{ padding: "14px 20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
          ✅ Product updated successfully! Redirecting...
        </div>
      )}
      {error && (
        <div style={{ padding: "14px 20px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "#ef4444", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Product Name *</label>
            <input required value={form.name} onChange={set("name")} placeholder="e.g. Electric Scooter Pro" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={set("category")} style={{ ...inputStyle, cursor: "pointer" }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Type *</label>
            <div style={{ display: "flex", gap: 16, paddingTop: 8 }}>
              {["vehicle", "product", "service"].map((t) => (
                <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", cursor: "pointer", textTransform: "capitalize" }}>
                  <input type="radio" name="type" value={t} checked={form.type === t} onChange={set("type")} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={set("price")} placeholder="0 = Price on Request" style={inputStyle} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Short Description * (max 150 chars)</label>
            <input required maxLength={150} value={form.shortDescription} onChange={set("shortDescription")} placeholder="One-line summary shown on product cards" style={inputStyle} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea rows={4} value={form.description} onChange={set("description")} placeholder="Full product description..." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>
              Product Images
              <span style={{ color: "#64748b", fontSize: 12, marginLeft: 8, textTransform: "none", letterSpacing: "normal", fontWeight: 400 }}>
                (Add up to 5 image paths)
              </span>
            </label>

            {images.map((img, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <span style={{ color: "#64748b", fontSize: 13, minWidth: 20 }}>{i + 1}.</span>
                <input
                  type="text"
                  value={img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="/productimg/product-name.png"
                  style={{ ...inputStyle, flex: 1 }}
                />
                {img && (
                  <img
                    src={img}
                    alt="preview"
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid #1e2d40", background: "#0f172a" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={addImageField}
                style={{ background: "transparent", border: "1px dashed #1e2d40", color: "#64748b", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, width: "100%", marginTop: 4 }}
              >
                + Add Another Image
              </button>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Specifications</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
              {specs.map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <input value={row.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Key (e.g. Range)" style={{ ...inputStyle, flex: 1 }} />
                  <input value={row.val} onChange={(e) => updateSpec(i, "val", e.target.value)} placeholder="Value (e.g. 200 km)" style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={() => removeSpecRow(i)} style={{ background: "transparent", border: "1px solid #1e2d40", borderRadius: 8, color: "#ef4444", cursor: "pointer", padding: "0 12px" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addSpecRow} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: "transparent", color: "#00d4ff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add Spec
            </button>
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 28 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} />
              In Stock
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
              Mark as New
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} />
              Featured
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: "1px solid #1e2d40" }}>
          <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/products" style={{ display: "flex", alignItems: "center", padding: "12px 24px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 10, color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
