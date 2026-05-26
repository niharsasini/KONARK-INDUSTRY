"use client";
import { useState } from "react";
import { Save, Check } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
  borderRadius: 8, padding: "11px 14px", color: "#f1f5f9",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: "#94a3b8", display: "block",
  marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Konark Industry",
    address: "Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002",
    phone: "+91 94376 11129",
    email: "konarkindustrie@gmail.com",
    about: "Konark Industry is a Bhubaneswar-based manufacturer of electric vehicles, home appliances, and industrial equipment. Trusted by 25,000+ customers across India.",
    instagram: "",
    linkedin: "",
    youtube: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((s) => ({ ...s, [key]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#00d4ff");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#1e2d40");

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Site Settings</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Manage company info and social links</p>
      </div>

      {saved && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Company Info */}
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Company Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Company Name</label>
              <input value={settings.companyName} onChange={set("companyName")} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Address</label>
              <input value={settings.address} onChange={set("address")} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={settings.phone} onChange={set("phone")} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={settings.email} onChange={set("email")} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>About Text</label>
              <textarea rows={4} value={settings.about} onChange={set("about")} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Social Links</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "instagram", label: "Instagram URL", icon: "📷" },
              { key: "linkedin", label: "LinkedIn URL", icon: "💼" },
              { key: "youtube", label: "YouTube URL", icon: "▶️" },
            ].map(({ key, label, icon }) => (
              <div key={key}>
                <label style={labelStyle}>{icon} {label}</label>
                <input
                  value={(settings as any)[key]}
                  onChange={set(key)}
                  placeholder="https://..."
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 32px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
            <Save size={15} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
