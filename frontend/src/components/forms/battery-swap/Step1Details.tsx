import { FieldLabel, Input, Select, Textarea } from "./FormFields";
import NavButtons from "./NavButtons";
import { CITIES } from "./constants";
import type { BatterySwapFormState } from "./types";

export default function Step1Details({ form }: { form: BatterySwapFormState }) {
  const { name, setName, phone, setPhone, email, setEmail, city, setCity, address, setAddress, goToStep, validateStep1 } = form;

  return (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 24px" }}>Tell us about yourself</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <FieldLabel required>Full Name</FieldLabel>
          <Input value={name} onChange={setName} placeholder="Rajan Panda" required />
        </div>
        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", fontSize: 14, pointerEvents: "none" }}>+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9437611129"
              style={{
                width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8,
                color: "var(--text-body)", fontSize: 14, padding: "10px 14px 10px 44px", boxSizing: "border-box", outline: "none",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
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
  );
}
