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
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 24px" }}>Review your swap request</h2>

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
        <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: 0 }}>{title}</p>
            <button onClick={() => goToStep(editStep)} style={{
              background: "transparent", border: "none", color: "var(--navy)",
              fontSize: 12, cursor: "pointer", padding: 0,
            }}>Edit →</button>
          </div>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{k}</span>
              <span style={{ color: "var(--text-heading)", fontSize: 13, fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{v}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Photo thumbnail */}
      {photoPreview && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Battery Photo</p>
          <img src={photoPreview} alt="Battery" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border-default)" }} />
        </div>
      )}

      {/* Terms */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginTop: 20, marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          style={{ marginTop: 3, accentColor: "var(--navy)", width: 16, height: 16 }}
        />
        <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          I confirm the battery details above are accurate. I understand the swap fee will be confirmed after inspection.
        </span>
      </label>

      {error && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 8 }}>{error}</p>}

      <NavButtons
        onBack={() => goToStep(3)}
        onNext={handleSubmit}
        nextLabel={submitting ? "Submitting..." : "Submit Swap Request →"}
        disabled={submitting || !termsAgreed}
      />
    </>
  );
}
