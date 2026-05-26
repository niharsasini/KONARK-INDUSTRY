"use client";
import { useState } from "react";
import { Plus, X, Check } from "lucide-react";

type Tab = "homepage" | "banner" | "announcements";

type Announcement = {
  id: number; text: string; color: string; active: boolean;
};

const COLORS = ["#00d4ff", "#f97316", "#10b981", "#a78bfa", "#ef4444", "#fbbf24"];

const MARQUEE_DEFAULTS = [
  "Free delivery on orders above ₹5,000",
  "New EV models now available — Book a test ride today",
  "Solar installation service across Odisha",
  "Call us: 9437611129",
];

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("homepage");
  const [saved, setSaved] = useState(false);

  // Homepage state
  const [hero, setHero] = useState({
    headline: "Power Your Future with Konark Industry",
    subtitle: "Odisha's leading EV, solar & industrial energy solutions provider — based in Bhubaneswar.",
  });
  const [marqueeItems, setMarqueeItems] = useState<string[]>(MARQUEE_DEFAULTS);
  const [newMarquee, setNewMarquee] = useState("");
  const [sections, setSections] = useState({ featuredProducts: true, testimonials: true, whyUs: true, stats: true });

  // Banner state
  const [banner, setBanner] = useState({
    headline: "Summer Sale — Up to 20% off on Solar Panels",
    subtitle: "Limited time offer. Valid till 31 May 2026.",
    cta: "Shop Now",
    active: true,
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, text: "New EV model Konark Urban launching June 2026!", color: "#00d4ff", active: true },
    { id: 2, text: "Extended warranty now available on all LFP batteries.", color: "#10b981", active: true },
    { id: 3, text: "Holiday service closure: 15 Jun – Rath Yatra.", color: "#f97316", active: false },
  ]);
  const [newAnnText, setNewAnnText] = useState("");
  const [newAnnColor, setNewAnnColor] = useState("#00d4ff");

  const toast = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addMarquee = () => {
    if (newMarquee.trim()) { setMarqueeItems((m) => [...m, newMarquee.trim()]); setNewMarquee(""); }
  };
  const removeMarquee = (i: number) => setMarqueeItems((m) => m.filter((_, j) => j !== i));

  const addAnnouncement = () => {
    if (newAnnText.trim()) {
      setAnnouncements((a) => [...a, { id: Date.now(), text: newAnnText.trim(), color: newAnnColor, active: true }]);
      setNewAnnText("");
    }
  };
  const removeAnn = (id: number) => setAnnouncements((a) => a.filter((x) => x.id !== id));
  const toggleAnn = (id: number) => setAnnouncements((a) => a.map((x) => x.id === id ? { ...x, active: !x.active } : x));

  const TABS: { key: Tab; label: string }[] = [
    { key: "homepage", label: "Homepage Editor" },
    { key: "banner", label: "Products Banner" },
    { key: "announcements", label: "Announcements" },
  ];

  const INPUT: React.CSSProperties = { width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Content Management</h1>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            <Check size={14} /> Saved!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid #1e2d40", paddingBottom: 0 }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: tab === key ? "2px solid #00d4ff" : "2px solid transparent", color: tab === key ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", marginBottom: -1 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "homepage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Hero Section</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Headline</label>
                <input value={hero.headline} onChange={(e) => setHero((h) => ({ ...h, headline: e.target.value }))} style={INPUT} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Subtitle</label>
                <textarea value={hero.subtitle} onChange={(e) => setHero((h) => ({ ...h, subtitle: e.target.value }))} rows={2} style={{ ...INPUT, resize: "none" }} />
              </div>
            </div>
            <div style={{ marginTop: 14, padding: 16, background: "rgba(0,212,255,0.03)", border: "1px solid #1e2d40", borderRadius: 10 }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px", fontWeight: 600 }}>PREVIEW</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>{hero.headline || "—"}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{hero.subtitle || "—"}</p>
            </div>
          </div>

          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Marquee Items</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {marqueeItems.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{item}</span>
                  <button onClick={() => removeMarquee(i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}><X size={14} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={newMarquee} onChange={(e) => setNewMarquee(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMarquee()} placeholder="Add marquee item..." style={{ ...INPUT, flex: 1 }} />
              <button onClick={addMarquee} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Section Visibility</h3>
            {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #1e2d4050" }}>
                <span style={{ fontSize: 13, color: "#94a3b8", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, " $1")}</span>
                <button onClick={() => setSections((s) => ({ ...s, [key]: !s[key] }))}
                  style={{ width: 42, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: sections[key] ? "#00d4ff" : "#1e2d40", position: "relative", transition: "background 0.2s" }}>
                  <span style={{ position: "absolute", top: 3, left: sections[key] ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={toast} style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 14, fontWeight: 800, cursor: "pointer", alignSelf: "flex-start" }}>
            Save Homepage Settings
          </button>
        </div>
      )}

      {tab === "banner" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Products Banner</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "headline" as const, label: "Banner Headline" },
                { key: "subtitle" as const, label: "Subtitle" },
                { key: "cta" as const, label: "CTA Button Text" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>{label}</label>
                  <input value={banner[key]} onChange={(e) => setBanner((b) => ({ ...b, [key]: e.target.value }))} style={INPUT} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Banner Active</span>
                <button onClick={() => setBanner((b) => ({ ...b, active: !b.active }))}
                  style={{ width: 42, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: banner.active ? "#00d4ff" : "#1e2d40", position: "relative", transition: "background 0.2s" }}>
                  <span style={{ position: "absolute", top: 3, left: banner.active ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: 20, background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 10px", fontWeight: 600 }}>PREVIEW</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>{banner.headline || "—"}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>{banner.subtitle || "—"}</p>
              <span style={{ display: "inline-block", padding: "8px 18px", background: "#00d4ff", color: "#0a0f1e", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{banner.cta || "CTA"}</span>
            </div>
          </div>
          <button onClick={toast} style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 14, fontWeight: 800, cursor: "pointer", alignSelf: "flex-start" }}>
            Save Banner
          </button>
        </div>
      )}

      {tab === "announcements" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 18px" }}>Active Announcements</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {announcements.map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#0f172a", border: `1px solid ${a.color}30`, borderRadius: 10, opacity: a.active ? 1 : 0.4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: "#f1f5f9" }}>{a.text}</span>
                  <button onClick={() => toggleAnn(a.id)}
                    style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${a.active ? a.color : "#1e2d40"}`, background: "transparent", color: a.active ? a.color : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {a.active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => removeAnn(a.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}><X size={14} /></button>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "0 0 14px" }}>Add New Announcement</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea value={newAnnText} onChange={(e) => setNewAnnText(e.target.value)} rows={2} placeholder="Announcement text..." style={{ ...INPUT, resize: "none" }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Color</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setNewAnnColor(c)}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: newAnnColor === c ? `3px solid #fff` : "3px solid transparent", cursor: "pointer" }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)", border: `1px solid ${newAnnColor}40`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: newAnnColor }} />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{newAnnText || "Preview will appear here..."}</span>
              </div>
              <button onClick={addAnnouncement} style={{ padding: "10px 20px", borderRadius: 9, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, alignSelf: "flex-start" }}>
                <Plus size={14} /> Add Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
