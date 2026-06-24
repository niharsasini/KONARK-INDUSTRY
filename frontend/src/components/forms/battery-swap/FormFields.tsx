import type { ReactNode } from "react";

export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "var(--red)" }}> *</span>}
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
        width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8,
        color: "var(--text-body)", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", transition: "border-color 0.2s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--navy)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border-default)";
        e.currentTarget.style.boxShadow = "none";
      }}
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
        width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8,
        color: "var(--text-body)", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", resize: "vertical", transition: "border-color 0.2s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--navy)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border-default)";
        e.currentTarget.style.boxShadow = "none";
      }}
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
        width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8,
        color: value ? "var(--text-body)" : "var(--text-subtle)", fontSize: 14, padding: "10px 14px", boxSizing: "border-box",
        outline: "none", cursor: "pointer",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
