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
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 24px" }}>When would you like to swap?</h2>

      {/* Swap Location */}
      <FieldLabel required>Swap Location</FieldLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        {[
          { value: "Home Pickup", icon: "🏠", label: "Home Pickup", desc: "Our technician comes to your address. Available within 10km of city center." },
          { value: "Visit Center", icon: "🏪", label: "Visit Our Center", desc: "Drop your battery at our Bhubaneswar center. Bhimatangi Housing Colony." },
        ].map((loc) => (
          <button key={loc.value} onClick={() => setSwapLocation(loc.value)} style={{
            background: swapLocation === loc.value ? "var(--navy-bg)" : "var(--bg-card)",
            border: `1px solid ${swapLocation === loc.value ? "var(--navy)" : "var(--border-default)"}`,
            borderRadius: 12, padding: "16px", cursor: "pointer", textAlign: "left",
            boxShadow: swapLocation === loc.value ? "var(--shadow-navy)" : "none",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 24 }}>{loc.icon}</span>
            <p style={{ fontSize: 14, fontWeight: 700, color: swapLocation === loc.value ? "var(--navy)" : "var(--text-heading)", margin: "8px 0 6px" }}>{loc.label}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{loc.desc}</p>
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
            width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8,
            color: "var(--text-body)", fontSize: 14, padding: "10px 14px", boxSizing: "border-box", outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        {preferredDate && <p style={{ color: "var(--green)", fontSize: 12, marginTop: 6 }}>✓ Slots available on this date</p>}
      </div>

      {/* Time Slot */}
      <div style={{ marginTop: 20 }}>
        <FieldLabel required>Time Slot</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
          {TIME_SLOTS.map((ts) => (
            <button key={ts.value} onClick={() => setTimeSlot(ts.value)} style={{
              background: timeSlot === ts.value ? "var(--navy-bg)" : "var(--bg-card)",
              border: `1px solid ${timeSlot === ts.value ? "var(--navy)" : "var(--border-default)"}`,
              borderRadius: 10, padding: "14px 8px", cursor: "pointer", textAlign: "center",
              transition: "all 0.15s",
            }}>
              <p style={{ fontSize: 22, margin: "0 0 6px" }}>{ts.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: timeSlot === ts.value ? "var(--navy)" : "var(--text-heading)", margin: "0 0 4px" }}>{ts.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{ts.time}</p>
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
        background: "var(--navy-bg)", border: "1px solid var(--border-navy)", borderRadius: 12,
        padding: 16, marginTop: 20,
      }}>
        <p style={{ color: "var(--navy)", fontWeight: 700, margin: "0 0 6px" }}>💡 Swap Fee Estimate</p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 4px" }}>
          Based on your battery details, estimated fee: <strong style={{ color: "var(--text-heading)" }}>₹80 – ₹250</strong>
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>Exact fee confirmed after inspection by our technician.</p>
      </div>

      <NavButtons onBack={() => goToStep(2)} onNext={() => goToStep(4, validateStep3)} nextLabel="Next: Review →" />
    </>
  );
}
