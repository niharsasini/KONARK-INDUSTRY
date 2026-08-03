"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/adminApi";

type Settings = {
  company_phone: string;
  hero_tagline: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
  hero_rotating_words: string;
  footer_tagline: string | null;
  announcement_banner_enabled: boolean;
  announcement_banner_text: string;
  announcement_banner_link: string;
  announcement_banner_emoji: string;
  announcement_banner_type: string;
  whatsapp_message_template: string;
  stats_customers: string;
  stats_cities: string;
  stats_rating: string;
  stats_satisfaction: string;
  founding_year: number;
  hidden_certifications: string[];
};

const CERTIFICATIONS = [
  { id: "1", title: "Startup India" },
  { id: "2", title: "Startup Odisha" },
  { id: "3", title: "Udyam MSME Registration" },
  { id: "4", title: "Importer-Exporter Code" },
  { id: "5", title: "Trade Mark Registration" },
];

const BANNER_TYPES = [
  { value: "announcement", label: "Announcement" },
  { value: "new_product", label: "New Product" },
  { value: "offer", label: "Special Offer" },
  { value: "event", label: "Event" },
  { value: "alert", label: "Alert / Important" },
];

const INPUT: React.CSSProperties = {
  width: "100%", background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.3)",
  borderRadius: 8, padding: "10px 14px", color: "var(--text-heading)",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
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
        const rawWords = s.hero_rotating_words;
        const wordsStr = Array.isArray(rawWords) ? (rawWords as string[]).join(", ") : ((rawWords as string) || "Konark., Innovation., Sustainability., Odisha.");
        setForm({
          company_phone: (s.company_phone as string) || "",
          hero_tagline: (s.hero_tagline as string) || "",
          hero_heading: (s.hero_heading as string) || "",
          hero_subheading: (s.hero_subheading as string) || "",
          hero_rotating_words: wordsStr,
          footer_tagline: (s.footer_tagline as string) || "",
          announcement_banner_enabled: Boolean(s.announcement_banner_enabled),
          announcement_banner_text: (s.announcement_banner_text as string) || "",
          announcement_banner_link: (s.announcement_banner_link as string) || "",
          announcement_banner_emoji: (s.announcement_banner_emoji as string) || "🎉",
          announcement_banner_type: (s.announcement_banner_type as string) || "announcement",
          whatsapp_message_template: (s.whatsapp_message_template as string) || "",
          stats_customers: (s.stats_customers as string) || "25,000+",
          stats_cities: (s.stats_cities as string) || "18+",
          stats_rating: (s.stats_rating as string) || "4.8★",
          stats_satisfaction: (s.stats_satisfaction as string) || "99%",
          founding_year: (s.founding_year as number) || 2014,
          hidden_certifications: Array.isArray(s.hidden_certifications) ? (s.hidden_certifications as string[]) : [],
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

  const setFoundingYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value, 10);
    setForm((f) => (f ? { ...f, founding_year: Number.isNaN(year) ? f.founding_year : year } : f));
  };

  const toggleCertification = (id: string) =>
    setForm((f) => {
      if (!f) return f;
      const hidden = f.hidden_certifications.includes(id)
        ? f.hidden_certifications.filter((c) => c !== id)
        : [...f.hidden_certifications, id];
      return { ...f, hidden_certifications: hidden };
    });

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        hero_rotating_words: form.hero_rotating_words
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean),
      };
      await updateSettings(payload);
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
          <div key={i} style={{ height: 70, background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, marginBottom: 16, opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    );
  }

  if (error && !form) {
    return (
      <div style={{ padding: "32px 40px" }}>
        <div style={{ background: "rgba(255,92,92,0.06)", border: "1px solid rgba(255,92,92,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--red)", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchSettings} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "var(--navy)", color: "var(--text-heading)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>Content Management</h1>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: "rgba(52,199,138,0.1)", border: "1px solid rgba(52,199,138,0.3)", borderRadius: 8, fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
            <Check size={14} /> Saved!
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: 20, background: "rgba(255,92,92,0.08)", border: "1px solid rgba(255,92,92,0.25)", borderRadius: 8, fontSize: 13, color: "var(--red)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Announcement Banner</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Show banner on site</span>
            <button
              onClick={() => setForm((f) => (f ? { ...f, announcement_banner_enabled: !f.announcement_banner_enabled } : f))}
              style={{ width: 42, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: form.announcement_banner_enabled ? "var(--navy)" : "rgba(92,103,149,0.2)", position: "relative", transition: "background 0.2s" }}
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
                  border: `1px solid ${form.announcement_banner_type === t.value ? "var(--navy)" : "rgba(92,103,149,0.2)"}`,
                  background: form.announcement_banner_type === t.value ? "rgba(13,81,140,0.1)" : "transparent",
                  color: form.announcement_banner_type === t.value ? "var(--navy)" : "var(--text-muted)",
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

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Hero Content</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Tagline (small badge text)</label>
            <input value={form.hero_tagline || ""} onChange={set("hero_tagline")} placeholder="Powering Odisha since 2014" style={INPUT} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Heading (optional override)</label>
            <textarea rows={2} value={form.hero_heading || ""} onChange={set("hero_heading")} placeholder={"Power Your\nWorld With"} style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
            <p style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 6 }}>Shown as two lines above the rotating word. Put a line break where you want the heading to wrap.</p>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Subheading / Description</label>
            <textarea rows={3} value={form.hero_subheading || ""} onChange={set("hero_subheading")} placeholder="We make electric scooters, e-rickshaws, and batteries in Bhubaneswar..." style={{ ...INPUT, resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={LABEL}>Rotating Words (comma-separated)</label>
            <input value={form.hero_rotating_words} onChange={set("hero_rotating_words")} placeholder="Konark., Innovation., Sustainability., Odisha." style={INPUT} />
            <p style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 6 }}>These words cycle in the animated hero headline. Separate with commas.</p>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Homepage Stats</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={LABEL}>Customers</label>
              <input value={form.stats_customers} onChange={set("stats_customers")} placeholder="25,000+" style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>Cities Covered</label>
              <input value={form.stats_cities} onChange={set("stats_cities")} placeholder="18+" style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>Satisfaction Rate</label>
              <input value={form.stats_satisfaction} onChange={set("stats_satisfaction")} placeholder="99%" style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>Founding Year</label>
              <input type="number" value={form.founding_year} onChange={setFoundingYear} placeholder="2014" style={INPUT} />
            </div>
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(13,81,140,0.06)", border: "1px solid rgba(13,81,140,0.15)", borderRadius: 8, marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
              ⚡ &quot;Years of experience&quot; is calculated automatically from the founding year above. Average rating and product count are calculated automatically from your approved reviews and active products.
            </p>
          </div>
          <label style={LABEL}>Average Rating (fallback, used only until you have approved reviews)</label>
          <input value={form.stats_rating} onChange={set("stats_rating")} placeholder="4.8★" style={INPUT} />
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Certifications</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
            Choose which government certification badges appear in the homepage Certifications section.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CERTIFICATIONS.map((cert) => {
              const visible = !form.hidden_certifications.includes(cert.id);
              return (
                <div key={cert.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ fontSize: 13, color: "var(--text-heading)" }}>{cert.title}</span>
                  <button
                    onClick={() => toggleCertification(cert.id)}
                    style={{ width: 42, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: visible ? "var(--navy)" : "rgba(92,103,149,0.2)", position: "relative", transition: "background 0.2s" }}
                  >
                    <span style={{ position: "absolute", top: 3, left: visible ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 12px" }}>Featured Products (Hero Carousel)</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 14px", lineHeight: 1.6 }}>
            The products shown in the homepage hero card deck are controlled from the Products page — mark up to 5 products as featured there.
          </p>
          <Link
            href="/products"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.3)", color: "var(--text-heading)", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
          >
            <Star size={14} /> Go to Products
          </Link>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Footer</h3>
          <label style={LABEL}>Footer Tagline</label>
          <input value={form.footer_tagline || ""} onChange={set("footer_tagline")} placeholder="Odisha's leading EV & energy brand" style={INPUT} />
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 18px" }}>Contact &amp; WhatsApp</h3>
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
          style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "var(--navy)", color: "var(--text-heading)", fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", alignSelf: "flex-start", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
