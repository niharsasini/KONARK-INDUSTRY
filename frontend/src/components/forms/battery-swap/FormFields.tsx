import type { ReactNode } from "react";

export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );
}

export function Input({ value, onChange, placeholder, type = "text", required }: {
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
        width: "100%", background: "#0c1525", border: "1px solid #1c3050", borderRadius: 8,
        color: "#f1f5f9", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1c3050")}
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%", background: "#0c1525", border: "1px solid #1c3050", borderRadius: 8,
        color: "#f1f5f9", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", resize: "vertical", transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1c3050")}
    />
  );
}

export function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", background: "#0c1525", border: "1px solid #1c3050", borderRadius: 8,
        color: value ? "#f1f5f9" : "#64748b", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", cursor: "pointer",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
