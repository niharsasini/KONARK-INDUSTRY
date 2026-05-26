"use client";
import { useState } from "react";

const BOOKINGS = [
  { id: 1, customer: "Debasis Panda", service: "AC Repair & Service", location: "Bhubaneswar", date: "26 May 2026", urgency: "Urgent", status: "New" },
  { id: 2, customer: "Lakshmi Mishra", service: "EV Charger Installation", location: "Cuttack", date: "25 May 2026", urgency: "Normal", status: "In Progress" },
  { id: 3, customer: "Sarat Behera", service: "Solar Installation", location: "Puri", date: "24 May 2026", urgency: "Moderate", status: "Done" },
  { id: 4, customer: "Nalini Das", service: "PCB and Soldering", location: "Bhubaneswar", date: "23 May 2026", urgency: "Urgent", status: "New" },
  { id: 5, customer: "Ranjan Pradhan", service: "AC Repair & Service", location: "Rourkela", date: "22 May 2026", urgency: "Moderate", status: "In Progress" },
  { id: 6, customer: "Meena Sahoo", service: "Solar Installation", location: "Berhampur", date: "21 May 2026", urgency: "Normal", status: "Done" },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  "In Progress": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Done: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const URGENCY_COLORS: Record<string, { bg: string; color: string }> = {
  Urgent: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  Moderate: { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Normal: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const ALL_STATUSES = ["New", "In Progress", "Done"];

export default function ServicesPage() {
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(BOOKINGS.map((b) => [b.id, b.status]))
  );

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Service Bookings</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{BOOKINGS.length} service bookings</p>
      </div>

      {/* Summary pills */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Urgent", count: BOOKINGS.filter((b) => b.urgency === "Urgent").length, ...URGENCY_COLORS.Urgent },
          { label: "Moderate", count: BOOKINGS.filter((b) => b.urgency === "Moderate").length, ...URGENCY_COLORS.Moderate },
          { label: "Normal", count: BOOKINGS.filter((b) => b.urgency === "Normal").length, ...URGENCY_COLORS.Normal },
        ].map(({ label, count, bg, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: bg, border: `1px solid ${color}30`, borderRadius: 100, fontSize: 12, fontWeight: 700, color }}>
            {label}: {count}
          </div>
        ))}
      </div>

      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#0f172a" }}>
              <tr>
                {["Customer", "Service Type", "Location", "Date", "Urgency", "Status"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((row) => (
                <tr key={row.id} style={{ borderTop: "1px solid #1e2d40" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>{row.customer}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#94a3b8" }}>{row.service}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>📍 {row.location}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: URGENCY_COLORS[row.urgency]?.bg, color: URGENCY_COLORS[row.urgency]?.color }}>
                      {row.urgency}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <select
                      value={statuses[row.id]}
                      onChange={(e) => setStatuses((s) => ({ ...s, [row.id]: e.target.value }))}
                      style={{
                        background: STATUS_COLORS[statuses[row.id]]?.bg,
                        color: STATUS_COLORS[statuses[row.id]]?.color,
                        border: "none", borderRadius: 100, padding: "4px 10px",
                        fontSize: 11, fontWeight: 700, cursor: "pointer", outline: "none",
                      }}
                    >
                      {ALL_STATUSES.map((s) => <option key={s} value={s} style={{ background: "#0f172a", color: "#f1f5f9" }}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
