"use client";
import { useState } from "react";
import { Download, Eye, X } from "lucide-react";

const ENQUIRIES = [
  { id: 1, name: "Ramesh Patra", phone: "94376 11129", email: "ramesh@gmail.com", type: "Test Ride", message: "Interested in booking a test ride for the Electric Scooter. Available on weekends.", date: "25 May 2026", status: "New" },
  { id: 2, name: "Sunita Behera", phone: "98765 43210", email: "sunita.b@gmail.com", type: "Product Enquiry", message: "Need pricing for BLDC Fan bulk order of 50 units for our office building in Cuttack.", date: "24 May 2026", status: "In Progress" },
  { id: 3, name: "Manas Das", phone: "91234 56789", email: "manas.das@yahoo.com", type: "Service Booking", message: "AC not cooling properly. Need technician visit at my home in Puri.", date: "23 May 2026", status: "Done" },
  { id: 4, name: "Priya Mohanty", phone: "70123 45678", email: "priya.m@gmail.com", type: "Test Ride", message: "Want to test ride the E-Rickshaw for commercial use in Bhubaneswar.", date: "22 May 2026", status: "New" },
  { id: 5, name: "Bikash Sahoo", phone: "81234 56789", email: "bikash.sahoo@gmail.com", type: "Product Enquiry", message: "Require LFP Battery for 10kW solar system installation in Rourkela.", date: "21 May 2026", status: "In Progress" },
  { id: 6, name: "Anita Rath", phone: "63789 01234", email: "anita.r@gmail.com", type: "Contact", message: "Partnership opportunity for distributing Konark products in Sambalpur district.", date: "20 May 2026", status: "New" },
  { id: 7, name: "Subash Nayak", phone: "94376 99001", email: "subash@gmail.com", type: "Service Booking", message: "PCB soldering needed for 20 motor controller boards urgently.", date: "19 May 2026", status: "Done" },
  { id: 8, name: "Kavita Panda", phone: "77012 34567", email: "kavita.panda@gmail.com", type: "Product Enquiry", message: "Looking for Water Purifier for our school in Berhampur. Need 5 units.", date: "18 May 2026", status: "New" },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  "In Progress": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Done: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const ALL_STATUSES = ["New", "In Progress", "Done"];
const TABS = ["All", "Test Ride", "Product Enquiry", "Service Booking", "Contact"];

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(ENQUIRIES.map((e) => [e.id, e.status]))
  );
  const [viewItem, setViewItem] = useState<typeof ENQUIRIES[0] | null>(null);

  const filtered = ENQUIRIES.filter((e) => activeTab === "All" || e.type === activeTab);

  const updateStatus = (id: number, status: string) =>
    setStatuses((s) => ({ ...s, [id]: status }));

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Enquiries</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{ENQUIRIES.length} total enquiries</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontWeight: 600, fontSize: 13, borderRadius: 10, cursor: "pointer" }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #1e2d40", paddingBottom: 0, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "9px 16px", background: "transparent", border: "none",
              borderBottom: `2px solid ${activeTab === tab ? "#00d4ff" : "transparent"}`,
              color: activeTab === tab ? "#00d4ff" : "#94a3b8",
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer",
              transition: "all 0.15s", whiteSpace: "nowrap", marginBottom: -1,
            }}
          >
            {tab}
            {activeTab === tab && (
              <span style={{ marginLeft: 6, fontSize: 11, background: "rgba(0,212,255,0.12)", color: "#00d4ff", padding: "1px 7px", borderRadius: 100 }}>
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#0f172a" }}>
              <tr>
                {["#", "Name", "Phone", "Email", "Type", "Message", "Date", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} style={{ borderTop: "1px solid #1e2d40" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{row.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>{row.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.phone}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{row.email}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(0,212,255,0.08)", color: "#00d4ff" }}>{row.type}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", maxWidth: 200 }}>
                    <span title={row.message}>{row.message.slice(0, 60)}...</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={statuses[row.id]}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
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
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => setViewItem(row)}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 12, cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", maxWidth: 520, width: "90%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Enquiry Details</h2>
              <button onClick={() => setViewItem(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            {[
              ["Name", viewItem.name],
              ["Phone", viewItem.phone],
              ["Email", viewItem.email],
              ["Type", viewItem.type],
              ["Date", viewItem.date],
              ["Status", statuses[viewItem.id]],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d40" }}>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Message</p>
              <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.7, background: "#111827", padding: 14, borderRadius: 8, margin: 0 }}>{viewItem.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
