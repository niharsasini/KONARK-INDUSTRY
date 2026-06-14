import { FieldLabel, Textarea } from "./FormFields";
import NavButtons from "./NavButtons";
import { TIME_SLOTS } from "./constants";
import type { BatterySwapFormState } from "./types";

export default function Step3Schedule({ form }: { form: BatterySwapFormState }) {
  const {
    swapLocation, setSwapLocation,
    preferredDate, setPreferredDate, minDate, maxDate,
    timeSlot, setTimeSlot,
    specialInstructions, setSpecialInstructions,
    goToStep, validateStep3,
  } = form;

  return (
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
  );
}
