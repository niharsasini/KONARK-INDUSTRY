"use client";
import { useState, useEffect } from "react";
import {
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryFeatured,
} from "@/lib/adminApi";
import { ImageUpload } from "@/components/ImageUpload";

type MediaType = "image" | "video";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  media_type: MediaType;
  category: string;
  url: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  tags: string[];
};

type FormState = {
  title: string;
  description: string;
  media_type: MediaType;
  category: string;
  url: string;
  thumbnail_url: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  tags: string;
};

const CATEGORIES = ["products", "events", "factory", "team", "awards", "customers"];
const FILTERS = ["all", "images", "videos", "featured"] as const;
type Filter = (typeof FILTERS)[number];

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  media_type: "image",
  category: "products",
  url: "",
  thumbnail_url: "",
  is_featured: false,
  is_active: true,
  sort_order: 0,
  tags: "",
};

const INPUT: React.CSSProperties = {
  width: "100%", background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.3)",
  borderRadius: 8, padding: "9px 12px", color: "var(--text-heading)",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
};

const CARD_BORDER = "1px solid rgba(255,255,255,0.06)";

// Videos show their thumbnail; fall back to the YouTube still, else the raw url for images.
function thumbFor(item: { media_type: MediaType; url: string; thumbnail_url: string | null }): string {
  if (item.thumbnail_url) return item.thumbnail_url;
  if (item.media_type === "image") return item.url;
  const m = item.url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : "";
}

export default function LegacyGalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    getAllGallery()
      .then((data) => setItems((data as GalleryItem[]) || []))
      .catch((err) => setError(err.message || "Failed to load gallery"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (g: GalleryItem) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      description: g.description || "",
      media_type: g.media_type,
      category: g.category,
      url: g.url,
      thumbnail_url: g.thumbnail_url || "",
      is_featured: g.is_featured,
      is_active: g.is_active,
      sort_order: g.sort_order,
      tags: g.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      alert("Title and media file/URL are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      media_type: form.media_type,
      category: form.category,
      url: form.url.trim(),
      thumbnail_url: form.media_type === "video" ? form.thumbnail_url.trim() || null : null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      sort_order: form.sort_order,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) await updateGalleryItem(editingId, payload);
      else await createGalleryItem(payload);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save gallery item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    setBusyId(id);
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBusyId(null);
    }
  };

  const handleFeatured = async (id: string) => {
    setBusyId(id);
    try {
      const res = (await toggleGalleryFeatured(id)) as { is_featured: boolean };
      setItems((prev) => prev.map((g) => (g.id === id ? { ...g, is_featured: res.is_featured } : g)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const visible = items.filter((g) =>
    filter === "images" ? g.media_type === "image"
    : filter === "videos" ? g.media_type === "video"
    : filter === "featured" ? g.is_featured
    : true
  );

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>Ungrouped photos & videos</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Legacy items not in an album, plus video links</p>
        </div>
        <button onClick={openCreate} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Add Photo / Video
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
            border: filter === f ? "none" : "1px solid rgba(92,103,149,0.25)",
            background: filter === f ? "linear-gradient(135deg, #0D518C, #0EA5E9)" : "transparent",
            color: filter === f ? "#fff" : "var(--text-muted)",
          }}>{f}</button>
        ))}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: 20, background: "rgba(255,92,92,0.08)", border: "1px solid rgba(255,92,92,0.25)", borderRadius: 8, fontSize: 13, color: "var(--red)" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>
            {editingId ? "Edit Item" : "New Item"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={LABEL}>Title *</label>
              <input value={form.title} onChange={set("title")} style={INPUT} placeholder="Assembly line, Bhubaneswar" />
            </div>
            <div>
              <label style={LABEL}>Category</label>
              <select value={form.category} onChange={set("category")} style={INPUT}>
                {CATEGORIES.map((c) => <option key={c} value={c} style={{ textTransform: "capitalize" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Media Type</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["image", "video"] as MediaType[]).map((t) => (
                  <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, media_type: t }))} style={{
                    flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                    border: form.media_type === t ? "none" : "1px solid rgba(92,103,149,0.3)",
                    background: form.media_type === t ? "linear-gradient(135deg, #0D518C, #0EA5E9)" : "transparent",
                    color: form.media_type === t ? "#fff" : "var(--text-muted)",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={LABEL}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} style={INPUT} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Description</label>
            <textarea rows={2} value={form.description} onChange={set("description")} style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
          </div>

          {form.media_type === "image" ? (
            <ImageUpload label="Image *" value={form.url} onChange={(url) => setForm((f) => ({ ...f, url }))} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={LABEL}>Video URL * (YouTube or direct .mp4)</label>
                <input value={form.url} onChange={set("url")} style={INPUT} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <ImageUpload label="Thumbnail (optional)" value={form.thumbnail_url} onChange={(url) => setForm((f) => ({ ...f, thumbnail_url: url }))} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Tags (comma separated)</label>
            <input value={form.tags} onChange={set("tags")} style={INPUT} placeholder="scooter, launch, 2025" />
          </div>

          <div style={{ display: "flex", gap: 24, marginBottom: 18, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
              Featured (shown on homepage)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Active (visible on site)
            </label>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: 220, background: "var(--bg-card)", borderRadius: 16, opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>No gallery items {filter !== "all" ? "in this filter" : "yet"}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {visible.map((g) => {
            const thumb = thumbFor(g);
            const isVideo = g.media_type === "video";
            return (
              <div
                key={g.id}
                onMouseEnter={() => setHoverId(g.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{ background: "#132040", borderRadius: 16, border: CARD_BORDER, overflow: "hidden", opacity: g.is_active ? 1 : 0.55 }}
              >
                <div style={{ position: "relative", height: 160, background: "#0C1A2E" }}>
                  {thumb && <img src={thumb} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                  {isVideo && (
                    <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>▶ VIDEO</span>
                  )}
                  {g.is_featured && (
                    <span style={{ position: "absolute", top: 8, left: 8, fontSize: 16 }}>⭐</span>
                  )}
                  {hoverId === g.id && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(12,26,46,0.7)", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                      <button onClick={() => openEdit(g)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                      <button disabled={busyId === g.id} onClick={() => handleFeatured(g.id)} title="Toggle featured" style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: g.is_featured ? "#F4C430" : "rgba(255,255,255,0.15)", color: g.is_featured ? "#0C1A2E" : "#fff", fontSize: 14, cursor: "pointer" }}>⭐</button>
                      <button disabled={busyId === g.id} onClick={() => handleDelete(g.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#DC2626", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                    </div>
                  )}
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E8F4FF", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#4A5880", textTransform: "capitalize" }}>{g.category}{g.is_active ? "" : " · hidden"}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: isVideo ? "rgba(168,85,247,0.15)" : "rgba(52,199,138,0.15)",
                      color: isVideo ? "#C084FC" : "#34C78A",
                    }}>{isVideo ? "VIDEO" : "IMAGE"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 16 }}>Hover a card for edit, feature and delete actions.</p>
    </div>
  );
}
