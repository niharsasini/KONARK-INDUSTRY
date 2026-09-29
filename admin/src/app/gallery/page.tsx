"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Album, getAllAlbums, createAlbum } from "@/lib/adminApi";
import AlbumManager, { CATEGORIES, INPUT, LABEL, PRIMARY_BTN } from "@/components/gallery/AlbumManager";
import LegacyGalleryManager from "@/components/gallery/LegacyGalleryManager";

type Tab = "albums" | "ungrouped";

const EMOJI: Record<string, string> = { products: "⚡", events: "🎉", factory: "🏭", team: "👥", awards: "🏆", customers: "❤️" };
const CARD: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, overflow: "hidden", cursor: "pointer", textAlign: "left", padding: 0 };

export default function GalleryAdminPage() {
  const [tab, setTab] = useState<Tab>("albums");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null); // null = categories level
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    getAllAlbums()
      .then((a) => { setAlbums(a || []); setError(null); })
      .catch((e) => setError(e.message || "Failed to load albums"))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newTitle.trim() || !category) return;
    setBusy(true);
    try {
      const a = await createAlbum({ title: newTitle.trim(), category });
      setNewTitle("");
      setCreating(false);
      await load();
      setOpenAlbum(a);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create album");
    } finally {
      setBusy(false);
    }
  };

  const inCat = albums.filter((a) => a.category === category);
  const crumbs = ["Gallery", category ? category : null, openAlbum ? openAlbum.title : null].filter(Boolean) as string[];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>Gallery Management</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, textTransform: "capitalize" }}>{tab === "albums" ? crumbs.join("  ›  ") : "Ungrouped items"}</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {([["albums", "Albums"], ["ungrouped", "Ungrouped photos & videos"]] as [Tab, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            border: tab === k ? "none" : "1px solid rgba(92,103,149,0.25)",
            background: tab === k ? "linear-gradient(135deg, #0D518C, #0EA5E9)" : "transparent",
            color: tab === k ? "#fff" : "var(--text-muted)",
          }}>{label}</button>
        ))}
      </div>

      {tab === "ungrouped" ? (
        <LegacyGalleryManager />
      ) : error ? (
        <div style={{ padding: "12px 16px", background: "rgba(255,92,92,0.08)", border: "1px solid rgba(255,92,92,0.25)", borderRadius: 8, fontSize: 13, color: "var(--red)" }}>{error}</div>
      ) : loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading…</div>
      ) : openAlbum ? (
        <AlbumManager key={openAlbum.id} album={openAlbum} onBack={() => setOpenAlbum(null)} onChanged={load} />
      ) : category === null ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {CATEGORIES.map((c) => {
            const list = albums.filter((a) => a.category === c);
            const photos = list.reduce((n, a) => n + a.photo_count, 0);
            return (
              <button key={c} onClick={() => setCategory(c)} style={{ ...CARD, padding: 20 }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{EMOJI[c]}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", textTransform: "capitalize" }}>{c}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{list.length} album{list.length === 1 ? "" : "s"} · {photos} photo{photos === 1 ? "" : "s"}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => setCategory(null)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.3)", background: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>← Categories</button>
            <button onClick={() => setCreating((v) => !v)} style={PRIMARY_BTN}>+ New album</button>
          </div>

          {creating && (
            <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <label style={LABEL}>Album title</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} placeholder="e.g. Diwali Celebration 2025" style={{ ...INPUT, flex: 1, minWidth: 220 }} />
                <button onClick={create} disabled={busy || !newTitle.trim()} style={{ ...PRIMARY_BTN, opacity: busy || !newTitle.trim() ? 0.6 : 1 }}>Create</button>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "8px 0 0" }}>You can add description, date, location and photos next.</p>
            </div>
          )}

          {inCat.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: 32 }}>No albums in this category yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
              {inCat.map((a) => (
                <button key={a.id} onClick={() => setOpenAlbum(a)} style={CARD}>
                  <div style={{ aspectRatio: "4 / 3", background: "#0C1A2E", position: "relative" }}>
                    {a.cover_image ? <img src={a.cover_image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📷</div>}
                    {!a.is_published && <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>Draft</span>}
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>📷 {a.photo_count} photo{a.photo_count === 1 ? "" : "s"}{a.event_date ? ` · ${new Date(a.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
