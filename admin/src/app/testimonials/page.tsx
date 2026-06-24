"use client";
import { useState, useEffect } from "react";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
} from "@/lib/adminApi";

type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  product_used: string;
  avatar_initials: string;
  is_active: boolean;
  display_order: number;
};

type FormState = {
  name: string;
  location: string;
  rating: number;
  comment: string;
  product_used: string;
  avatar_initials: string;
  display_order: number;
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  location: "",
  rating: 5,
  comment: "",
  product_used: "",
  avatar_initials: "",
  display_order: 0,
  is_active: true,
};

const INPUT: React.CSSProperties = {
  width: "100%", background: "#ffffff", border: "1px solid #d4c9b8",
  borderRadius: 8, padding: "9px 12px", color: "#1a0f00",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "#6b5a45",
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    getAllTestimonials()
      .then((data) => setItems((data as Testimonial[]) || []))
      .catch((err) => setError(err.message || "Failed to load testimonials"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      location: t.location,
      rating: t.rating,
      comment: t.comment,
      product_used: t.product_used,
      avatar_initials: t.avatar_initials,
      display_order: t.display_order,
      is_active: t.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, form);
      } else {
        await createTestimonial(form);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setBusyId(id);
    try {
      await deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const handleToggle = async (id: string) => {
    setBusyId(id);
    try {
      const updated = (await toggleTestimonial(id)) as Testimonial;
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, is_active: updated.is_active } : t)));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const move = async (t: Testimonial, dir: -1 | 1) => {
    const sorted = [...items].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((x) => x.id === t.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    setBusyId(t.id);
    try {
      await Promise.all([
        updateTestimonial(t.id, { display_order: other.display_order }),
        updateTestimonial(other.id, { display_order: t.display_order }),
      ]);
      fetchAll();
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const sortedItems = [...items].sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0f00", margin: "0 0 4px" }}>Testimonials</h1>
          <p style={{ fontSize: 13, color: "#6b5a45", margin: 0 }}>Manage homepage customer testimonials</p>
        </div>
        <button onClick={openCreate} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0f4c81", color: "#ffffff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Add Testimonial
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, fontSize: 13, color: "#ef4444" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a0f00", margin: "0 0 18px" }}>
            {editingId ? "Edit Testimonial" : "New Testimonial"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={LABEL}>Name</label>
              <input value={form.name} onChange={set("name")} style={INPUT} placeholder="Rajesh Kumar Panda" />
            </div>
            <div>
              <label style={LABEL}>Location</label>
              <input value={form.location} onChange={set("location")} style={INPUT} placeholder="Bhubaneswar, Odisha" />
            </div>
            <div>
              <label style={LABEL}>Rating (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>Product Used</label>
              <input value={form.product_used} onChange={set("product_used")} style={INPUT} placeholder="Electric Scooter" />
            </div>
            <div>
              <label style={LABEL}>Avatar Initials</label>
              <input value={form.avatar_initials} onChange={set("avatar_initials")} style={INPUT} placeholder="RKP" maxLength={4} />
            </div>
            <div>
              <label style={LABEL}>Display Order</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))} style={INPUT} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Comment</label>
            <textarea rows={3} value={form.comment} onChange={set("comment")} style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            <span style={{ fontSize: 13, color: "#6b5a45" }}>Active (visible on homepage)</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#0f4c81", color: "#ffffff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #e8dfd0", background: "transparent", color: "#6b5a45", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 14, padding: 24 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 60, background: "#f9f4ec", borderRadius: 8, marginBottom: 10, opacity: 1 - i * 0.2 }} />
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#6b5a45" }}>No testimonials yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sortedItems.map((t, i) => (
            <div key={t.id} style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 14, padding: 18, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button onClick={() => move(t, -1)} disabled={i === 0 || busyId === t.id} style={{ background: "transparent", border: "1px solid #e8dfd0", color: "#6b5a45", borderRadius: 6, width: 24, height: 24, cursor: i === 0 ? "not-allowed" : "pointer", fontSize: 11 }}>↑</button>
                <button onClick={() => move(t, 1)} disabled={i === sortedItems.length - 1 || busyId === t.id} style={{ background: "transparent", border: "1px solid #e8dfd0", color: "#6b5a45", borderRadius: 6, width: 24, height: 24, cursor: i === sortedItems.length - 1 ? "not-allowed" : "pointer", fontSize: 11 }}>↓</button>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(15,76,129,0.12)", border: "2px solid rgba(15,76,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#0f4c81", flexShrink: 0 }}>
                {t.avatar_initials || t.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a0f00" }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: "#6b5a45" }}>{t.location}</span>
                  <span style={{ fontSize: 12, color: "#c17f24", fontWeight: 700 }}>{t.rating} ★</span>
                  {t.product_used && (
                    <span style={{ fontSize: 11, color: "#0f4c81", background: "rgba(15,76,129,0.1)", padding: "2px 8px", borderRadius: 100, border: "1px solid rgba(15,76,129,0.3)" }}>
                      {t.product_used}
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: t.is_active ? "rgba(26,122,74,0.1)" : "rgba(107,90,69,0.1)", color: t.is_active ? "#1a7a4a" : "#6b5a45" }}>
                    {t.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#6b5a45", margin: 0, lineHeight: 1.6 }}>{t.comment}</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(t)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e8dfd0", background: "transparent", color: "#6b5a45", fontSize: 11, cursor: "pointer" }}>Edit</button>
                <button disabled={busyId === t.id} onClick={() => handleToggle(t.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: t.is_active ? "rgba(193,127,36,0.12)" : "rgba(26,122,74,0.1)", color: t.is_active ? "#c17f24" : "#1a7a4a", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {t.is_active ? "Deactivate" : "Activate"}
                </button>
                <button disabled={busyId === t.id} onClick={() => handleDelete(t.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e8dfd0", background: "transparent", color: "#c0392b", fontSize: 11, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
