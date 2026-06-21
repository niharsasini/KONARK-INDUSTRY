"use client";
import { useState, useEffect, useCallback } from "react";
import { Save, Check, Plus, X, Eye, EyeOff } from "lucide-react";
import { getSettings, updateSettings, changePassword } from "@/lib/adminApi";

const IS: React.CSSProperties = {
  width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40",
  borderRadius: 8, padding: "11px 14px", color: "#f1f5f9",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
const LS: React.CSSProperties = {
  fontSize: 11, color: "#94a3b8", display: "block",
  marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
};

const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "#00d4ff");
const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "#1e2d40");

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
type DayHours = { open: boolean; from: string; to: string };

const DEFAULT_HOURS: Record<string, DayHours> = {
  Monday: { open: true, from: "09:00", to: "18:00" },
  Tuesday: { open: true, from: "09:00", to: "18:00" },
  Wednesday: { open: true, from: "09:00", to: "18:00" },
  Thursday: { open: true, from: "09:00", to: "18:00" },
  Friday: { open: true, from: "09:00", to: "18:00" },
  Saturday: { open: true, from: "10:00", to: "16:00" },
  Sunday: { open: false, from: "10:00", to: "14:00" },
};

const DEFAULT_COMPANY = {
  name: "Konark Industry",
  address: "Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002",
  phone: "+91 94376 11129",
  email: "konarkindustrie@gmail.com",
  about: "Konark Industry is a Bhubaneswar-based manufacturer of electric vehicles, home appliances, and industrial equipment. Trusted by 25,000+ customers across India.",
  instagram: "",
  linkedin: "",
  youtube: "",
};

const DEFAULT_AREAS = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Berhampur", "Sambalpur"];

export default function SettingsPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<{ section: string; message: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [hours, setHours] = useState<Record<string, DayHours>>(DEFAULT_HOURS);
  const [areas, setAreas] = useState<string[]>(DEFAULT_AREAS);
  const [newArea, setNewArea] = useState("");
  const [notifs, setNotifs] = useState({ newEnquiry: true, newBooking: true, newOrder: true, dailySummary: false, weeklyReport: true });
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState<Record<"current" | "newPw" | "confirm", boolean>>({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [technicians, setTechnicians] = useState<string[]>([
    "Ramesh Kumar",
    "Bikash Patel",
    "Sanjay Nayak",
    "Dilip Sahoo",
  ]);
  const [newTechnician, setNewTechnician] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      const data = await getSettings() as Record<string, unknown>;
      setCompany({
        name: (data.company_name as string) ?? DEFAULT_COMPANY.name,
        address: (data.company_address as string) ?? DEFAULT_COMPANY.address,
        phone: (data.company_phone as string) ?? DEFAULT_COMPANY.phone,
        email: (data.company_email as string) ?? DEFAULT_COMPANY.email,
        about: (data.company_about as string) ?? DEFAULT_COMPANY.about,
        instagram: (data.instagram_url as string) ?? "",
        linkedin: (data.linkedin_url as string) ?? "",
        youtube: (data.youtube_url as string) ?? "",
      });
      if (data.business_hours && Object.keys(data.business_hours as object).length > 0) {
        setHours({ ...DEFAULT_HOURS, ...(data.business_hours as Record<string, DayHours>) });
      }
      if (Array.isArray(data.service_areas)) setAreas(data.service_areas as string[]);
      setNotifs({
        newEnquiry: (data.notify_admin_on_enquiry as boolean) ?? true,
        newBooking: (data.notify_admin_on_booking as boolean) ?? true,
        newOrder: (data.notify_admin_on_order as boolean) ?? true,
        dailySummary: (data.notify_daily_summary as boolean) ?? false,
        weeklyReport: (data.notify_weekly_report as boolean) ?? true,
      });
      if (Array.isArray(data.technicians)) setTechnicians(data.technicians as string[]);
    } catch {
      setLoadError("Using local defaults — backend settings not loaded.");
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const toast = (section: string) => { setSaveError(null); setSaved(section); setTimeout(() => setSaved(null), 2500); };
  const toastError = (section: string, err: unknown) => {
    setSaved(null);
    setSaveError({ section, message: err instanceof Error ? err.message : "Failed to save. Please try again." });
    setTimeout(() => setSaveError(null), 4000);
  };

  const saveCompany = async () => {
    try {
      await updateSettings({
        company_name: company.name,
        company_address: company.address,
        company_phone: company.phone,
        company_email: company.email,
        company_about: company.about,
        instagram_url: company.instagram,
        linkedin_url: company.linkedin,
        youtube_url: company.youtube,
      });
      toast("company");
    } catch (err) {
      toastError("company", err);
    }
  };

  const saveHours = async () => {
    try {
      await updateSettings({ business_hours: hours });
      toast("hours");
    } catch (err) {
      toastError("hours", err);
    }
  };

  const saveAreas = async () => {
    try {
      await updateSettings({ service_areas: areas });
      toast("areas");
    } catch (err) {
      toastError("areas", err);
    }
  };

  const saveNotifications = async () => {
    try {
      await updateSettings({
        notify_admin_on_enquiry: notifs.newEnquiry,
        notify_admin_on_booking: notifs.newBooking,
        notify_admin_on_order: notifs.newOrder,
        notify_daily_summary: notifs.dailySummary,
        notify_weekly_report: notifs.weeklyReport,
      });
      toast("notifs");
    } catch (err) {
      toastError("notifs", err);
    }
  };

  const setC = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCompany((s) => ({ ...s, [k]: e.target.value }));

  const setHour = (day: string, patch: Partial<DayHours>) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], ...patch } }));

  const addArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas((a) => [...a, newArea.trim()]);
      setNewArea("");
    }
  };
  const removeArea = (a: string) => setAreas((arr) => arr.filter((x) => x !== a));

  const toggleNotif = (k: keyof typeof notifs) => setNotifs((n) => ({ ...n, [k]: !n[k] }));

  const addTechnician = () => {
    if (newTechnician.trim() && !technicians.includes(newTechnician.trim())) {
      setTechnicians((t) => [...t, newTechnician.trim()]);
      setNewTechnician("");
    }
  };
  const removeTechnician = (name: string) => setTechnicians((t) => t.filter((x) => x !== name));
  const saveTechnicians = async () => {
    try {
      await updateSettings({ technicians });
      toast("technicians");
    } catch (err) {
      toastError("technicians", err);
    }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (pw.newPw !== pw.confirm) { setPwError("Passwords do not match."); return; }
    setPwError("");
    setPwLoading(true);
    try {
      await changePassword(pw.current, pw.newPw);
      setPw({ current: "", newPw: "", confirm: "" });
      toast("password");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button onClick={toggle} type="button"
      style={{ width: 42, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: on ? "#00d4ff" : "#1e2d40", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, left: on ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </button>
  );

  const SavedBadge = ({ section }: { section: string }) => {
    if (saveError?.section === section) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
          <X size={13} /> {saveError.message}
        </div>
      );
    }
    if (saved === section) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontSize: 12, color: "#10b981", fontWeight: 600 }}>
          <Check size={13} /> Saved!
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 32px" }}>Settings</h1>

      {loadError && (
        <div style={{ padding: "10px 16px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 8, marginBottom: 20, fontSize: 12, color: "#f97316" }}>
          {loadError}
        </div>
      )}

      {/* COMPANY INFO */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Company Information</h2>
          <SavedBadge section="company" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={LS}>Company Name</label>
            <input value={company.name} onChange={setC("name")} style={IS} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={LS}>Address</label>
            <input value={company.address} onChange={setC("address")} style={IS} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={LS}>Phone</label>
            <input value={company.phone} onChange={setC("phone")} style={IS} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={LS}>Email</label>
            <input type="email" value={company.email} onChange={setC("email")} style={IS} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={LS}>About Text</label>
            <textarea rows={3} value={company.about} onChange={setC("about")} style={{ ...IS, resize: "vertical", fontFamily: "inherit" }} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          {[{ k: "instagram", l: "Instagram URL" }, { k: "linkedin", l: "LinkedIn URL" }, { k: "youtube", l: "YouTube URL" }].map(({ k, l }) => (
            <div key={k}>
              <label style={LS}>{l}</label>
              <input value={(company as Record<string, string>)[k]} onChange={setC(k)} placeholder="https://..." style={IS} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
          ))}
        </div>
        <button onClick={saveCompany}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 9, border: "none", cursor: "pointer", marginTop: 20 }}>
          <Save size={14} /> Save Company Info
        </button>
      </div>

      {/* BUSINESS HOURS */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Business Hours</h2>
          <SavedBadge section="hours" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DAYS.map((day) => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: "1px solid #1e2d4050" }}>
              <Toggle on={hours[day]?.open ?? false} toggle={() => setHour(day, { open: !hours[day]?.open })} />
              <span style={{ fontSize: 13, color: hours[day]?.open ? "#f1f5f9" : "#475569", width: 96, fontWeight: 500 }}>{day}</span>
              {hours[day]?.open ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="time" value={hours[day]?.from ?? "09:00"} onChange={(e) => setHour(day, { from: e.target.value })}
                    style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 6, padding: "6px 10px", color: "#f1f5f9", fontSize: 12, outline: "none" }} />
                  <span style={{ color: "#64748b", fontSize: 12 }}>to</span>
                  <input type="time" value={hours[day]?.to ?? "18:00"} onChange={(e) => setHour(day, { to: e.target.value })}
                    style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 6, padding: "6px 10px", color: "#f1f5f9", fontSize: 12, outline: "none" }} />
                </div>
              ) : (
                <span style={{ fontSize: 12, color: "#475569" }}>Closed</span>
              )}
            </div>
          ))}
        </div>
        <button onClick={saveHours}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 9, border: "none", cursor: "pointer", marginTop: 20 }}>
          <Save size={14} /> Save Hours
        </button>
      </div>

      {/* SERVICE AREAS */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Service Areas</h2>
          <SavedBadge section="areas" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {areas.map((a) => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 100, fontSize: 13, color: "#00d4ff", fontWeight: 600 }}>
              {a}
              <button onClick={() => removeArea(a)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 0 }}><X size={12} /></button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newArea} onChange={(e) => setNewArea(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addArea()} placeholder="Add city..." style={{ ...IS, flex: 1 }} onFocus={focusBorder} onBlur={blurBorder} />
          <button onClick={addArea} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Add
          </button>
        </div>
        <button onClick={saveAreas}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 9, border: "none", cursor: "pointer", marginTop: 16 }}>
          <Save size={14} /> Save Areas
        </button>
      </div>

      {/* NOTIFICATIONS */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Notification Settings</h2>
          <SavedBadge section="notifs" />
        </div>
        {([
          ["newEnquiry", "New Enquiry Alert"],
          ["newBooking", "New Service Booking Alert"],
          ["newOrder", "New Order Alert"],
          ["dailySummary", "Daily Summary Email"],
          ["weeklyReport", "Weekly Report Email"],
        ] as [keyof typeof notifs, string][]).map(([key, label]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1e2d4050" }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{label}</span>
            <Toggle on={notifs[key]} toggle={() => toggleNotif(key)} />
          </div>
        ))}
        <button onClick={saveNotifications}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 9, border: "none", cursor: "pointer", marginTop: 20 }}>
          <Save size={14} /> Save Notifications
        </button>
      </div>

      {/* TECHNICIANS */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Technicians</h2>
          <SavedBadge section="technicians" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {technicians.map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 100, fontSize: 13, color: "#00d4ff", fontWeight: 600 }}>
              {t}
              <button onClick={() => removeTechnician(t)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 0 }}><X size={12} /></button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newTechnician} onChange={(e) => setNewTechnician(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTechnician()} placeholder="Add technician name..." style={{ ...IS, flex: 1 }} onFocus={focusBorder} onBlur={blurBorder} />
          <button onClick={addTechnician} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Add
          </button>
        </div>
        <button onClick={saveTechnicians}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 9, border: "none", cursor: "pointer", marginTop: 16 }}>
          <Save size={14} /> Save Technicians
        </button>
      </div>

      {/* CHANGE PASSWORD */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Change Admin Password</h2>
          <SavedBadge section="password" />
        </div>
        {pwError && (
          <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#ef4444" }}>{pwError}</div>
        )}
        <form onSubmit={changePw} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(["current", "newPw", "confirm"] as const).map((key, i) => {
            const labels = ["Current Password", "New Password", "Confirm New Password"];
            return (
              <div key={key}>
                <label style={LS}>{labels[i]}</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw[key] ? "text" : "password"} value={pw[key]}
                    onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder="••••••••" style={{ ...IS, paddingRight: 44 }} onFocus={focusBorder} onBlur={blurBorder} />
                  <button type="button" onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}>
                    {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
          <button type="submit" disabled={pwLoading}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: pwLoading ? "#1e2d40" : "#00d4ff", color: pwLoading ? "#94a3b8" : "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 9, border: "none", cursor: pwLoading ? "not-allowed" : "pointer", alignSelf: "flex-start" }}>
            <Save size={14} /> {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
