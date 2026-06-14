import NavButtons from "./NavButtons";
import type { BatterySwapFormState } from "./types";

export default function Step4Review({ form }: { form: BatterySwapFormState }) {
  const {
    name, phone, email, city, address,
    batteryBrand, batteryType, batteryCapacity, purchaseYear, batteryCondition, chargePercent,
    swapLocation, preferredDate, timeSlot, specialInstructions,
    photoPreview,
    termsAgreed, setTermsAgreed,
    error, submitting, handleSubmit, goToStep,
  } = form;

  return (
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
  );
}
