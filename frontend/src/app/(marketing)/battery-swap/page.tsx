"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const CITIES = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Berhampur", "Sambalpur", "Balasore", "Other"];
const CAPACITIES = ["48V 20Ah", "48V 30Ah", "48V 50Ah", "48V 100Ah", "60V 30Ah", "72V 30Ah", "72V 50Ah", "72V 100Ah", "Other"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2015 + i);
const BATTERY_TYPES = [
  { value: "LFP", label: "LFP", sub: "Lithium Iron Phosphate", icon: "🔋" },
  { value: "Lead Acid", label: "Lead Acid", sub: "Standard lead battery", icon: "⚡" },
  { value: "NMC", label: "NMC", sub: "Lithium NMC", icon: "💡" },
  { value: "Not Sure", label: "Not Sure", sub: "We'll identify it", icon: "❓" },
];
const CONDITIONS = [
  { value: "Good", label: "Good", sub: "Charges and runs normally", icon: "✅" },
  { value: "Fair", label: "Fair", sub: "Some reduction in range", icon: "⚠️" },
  { value: "Poor", label: "Poor", sub: "Significant issues", icon: "❌" },
];
const TIME_SLOTS = [
  { value: "Morning 9-12", label: "Morning", time: "9:00 AM – 12:00 PM", icon: "🌅" },
  { value: "Afternoon 12-4", label: "Afternoon", time: "12:00 PM – 4:00 PM", icon: "☀️" },
  { value: "Evening 4-7", label: "Evening", time: "4:00 PM – 7:00 PM", icon: "🌆" },
];
// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Your Details", "Battery Info", "Schedule", "Confirm"];
  return (
    <>
      {/* Desktop step bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, gap: 0 }} className="step-bar-desktop">
        {steps.map((label, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 700, fontSize: 14,
                  background: done ? "#10b981" : active ? "#00d4ff" : "#1e2d40",
                  color: done || active ? "#0a0f1e" : "#64748b",
                  border: active ? "2px solid #00d4ff" : done ? "2px solid #10b981" : "2px solid #1e2d40",
                  boxShadow: active ? "0 0 12px rgba(0,212,255,0.4)" : "none",
                }}>
                  {done ? "✓" : idx}
                </div>
                <span style={{ fontSize: 11, color: active ? "#00d4ff" : done ? "#10b981" : "#64748b", fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 3 && <div style={{ width: 80, height: 2, background: done ? "#10b981" : "#1e2d40", margin: "0 4px", marginBottom: 24 }} />}
            </div>
          );
        })}
      </div>
      {/* Mobile step text */}
      <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginBottom: 24 }} className="step-bar-mobile">
        Step {current} of 4 — <span style={{ color: "#00d4ff" }}>{steps[current - 1]}</span>
      </p>
    </>
  );
}

// ─── Field helpers ─────────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: "100%", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8,
        color: "#f1f5f9", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8,
        color: "#f1f5f9", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", resize: "vertical", transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
    />
  );
}

function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8,
        color: value ? "#f1f5f9" : "#64748b", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", cursor: "pointer",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function BatterySwapPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ token: string; phone: string; email: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Form state ───────────────────────────────────────────────────────────────
  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  // Step 2
  const [batteryBrand, setBatteryBrand] = useState("");
  const [batteryType, setBatteryType] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("");
  const [chargePercent, setChargePercent] = useState(50);
  const [batteryCondition, setBatteryCondition] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [hasPhysicalDamage, setHasPhysicalDamage] = useState(false);
  const [damageDescription, setDamageDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  // Step 3
  const [swapLocation, setSwapLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  // Step 4
  const [termsAgreed, setTermsAgreed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // ── Validation ───────────────────────────────────────────────────────────────

  function validateStep1() {
    if (!name.trim()) return "Please enter your full name";
    if (!/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) return "Please enter a valid 10-digit phone number";
    if (!city) return "Please select your city";
    if (!address.trim() || address.length < 5) return "Please enter your full address";
    return "";
  }

  function validateStep2() {
    if (!batteryBrand.trim()) return "Please enter the battery brand";
    if (!batteryType) return "Please select the battery type";
    if (!batteryCapacity) return "Please select the battery capacity";
    if (!purchaseYear) return "Please select the purchase year";
    if (!batteryCondition) return "Please select the battery condition";
    return "";
  }

  function validateStep3() {
    if (!swapLocation) return "Please select the swap location";
    if (!preferredDate) return "Please select a preferred date";
    if (!timeSlot) return "Please select a time slot";
    return "";
  }

  // ── Photo upload ─────────────────────────────────────────────────────────────

  async function handlePhotoUpload(file: File) {
    setUploadStatus("uploading");
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 20, 80));
      }, 200);

      const res = await fetch(`${BASE_URL}/api/v1/battery-swap/upload-photo`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      setPhotoUrl(data.photo_url);
      setUploadStatus("done");
    } catch (e: unknown) {
      setUploadStatus("error");
      setError(e instanceof Error ? e.message : "Photo upload failed");
    }
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!termsAgreed) { setError("Please agree to the terms before submitting"); return; }
    setSubmitting(true);
    setError("");

    const payload = {
      name, phone, email: email || undefined, city, address,
      battery_brand: batteryBrand,
      battery_capacity: batteryCapacity,
      battery_type: batteryType,
      purchase_year: parseInt(purchaseYear),
      current_charge_percent: chargePercent,
      battery_condition: batteryCondition,
      battery_serial_number: serialNumber || undefined,
      battery_photo_url: photoUrl || undefined,
      any_physical_damage: hasPhysicalDamage,
      damage_description: hasPhysicalDamage ? damageDescription : undefined,
      preferred_date: preferredDate,
      preferred_time_slot: timeSlot,
      swap_location: swapLocation,
      special_instructions: specialInstructions || undefined,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/v1/battery-swap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed");
      setResult({ token: data.token_number, phone, email });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyToken() {
    if (result?.token) {
      navigator.clipboard.writeText(result.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const chargeColor = chargePercent <= 20 ? "#ef4444" : chargePercent <= 50 ? "#f97316" : "#10b981";

  // ═══ SUCCESS STATE ══════════════════════════════════════════════════════════

  if (result) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0f1e", padding: "80px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: "rgba(0,212,255,0.12)",
            border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 24px", boxShadow: "0 0 32px rgba(0,212,255,0.25)",
          }}>✓</div>

          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9", margin: "0 0 8px" }}>Request Submitted! 🎉</h1>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 36 }}>
            We'll call you on <strong style={{ color: "#f1f5f9" }}>{result.phone}</strong> within 2 hours to confirm your slot.
          </p>

          {/* Token card */}
          <div style={{
            background: "#0f172a", border: "2px solid #00d4ff", borderRadius: 16,
            padding: 28, marginBottom: 28, boxShadow: "0 0 32px rgba(0,212,255,0.12)",
          }}>
            <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: "0 0 10px" }}>YOUR SWAP TOKEN</p>
            <p style={{ fontSize: 32, fontWeight: 900, fontFamily: "monospace", color: "#00d4ff", letterSpacing: "0.06em", margin: "0 0 12px" }}>
              {result.token}
            </p>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px" }}>Save this token to track your request</p>
            <button
              onClick={copyToken}
              style={{
                padding: "8px 20px", background: copied ? "#10b981" : "rgba(0,212,255,0.12)",
                border: `1px solid ${copied ? "#10b981" : "#00d4ff"}`, borderRadius: 8,
                color: copied ? "#fff" : "#00d4ff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ Copied!" : "📋 Copy Token"}
            </button>
          </div>

          {result.email && (
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 28 }}>
              📩 Confirmation sent to <span style={{ color: "#94a3b8" }}>{result.email}</span>
            </p>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/battery-swap/track" style={{
              padding: "12px 24px", background: "#00d4ff", color: "#0a0f1e",
              fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none",
            }}>
              Track My Swap →
            </Link>
            <Link href="/" style={{
              padding: "12px 24px", background: "transparent", color: "#94a3b8",
              fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: "none",
              border: "1px solid #1e2d40",
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ═══ FORM ═══════════════════════════════════════════════════════════════════

  const formCard = (content: React.ReactNode) => (
    <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", marginBottom: 0 }}>
      {content}
    </div>
  );

  function NavButtons({ onNext, onBack, nextLabel = "Next →", disabled = false }: {
    onNext?: () => void; onBack?: () => void; nextLabel?: string; disabled?: boolean;
  }) {
    return (
      <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
        {onBack && (
          <button onClick={onBack} style={{
            flex: "0 0 auto", padding: "12px 24px", background: "transparent",
            border: "1px solid #1e2d40", borderRadius: 8, color: "#94a3b8",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            ← Back
          </button>
        )}
        {onNext && (
          <button onClick={onNext} disabled={disabled} style={{
            flex: 1, padding: "14px 24px", background: disabled ? "#1e2d40" : "#00d4ff",
            border: "none", borderRadius: 8, color: disabled ? "#64748b" : "#0a0f1e",
            fontSize: 14, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}>
            {nextLabel}
          </button>
        )}
      </div>
    );
  }

  function goToStep(n: number, validate?: () => string) {
    if (validate) {
      const err = validate();
      if (err) { setError(err); return; }
    }
    setError("");
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Battery Swap" }]} />
      </div>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", padding: "20px 24px 80px", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.4)", color: "#00d4ff",
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 20,
          }}>
            NEW SERVICE ⚡
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.15 }}>
            Battery Swap Service
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#94a3b8", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Hand us your discharged battery.<br />Drive away with a fully charged one.<br />
            <strong style={{ color: "#f1f5f9" }}>No waiting. No hassle.</strong>
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["⚡ Charged in minutes", "🔋 Same capacity guaranteed", "📍 Home pickup available"].map((pill) => (
              <span key={pill} style={{
                padding: "6px 14px", borderRadius: 999, background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)", color: "#94a3b8", fontSize: 13,
              }}>{pill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <StepIndicator current={step} />

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#ef4444", fontSize: 14,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── Step 1: Your Details ── */}
          {step === 1 && formCard(
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Tell us about yourself</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <Input value={name} onChange={setName} placeholder="Rajan Panda" required />
                </div>
                <div>
                  <FieldLabel required>Phone Number</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14, pointerEvents: "none" }}>+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9437611129"
                      style={{
                        width: "100%", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8,
                        color: "#f1f5f9", fontSize: 14, padding: "10px 14px 10px 44px", boxSizing: "border-box", outline: "none",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <FieldLabel>Email Address</FieldLabel>
                <Input value={email} onChange={setEmail} type="email" placeholder="Optional — for confirmation" />
              </div>
              <div style={{ marginTop: 16 }}>
                <FieldLabel required>City</FieldLabel>
                <Select value={city} onChange={setCity} options={CITIES} placeholder="Select your city" />
              </div>
              <div style={{ marginTop: 16 }}>
                <FieldLabel required>Full Address</FieldLabel>
                <Textarea
                  value={address} onChange={setAddress} rows={2}
                  placeholder="House/Flat no., Street, Area, Landmark"
                />
              </div>
              <NavButtons onNext={() => goToStep(2, validateStep1)} nextLabel="Next: Battery Details →" />
            </>
          )}

          {/* ── Step 2: Battery Info ── */}
          {step === 2 && formCard(
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Tell us about your battery</h2>

              <FieldLabel required>Battery Brand</FieldLabel>
              <Input value={batteryBrand} onChange={setBatteryBrand} placeholder="e.g. Konark, Exide, Amaron" />

              <div style={{ marginTop: 20 }}>
                <FieldLabel required>Battery Type</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                  {BATTERY_TYPES.map((bt) => (
                    <button key={bt.value} onClick={() => setBatteryType(bt.value)} style={{
                      background: batteryType === bt.value ? "rgba(0,212,255,0.08)" : "#0a0f1e",
                      border: `1px solid ${batteryType === bt.value ? "#00d4ff" : "#1e2d40"}`,
                      borderRadius: 10, padding: "14px 12px", cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s",
                      boxShadow: batteryType === bt.value ? "0 0 12px rgba(0,212,255,0.15)" : "none",
                    }}>
                      <span style={{ fontSize: 20 }}>{bt.icon}</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: batteryType === bt.value ? "#00d4ff" : "#f1f5f9", margin: "6px 0 2px" }}>{bt.label}</p>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{bt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
                <div>
                  <FieldLabel required>Battery Capacity</FieldLabel>
                  <Select value={batteryCapacity} onChange={setBatteryCapacity} options={CAPACITIES} placeholder="Select capacity" />
                </div>
                <div>
                  <FieldLabel required>Purchase Year</FieldLabel>
                  <Select value={purchaseYear} onChange={setPurchaseYear} options={YEARS.map(String)} placeholder="Select year" />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <FieldLabel required>Current Charge %</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                  <input
                    type="range" min={0} max={100} value={chargePercent}
                    onChange={(e) => setChargePercent(Number(e.target.value))}
                    style={{ flex: 1, accentColor: chargeColor }}
                  />
                  <span style={{ fontSize: 15, fontWeight: 700, color: chargeColor, minWidth: 60 }}>
                    Currently at {chargePercent}%
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <FieldLabel required>Battery Condition</FieldLabel>
                <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                  {CONDITIONS.map((c) => (
                    <button key={c.value} onClick={() => setBatteryCondition(c.value)} style={{
                      flex: "1 1 140px", background: batteryCondition === c.value ? "rgba(0,212,255,0.08)" : "#0a0f1e",
                      border: `1px solid ${batteryCondition === c.value ? "#00d4ff" : "#1e2d40"}`,
                      borderRadius: 10, padding: "14px 10px", cursor: "pointer", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 18 }}>{c.icon}</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: batteryCondition === c.value ? "#00d4ff" : "#f1f5f9", margin: "6px 0 2px" }}>{c.label}</p>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{c.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <FieldLabel>Serial Number</FieldLabel>
                <Input value={serialNumber} onChange={setSerialNumber} placeholder="Found on battery label sticker (optional)" />
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <FieldLabel>Any Physical Damage?</FieldLabel>
                  <button
                    onClick={() => setHasPhysicalDamage((v) => !v)}
                    style={{
                      width: 44, height: 24, borderRadius: 999, cursor: "pointer",
                      background: hasPhysicalDamage ? "#00d4ff" : "#1e2d40", border: "none",
                      position: "relative", transition: "background 0.2s",
                    }}
                  >
                    <span style={{
                      position: "absolute", top: 3, left: hasPhysicalDamage ? 22 : 3,
                      width: 18, height: 18, borderRadius: "50%", background: "#fff",
                      transition: "left 0.2s",
                    }} />
                  </button>
                </div>
                {hasPhysicalDamage && (
                  <Textarea value={damageDescription} onChange={setDamageDescription} placeholder="Describe the damage (cracks, swelling, leaks, etc.)" />
                )}
              </div>

              {/* Photo Upload */}
              <div style={{ marginTop: 20 }}>
                <FieldLabel>Battery Photo</FieldLabel>
                <div
                  onClick={() => uploadStatus !== "uploading" && fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${uploadStatus === "done" ? "#10b981" : "#00d4ff"}`,
                    borderRadius: 12, padding: "28px 16px", textAlign: "center", cursor: "pointer",
                    background: "rgba(0,212,255,0.03)", transition: "all 0.2s",
                    marginTop: 8,
                  }}
                  onMouseEnter={(e) => { if (uploadStatus !== "uploading") (e.currentTarget as HTMLDivElement).style.background = "rgba(0,212,255,0.07)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,212,255,0.03)"; }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Battery preview" style={{ maxHeight: 120, maxWidth: 200, borderRadius: 8, marginBottom: 8 }} />
                  ) : (
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>📷</p>
                  )}
                  {uploadStatus === "done"
                    ? <p style={{ color: "#10b981", fontSize: 13, margin: 0 }}>✓ Photo uploaded</p>
                    : uploadStatus === "uploading"
                      ? (
                        <>
                          <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 8px" }}>Uploading...</p>
                          <div style={{ background: "#1e2d40", borderRadius: 999, height: 4, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
                            <div style={{ height: "100%", width: `${uploadProgress}%`, background: "#00d4ff", transition: "width 0.3s" }} />
                          </div>
                        </>
                      )
                      : <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Upload a clear photo of your battery<br /><span style={{ fontSize: 11 }}>JPEG or PNG · Max 5MB</span></p>
                  }
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                  }}
                />
              </div>

              <NavButtons onBack={() => goToStep(1)} onNext={() => goToStep(3, validateStep2)} nextLabel="Next: Schedule →" />
            </>
          )}

          {/* ── Step 3: Schedule ── */}
          {step === 3 && formCard(
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>When would you like to swap?</h2>

              {/* Swap Location */}
              <FieldLabel required>Swap Location</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                {[
                  { value: "Home Pickup", icon: "🏠", label: "Home Pickup", desc: "Our technician comes to your address. Available within 10km of city center." },
                  { value: "Visit Center", icon: "🏪", label: "Visit Our Center", desc: "Drop your battery at our Bhubaneswar center. Bhimatangi Housing Colony." },
                ].map((loc) => (
                  <button key={loc.value} onClick={() => setSwapLocation(loc.value)} style={{
                    background: swapLocation === loc.value ? "rgba(0,212,255,0.08)" : "#0a0f1e",
                    border: `1px solid ${swapLocation === loc.value ? "#00d4ff" : "#1e2d40"}`,
                    borderRadius: 12, padding: "16px", cursor: "pointer", textAlign: "left",
                    boxShadow: swapLocation === loc.value ? "0 0 16px rgba(0,212,255,0.12)" : "none",
                    transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 24 }}>{loc.icon}</span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: swapLocation === loc.value ? "#00d4ff" : "#f1f5f9", margin: "8px 0 6px" }}>{loc.label}</p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{loc.desc}</p>
                  </button>
                ))}
              </div>

              {/* Date */}
              <div style={{ marginTop: 20 }}>
                <FieldLabel required>Preferred Date</FieldLabel>
                <input
                  type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
                  min={minDate} max={maxDate}
                  style={{
                    width: "100%", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8,
                    color: "#f1f5f9", fontSize: 14, padding: "10px 14px", boxSizing: "border-box", outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                />
                {preferredDate && <p style={{ color: "#10b981", fontSize: 12, marginTop: 6 }}>✓ Slots available on this date</p>}
              </div>

              {/* Time Slot */}
              <div style={{ marginTop: 20 }}>
                <FieldLabel required>Time Slot</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
                  {TIME_SLOTS.map((ts) => (
                    <button key={ts.value} onClick={() => setTimeSlot(ts.value)} style={{
                      background: timeSlot === ts.value ? "rgba(0,212,255,0.08)" : "#0a0f1e",
                      border: `1px solid ${timeSlot === ts.value ? "#00d4ff" : "#1e2d40"}`,
                      borderRadius: 10, padding: "14px 8px", cursor: "pointer", textAlign: "center",
                      transition: "all 0.15s",
                    }}>
                      <p style={{ fontSize: 22, margin: "0 0 6px" }}>{ts.icon}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: timeSlot === ts.value ? "#00d4ff" : "#f1f5f9", margin: "0 0 4px" }}>{ts.label}</p>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{ts.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special instructions */}
              <div style={{ marginTop: 16 }}>
                <FieldLabel>Special Instructions</FieldLabel>
                <Textarea
                  value={specialInstructions} onChange={setSpecialInstructions}
                  placeholder="Gate code, parking info, best contact time, etc."
                />
              </div>

              {/* Fee estimate */}
              <div style={{
                background: "#0a0f1e", border: "1px solid rgba(0,212,255,0.25)", borderRadius: 12,
                padding: 16, marginTop: 20,
              }}>
                <p style={{ color: "#00d4ff", fontWeight: 700, margin: "0 0 6px" }}>💡 Swap Fee Estimate</p>
                <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 4px" }}>
                  Based on your battery details, estimated fee: <strong style={{ color: "#f1f5f9" }}>₹80 – ₹250</strong>
                </p>
                <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>Exact fee confirmed after inspection by our technician.</p>
              </div>

              <NavButtons onBack={() => goToStep(2)} onNext={() => goToStep(4, validateStep3)} nextLabel="Next: Review →" />
            </>
          )}

          {/* ── Step 4: Review & Confirm ── */}
          {step === 4 && formCard(
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Review your swap request</h2>

              {/* Summary cards */}
              {(
                [
                  {
                    title: "Your Details", editStep: 1, rows: [
                      ["Name", name], ["Phone", `+91 ${phone}`],
                      ...(email ? [["Email", email] as [string, string]] : []),
                      ["City", city], ["Address", address],
                    ] as [string, string][],
                  },
                  {
                    title: "Battery Details", editStep: 2, rows: [
                      ["Brand", batteryBrand], ["Type", batteryType],
                      ["Capacity", batteryCapacity], ["Year", purchaseYear],
                      ["Condition", batteryCondition], ["Charge", `${chargePercent}%`],
                    ] as [string, string][],
                  },
                  {
                    title: "Schedule", editStep: 3, rows: [
                      ["Location", swapLocation], ["Date", preferredDate],
                      ["Slot", timeSlot],
                      ...(specialInstructions ? [["Instructions", specialInstructions] as [string, string]] : []),
                    ] as [string, string][],
                  },
                ]
              ).map(({ title, editStep, rows }) => (
                <div key={title} style={{ background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: 0 }}>{title}</p>
                    <button onClick={() => goToStep(editStep)} style={{
                      background: "transparent", border: "none", color: "#00d4ff",
                      fontSize: 12, cursor: "pointer", padding: 0,
                    }}>Edit →</button>
                  </div>
                  {rows.map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(30,45,64,0.5)" }}>
                      <span style={{ color: "#64748b", fontSize: 13 }}>{k}</span>
                      <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Photo thumbnail */}
              {photoPreview && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Battery Photo</p>
                  <img src={photoPreview} alt="Battery" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #1e2d40" }} />
                </div>
              )}

              {/* Terms */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginTop: 20, marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  style={{ marginTop: 3, accentColor: "#00d4ff", width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                  I confirm the battery details above are accurate. I understand the swap fee will be confirmed after inspection.
                </span>
              </label>

              {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>{error}</p>}

              <NavButtons
                onBack={() => goToStep(3)}
                onNext={handleSubmit}
                nextLabel={submitting ? "Submitting..." : "Submit Swap Request →"}
                disabled={submitting || !termsAgreed}
              />
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .step-bar-desktop { display: none !important; }
          .step-bar-mobile { display: block !important; }
        }
        @media (min-width: 641px) {
          .step-bar-mobile { display: none !important; }
        }
      `}</style>
    </main>
  );
}
