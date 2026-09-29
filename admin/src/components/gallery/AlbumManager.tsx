"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Album, updateAlbum, deleteAlbum, getAlbumPhotos, createGalleryItem, updateGalleryItem,
  deleteGalleryItem, reorderAlbumPhotos, uploadGalleryImage,
} from "@/lib/adminApi";

export const CATEGORIES = ["products", "events", "factory", "team", "awards", "customers"];

export const INPUT: React.CSSProperties = {
  width: "100%", background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.3)",
  borderRadius: 8, padding: "9px 12px", color: "var(--text-heading)",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
export const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
};
export const PRIMARY_BTN: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0D518C, #0EA5E9)",
  color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const GHOST_BTN: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.3)", background: "transparent",
  color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

type Photo = { id: string; title: string; url: string; thumbnail_url: string | null; media_type: string; is_active: boolean; sort_order: number };
type Upload = { key: string; name: string; pct: number; status: "queued" | "uploading" | "done" | "error"; error?: string };

const VALID = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
const CONCURRENCY = 3;

const prettyName = (file: string) => file.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Photo";

export default function AlbumManager({ album: initial, onBack, onChanged }: { album: Album; onBack: () => void; onChanged: () => void }) {
  const [album, setAlbum] = useState<Album>(initial);
  const [form, setForm] = useState({
    title: initial.title, description: initial.description || "", category: initial.category,
    event_date: initial.event_date ? initial.event_date.slice(0, 10) : "", location: initial.location || "",
    is_published: initial.is_published,
  });
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = () =>
    getAlbumPhotos(album.id)
      .then((d) => setPhotos((d as Photo[]) || []))
      .catch((e) => toast.error(e.message || "Failed to load photos"))
      .finally(() => setLoading(false));

  useEffect(() => { loadPhotos(); /* eslint-disable-next-line */ }, [album.id]);

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const updated = await updateAlbum(album.id, {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
        location: form.location.trim() || null,
        is_published: form.is_published,
      });
      setAlbum(updated);
      toast.success("Album saved");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const withPhotos = confirm(`Delete album "${album.title}"?\n\nOK = delete the album AND its ${photos.length} photo(s).\nCancel = go back.`);
    if (!withPhotos) return;
    try {
      await deleteAlbum(album.id, true);
      toast.success("Album deleted");
      onChanged();
      onBack();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  // ── Multi-file upload: 3 at a time, per-file progress ──
  const startUploads = async (files: File[]) => {
    const queue: { file: File; key: string }[] = [];
    const rows: Upload[] = [];
    files.forEach((file, i) => {
      const key = `${Date.now()}-${i}-${file.name}`;
      if (!VALID.includes(file.type)) rows.push({ key, name: file.name, pct: 0, status: "error", error: "Not JPEG/PNG/WebP" });
      else if (file.size > MAX_BYTES) rows.push({ key, name: file.name, pct: 0, status: "error", error: "Over 5 MB" });
      else { rows.push({ key, name: file.name, pct: 0, status: "queued" }); queue.push({ file, key }); }
    });
    if (!rows.length) return;
    setUploads((u) => [...u, ...rows]);

    const patch = (key: string, p: Partial<Upload>) =>
      setUploads((u) => u.map((r) => (r.key === key ? { ...r, ...p } : r)));

    let next = photos.reduce((m, p) => Math.max(m, p.sort_order), -1) + 1;
    const orderFor: Record<string, number> = {};
    queue.forEach((q) => { orderFor[q.key] = next++; });

    let ok = 0;
    const worker = async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        patch(job.key, { status: "uploading" });
        try {
          const url = await uploadGalleryImage(job.file, (pct) => patch(job.key, { pct }));
          await createGalleryItem({
            title: prettyName(job.file.name), url, media_type: "image", category: album.category,
            album_id: album.id, sort_order: orderFor[job.key],
          });
          patch(job.key, { status: "done", pct: 100 });
          ok++;
        } catch (e) {
          patch(job.key, { status: "error", error: e instanceof Error ? e.message : "Failed" });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
    if (ok) {
      toast.success(`${ok} photo${ok > 1 ? "s" : ""} uploaded`);
      await loadPhotos();
      onChanged();
    }
    setTimeout(() => setUploads((u) => u.filter((r) => r.status === "error")), 2500);
  };

  const onFiles = (list: FileList | null) => {
    if (list && list.length) startUploads(Array.from(list));
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Photo actions ──
  const setCover = async (p: Photo) => {
    try {
      setAlbum(await updateAlbum(album.id, { cover_image: p.url }));
      toast.success("Cover updated");
      onChanged();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  const removePhoto = async (p: Photo) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await deleteGalleryItem(p.id);
      setPhotos((prev) => prev.filter((x) => x.id !== p.id));
      if (album.cover_image === p.url) setAlbum(await updateAlbum(album.id, { cover_image: null }));
      onChanged();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  };

  const toggleActive = async (p: Photo) => {
    try {
      await updateGalleryItem(p.id, { is_active: !p.is_active });
      setPhotos((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  const dropOn = async (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = photos.findIndex((p) => p.id === dragId);
    const to = photos.findIndex((p) => p.id === targetId);
    const next = [...photos];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setPhotos(next);
    setDragId(null);
    try { await reorderAlbumPhotos(album.id, next.map((p) => p.id)); }
    catch (e) { toast.error("Reorder failed"); loadPhotos(); }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <button onClick={onBack} style={{ ...GHOST_BTN, padding: "6px 14px", marginBottom: 16 }}>← Back</button>

      <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Album details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>
          <div><label style={LABEL}>Title *</label><input value={form.title} onChange={set("title")} style={INPUT} /></div>
          <div>
            <label style={LABEL}>Category</label>
            <select value={form.category} onChange={set("category")} style={INPUT}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={LABEL}>Date</label><input type="date" value={form.event_date} onChange={set("event_date")} style={INPUT} /></div>
          <div><label style={LABEL}>Location</label><input value={form.location} onChange={set("location")} style={INPUT} placeholder="Bhubaneswar" /></div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>Description</label>
          <textarea rows={2} value={form.description} onChange={set("description")} style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", marginBottom: 18, cursor: "pointer" }}>
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
          Published (visible on the website)
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={save} disabled={saving} style={{ ...PRIMARY_BTN, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save album"}</button>
          <button onClick={remove} style={{ ...GHOST_BTN, color: "var(--red)", borderColor: "rgba(255,92,92,0.35)" }}>Delete album</button>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 12px" }}>
        Photos <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({photos.length})</span>
      </h3>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!dragId) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!dragId) onFiles(e.dataTransfer.files); }}
        style={{
          border: "2px dashed", borderColor: dragOver ? "var(--sky)" : "rgba(92,103,149,0.3)", borderRadius: 12,
          padding: "28px 16px", textAlign: "center", cursor: "pointer", marginBottom: 16,
          background: dragOver ? "var(--bg-card)" : "var(--bg-surface)", transition: "all 0.2s ease",
        }}
      >
        <div style={{ fontSize: 30, marginBottom: 6 }}>📁</div>
        <div style={{ color: "var(--text-heading)", fontSize: 14, fontWeight: 600 }}>Drag & drop photos here, or click to browse</div>
        <div style={{ color: "var(--text-subtle)", fontSize: 12, marginTop: 4 }}>Select many at once · JPEG, PNG or WebP · Max 5 MB each</div>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(e) => onFiles(e.target.files)} style={{ display: "none" }} />
      </div>

      {uploads.length > 0 && (
        <div style={{ marginBottom: 16, display: "grid", gap: 8 }}>
          {uploads.map((u) => (
            <div key={u.key} style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, gap: 8 }}>
                <span style={{ color: "var(--text-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                <span style={{ color: u.status === "error" ? "var(--red)" : u.status === "done" ? "#10B981" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {u.status === "error" ? u.error : u.status === "done" ? "Done ✓" : u.status === "queued" ? "Queued" : `${u.pct}%`}
                </span>
              </div>
              <div style={{ background: "var(--bg-surface)", borderRadius: 999, height: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${u.status === "error" ? 0 : u.pct}%`, background: "linear-gradient(90deg, var(--navy), var(--sky))", transition: "width 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading photos…</div>
      ) : photos.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: 24 }}>No photos yet — upload some above.</div>
      ) : (
        <>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 10px" }}>Drag a photo onto another to reorder.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
            {photos.map((p) => {
              const isCover = album.cover_image === p.url;
              return (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => setDragId(p.id)}
                  onDragEnd={() => setDragId(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); dropOn(p.id); }}
                  style={{
                    background: "var(--bg-card)", borderRadius: 12, overflow: "hidden", cursor: "grab",
                    border: isCover ? "2px solid var(--sky)" : "1px solid rgba(92,103,149,0.2)",
                    opacity: dragId === p.id ? 0.4 : p.is_active ? 1 : 0.55,
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#0C1A2E" }}>
                    <img src={p.thumbnail_url || p.url} alt={p.title} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    {isCover && <span style={{ position: "absolute", top: 6, left: 6, background: "var(--sky)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>COVER</span>}
                    {!p.is_active && <span style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>Hidden</span>}
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: 12, color: "var(--text-heading)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{p.title}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {!isCover && <button onClick={() => setCover(p)} style={{ ...GHOST_BTN, padding: "4px 8px", fontSize: 11 }}>Set cover</button>}
                      <button onClick={() => toggleActive(p)} style={{ ...GHOST_BTN, padding: "4px 8px", fontSize: 11 }}>{p.is_active ? "Hide" : "Show"}</button>
                      <button onClick={() => removePhoto(p)} style={{ ...GHOST_BTN, padding: "4px 8px", fontSize: 11, color: "var(--red)", borderColor: "rgba(255,92,92,0.35)" }}>Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
