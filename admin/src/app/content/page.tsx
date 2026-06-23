"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/adminApi";

type Settings = {
  company_phone: string;
  hero_tagline: string | null;
  footer_tagline: string | null;
  announcement_banner_enabled: boolean;
  announcement_banner_text: string;
  announcement_banner_link: string;
  announcement_banner_emoji: string;
  announcement_banner_type: string;
  whatsapp_message_template: string;
};

const BANNER_TYPES = [
  { value: "announcement", label: "Announcement" },
  { value: "new_product", label: "New Product" },
  { value: "offer", label: "Special Offer" },
  { value: "event", label: "Event" },
  { value: "alert", label: "Alert / Important" },
];

const INPUT: React.CSSProperties = {
  width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
  borderRadius: 8, padding: "10px 14px", color: "#f1f5f9",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8",
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7,
};

export default function ContentPage() {
  const [form, setForm] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = () => {
    setLoading(true);
    setError(null);
    getSettings()
      .then((data) => {
        const s = data as Record<string, unknown>;
        setForm({
          company_phone: (s.company_phone as string) || "",
          hero_tagline: (s.hero_tagline as string) || "",
          footer_tagline: (s.footer_tagline as string) || "",
          announcement_banner_enabled: Boolean(s.announcement_banner_enabled),
          announcement_banner_text: (s.announcement_banner_text as string) || "",
          announcement_banner_link: (s.announcement_banner_link as string) || "",
          announcement_banner_emoji: (s.announcement_banner_emoji as string) || "🎉",
          announcement_banner_type: (s.announcement_banner_type as string) || "announcement",
          whatsapp_message_template: (s.whatsapp_message_template as string) || "",
        });
      })
      .catch((err) => setError(err.message || "Failed to load settings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const set = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => (f ? { ...f, [key]: e.target.value } : f));

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await updateSettings({ ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 700 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 70, background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, marginBottom: 16, opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    );
  }

  if (error && !form) {
    return (
      <div style={{ padding: "32px 40px" }}>
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchSettings} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 700 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Content Management</h1>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            <Check size={14} /> Saved!
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, fontSize: 13, color: "#ef4444" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Announcement Banner</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Show banner on site</span>
            <button
              onClick={() => setForm((f) => (f ? { ...f, announcement_banner_enabled: !f.announcement_banner_enabled } : f))}
              style={{ width: 42, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: form.announcement_banner_enabled ? "#00d4ff" : "#1e2d40", position: "relative", transition: "background 0.2s" }}
            >
              <span style={{ position: "absolute", top: 3, left: form.announcement_banner_enabled ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </button>
          </div>
          <label style={LABEL}>Banner Type</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {BANNER_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setForm((f) => (f ? { ...f, announcement_banner_type: t.value } : f))}
                style={{
                  padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: `1px solid ${form.announcement_banner_type === t.value ? "#00d4ff" : "#1e2d40"}`,
                  background: form.announcement_banner_type === t.value ? "rgba(0,212,255,0.1)" : "transparent",
                  color: form.announcement_banner_type === t.value ? "#00d4ff" : "#94a3b8",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <label style={LABEL}>Banner Text</label>
          <input value={form.announcement_banner_text} onChange={set("announcement_banner_text")} placeholder="e.g. Free delivery on orders above ₹5,000" style={{ ...INPUT, marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: "0 0 90px" }}>
              <label style={LABEL}>Emoji</label>
              <input value={form.announcement_banner_emoji} onChange={set("announcement_banner_emoji")} placeholder="🎉" style={INPUT} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>Banner Link (optional)</label>
              <input value={form.announcement_banner_link} onChange={set("announcement_banner_link")} placeholder="/products" style={INPUT} />
            </div>
          </div>
        </div>

        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Homepage</h3>
          <label style={LABEL}>Hero Tagline</label>
          <input value={form.hero_tagline || ""} onChange={set("hero_tagline")} placeholder="Powering Odisha's Green Future" style={INPUT} />
        </div>

        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Footer</h3>
          <label style={LABEL}>Footer Tagline</label>
          <input value={form.footer_tagline || ""} onChange={set("footer_tagline")} placeholder="Odisha's leading EV & energy brand" style={INPUT} />
        </div>

        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Contact &amp; WhatsApp</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Company Phone Number</label>
            <input value={form.company_phone} onChange={set("company_phone")} placeholder="+919437611129" style={INPUT} />
          </div>
          <div>
            <label style={LABEL}>WhatsApp Message Template</label>
            <textarea rows={2} value={form.whatsapp_message_template} onChange={set("whatsapp_message_template")} placeholder="Hi Konark Industry, I have a query" style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", alignSelf: "flex-start", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
