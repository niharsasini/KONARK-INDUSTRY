"use client";
import { useState, useEffect } from "react";
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/adminApi";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
};

type FormState = {
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  question: "",
  answer: "",
  category: "general",
  display_order: 0,
  is_active: true,
};

const INPUT: React.CSSProperties = {
  width: "100%", background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)",
  borderRadius: 8, padding: "9px 12px", color: "var(--text-heading)",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
};

export default function FaqAdminPage() {
  const [items, setItems] = useState<FAQ[]>([]);
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
    getAllFaqs()
      .then((data) => setItems((data as FAQ[]) || []))
      .catch((err) => setError(err.message || "Failed to load FAQs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (f: FAQ) => {
    setEditingId(f.id);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category,
      display_order: f.display_order,
      is_active: f.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateFaq(editingId, form);
      } else {
        await createFaq(form);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setBusyId(id);
    try {
      await deleteFaq(id);
      setItems((prev) => prev.filter((f) => f.id !== id));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleActive = async (f: FAQ) => {
    setBusyId(f.id);
    try {
      const updated = (await updateFaq(f.id, { is_active: !f.is_active })) as FAQ;
      setItems((prev) => prev.map((x) => (x.id === f.id ? { ...x, is_active: updated.is_active } : x)));
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
    <div style={{ padding: "32px 40px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>FAQ</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Manage frequently asked questions shown on the website</p>
        </div>
        <button onClick={openCreate} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--navy)", color: "var(--text-heading)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Add FAQ
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: 20, background: "rgba(255,112,67,0.08)", border: "1px solid rgba(255,112,67,0.25)", borderRadius: 8, fontSize: 13, color: "var(--orange)" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h3>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Question</label>
            <input value={form.question} onChange={set("question")} style={INPUT} placeholder="What areas do you service?" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Answer</label>
            <textarea rows={3} value={form.answer} onChange={set("answer")} style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div>
              <label style={LABEL}>Category</label>
              <input value={form.category} onChange={set("category")} style={INPUT} placeholder="general" />
            </div>
            <div>
              <label style={LABEL}>Display Order</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))} style={INPUT} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Active (visible on site)</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "var(--navy)", color: "var(--text-heading)", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 50, background: "var(--bg-surface)", borderRadius: 8, marginBottom: 10, opacity: 1 - i * 0.2 }} />
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>No FAQs yet</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(92,103,149,0.2)", background: "var(--bg-surface)" }}>
                {["Question", "Category", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid rgba(92,103,149,0.2)" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-heading)", fontWeight: 600, maxWidth: 360 }}>{f.question}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>{f.category}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: f.is_active ? "rgba(52,199,138,0.1)" : "rgba(92,103,149,0.1)", color: f.is_active ? "var(--green)" : "var(--text-muted)" }}>
                      {f.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(f)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 11, cursor: "pointer" }}>Edit</button>
                      <button disabled={busyId === f.id} onClick={() => handleToggleActive(f)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: f.is_active ? "rgba(244,196,48,0.12)" : "rgba(52,199,138,0.1)", color: f.is_active ? "var(--gold)" : "var(--green)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        {f.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button disabled={busyId === f.id} onClick={() => handleDelete(f.id)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--orange)", fontSize: 11, cursor: "pointer" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
