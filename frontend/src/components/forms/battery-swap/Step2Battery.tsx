import { FieldLabel, Input, Select, Textarea } from "./FormFields";
import NavButtons from "./NavButtons";
import { BATTERY_TYPES, CAPACITIES, CONDITIONS, YEARS } from "./constants";
import type { BatterySwapFormState } from "./types";

export default function Step2Battery({ form }: { form: BatterySwapFormState }) {
  const {
    batteryBrand, setBatteryBrand,
    batteryType, setBatteryType,
    batteryCapacity, setBatteryCapacity,
    purchaseYear, setPurchaseYear,
    chargePercent, setChargePercent, chargeColor,
    batteryCondition, setBatteryCondition,
    serialNumber, setSerialNumber,
    hasPhysicalDamage, setHasPhysicalDamage,
    damageDescription, setDamageDescription,
    photoPreview, uploadProgress, uploadStatus, fileInputRef, handlePhotoUpload,
    goToStep, validateStep2,
  } = form;

  return (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>Tell us about your battery</h2>

      <FieldLabel required>Battery Brand</FieldLabel>
      <Input value={batteryBrand} onChange={setBatteryBrand} placeholder="e.g. Konark, Exide, Amaron" />

      <div style={{ marginTop: 20 }}>
        <FieldLabel required>Battery Type</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          {BATTERY_TYPES.map((bt) => (
            <button key={bt.value} onClick={() => setBatteryType(bt.value)} style={{
              background: batteryType === bt.value ? "rgba(56,189,248,0.08)" : "#080f1e",
              border: `1px solid ${batteryType === bt.value ? "#38bdf8" : "#1c3050"}`,
              borderRadius: 10, padding: "14px 12px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
              boxShadow: batteryType === bt.value ? "0 0 12px rgba(56,189,248,0.15)" : "none",
            }}>
              <span style={{ fontSize: 20 }}>{bt.icon}</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: batteryType === bt.value ? "#38bdf8" : "#f1f5f9", margin: "6px 0 2px" }}>{bt.label}</p>
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
              flex: "1 1 140px", background: batteryCondition === c.value ? "rgba(56,189,248,0.08)" : "#080f1e",
              border: `1px solid ${batteryCondition === c.value ? "#38bdf8" : "#1c3050"}`,
              borderRadius: 10, padding: "14px 10px", cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: batteryCondition === c.value ? "#38bdf8" : "#f1f5f9", margin: "6px 0 2px" }}>{c.label}</p>
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
              background: hasPhysicalDamage ? "#38bdf8" : "#1c3050", border: "none",
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
            border: `2px dashed ${uploadStatus === "done" ? "#10b981" : "#38bdf8"}`,
            borderRadius: 12, padding: "28px 16px", textAlign: "center", cursor: "pointer",
            background: "rgba(56,189,248,0.03)", transition: "all 0.2s",
            marginTop: 8,
          }}
          onMouseEnter={(e) => { if (uploadStatus !== "uploading") (e.currentTarget as HTMLDivElement).style.background = "rgba(56,189,248,0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(56,189,248,0.03)"; }}
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
                  <div style={{ background: "#1c3050", borderRadius: 999, height: 4, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
                    <div style={{ height: "100%", width: `${uploadProgress}%`, background: "#38bdf8", transition: "width 0.3s" }} />
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
  );
}
