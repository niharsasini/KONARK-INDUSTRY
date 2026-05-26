"use client";
import { useState } from "react";
import { Download, Eye, X, Flag, MessageSquare, CheckSquare } from "lucide-react";

const INIT_ENQUIRIES = [
  { id: 1, name: "Ramesh Patra", phone: "94376 11129", email: "ramesh@gmail.com", type: "Test Ride", message: "Interested in booking a test ride for the Electric Scooter. Available on weekends at the Bhubaneswar showroom. Please confirm timings.", date: "25 May 2026", status: "New", urgent: false },
  { id: 2, name: "Sunita Behera", phone: "98765 43210", email: "sunita.b@gmail.com", type: "Product Enquiry", message: "Need pricing for BLDC Fan bulk order of 50 units for our office building project in Cuttack. Require invoice and GST details.", date: "24 May 2026", status: "Contacted", urgent: false },
  { id: 3, name: "Manas Das", phone: "91234 56789", email: "manas.das@yahoo.com", type: "Service Booking", message: "AC not cooling properly. Need technician visit at my home in Puri. Prefer morning slot on any weekday.", date: "23 May 2026", status: "Resolved", urgent: false },
  { id: 4, name: "Priya Mohanty", phone: "70123 45678", email: "priya.m@gmail.com", type: "Test Ride", message: "Want to test ride the E-Rickshaw for commercial passenger transport use in Bhubaneswar city.", date: "22 May 2026", status: "New", urgent: true },
  { id: 5, name: "Bikash Sahoo", phone: "81234 56789", email: "bikash.sahoo@gmail.com", type: "Product Enquiry", message: "Require LFP Battery 48V 100Ah for a 10kW solar system installation in Rourkela industrial area.", date: "21 May 2026", status: "In Progress", urgent: false },
  { id: 6, name: "Anita Rath", phone: "63789 01234", email: "anita.r@gmail.com", type: "Contact", message: "Partnership opportunity for distributing Konark products in Sambalpur and surrounding districts.", date: "20 May 2026", status: "New", urgent: false },
  { id: 7, name: "Subash Nayak", phone: "94376 99001", email: "subash@gmail.com", type: "Service Booking", message: "PCB soldering needed for 20 motor controller boards urgently for our EV manufacturing unit.", date: "19 May 2026", status: "Closed", urgent: true },
  { id: 8, name: "Kavita Panda", phone: "77012 34567", email: "kavita.panda@gmail.com", type: "Product Enquiry", message: "Looking for Water Purifier for our school in Berhampur. Need 5 units with 6-stage RO system.", date: "18 May 2026", status: "Contacted", urgent: false },
];

const ALL_STATUSES = ["New", "Contacted", "In Progress", "Resolved", "Closed"];
const TABS = ["All", "Test Ride", "Product Enquiry", "Service Booking", "Contact"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  Contacted: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  "In Progress": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Resolved: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  Closed: { bg: "rgba(100,116,139,0.1)", color: "#64748b" },
};

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [enquiries, setEnquiries] = useState(INIT_ENQUIRIES);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<typeof INIT_ENQUIRIES[0] | null>(null);
  const [replyOpen, setReplyOpen] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<number, string>>({});

  const filtered = enquiries.filter((e) => activeTab === "All" || e.type === activeTab);

  const updateStatus = (id: number, status: string) =>
    setEnquiries((es) => es.map((e) => e.id === id ? { ...e, status } : e));

  const toggleUrgent = (id: number) =>
    setEnquiries((es) => es.map((e) => e.id === id ? { ...e, urgent: !e.urgent } : e));

  const markAllRead = () =>
    setEnquiries((es) => es.map((e) => e.status === "New" ? { ...e, status: "Contacted" } : e));

  const exportTxt = () => {
    const lines = enquiries.map((e) => `[${e.date}] ${e.name} | ${e.type} | ${e.phone} | ${e.email}\nStatus: ${e.status}${e.urgent ? " [URGENT]" : ""}\nMessage: ${e.message}\n${"─".repeat(60)}`);
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "konark-enquiries.txt";
    a.click();
  };

  const sendReply = () => {
    if (replyOpen !== null && replyText.trim()) {
      setReplies((r) => ({ ...r, [replyOpen]: replyText }));
      setReplyOpen(null);
      setReplyText("");
    }
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Enquiries</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{enquiries.length} total · {enquiries.filter((e) => e.status === "New").length} new</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer" }}>
            <CheckSquare size={13} /> Mark All Read
          </button>
          <button onClick={exportTxt} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer" }}>
            <Download size={13} /> Export .txt
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1e2d40" }}>
        {TABS.map((tab) => {
          const count = tab === "All" ? enquiries.length : enquiries.filter((e) => e.type === tab).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "9px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#00d4ff" : "transparent"}`, color: activeTab === tab ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1 }}>
              {tab} <span style={{ fontSize: 11, marginLeft: 4, background: activeTab === tab ? "rgba(0,212,255,0.12)" : "#1e2d40", color: activeTab === tab ? "#00d4ff" : "#64748b", padding: "1px 7px", borderRadius: 100 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#0f172a" }}>
            <tr>
              {["#", "Name", "Phone", "Type", "Message", "Date", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <>
                <tr key={row.id} style={{ borderTop: "1px solid #1e2d40", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                >
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {row.id}
                      {row.urgent && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} title="Urgent" />}
                    </div>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>{row.name}</td>
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.phone}</td>
                  <td style={{ padding: "13px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: "rgba(0,212,255,0.08)", color: "#00d4ff", whiteSpace: "nowrap" }}>{row.type}</span>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8", maxWidth: 180 }}>
                    <span title={row.message}>{row.message.slice(0, 55)}...</span>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                  <td style={{ padding: "13px 14px" }} onClick={(e) => e.stopPropagation()}>
                    <select value={row.status} onChange={(e) => updateStatus(row.id, e.target.value)}
                      style={{ background: STATUS_COLORS[row.status]?.bg, color: STATUS_COLORS[row.status]?.color, border: "none", borderRadius: 100, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", outline: "none" }}>
                      {ALL_STATUSES.map((s) => <option key={s} value={s} style={{ background: "#0f172a", color: "#f1f5f9" }}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "13px 14px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setViewItem(row)}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 11, cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                      >
                        <Eye size={11} /> View
                      </button>
                      <button onClick={() => { setReplyOpen(row.id); setReplyText(replies[row.id] || ""); }}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 11, cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                      >
                        <MessageSquare size={11} />
                      </button>
                      <button onClick={() => toggleUrgent(row.id)}
                        style={{ display: "flex", alignItems: "center", padding: "5px 8px", background: row.urgent ? "rgba(239,68,68,0.1)" : "transparent", border: `1px solid ${row.urgent ? "rgba(239,68,68,0.4)" : "#1e2d40"}`, borderRadius: 6, color: row.urgent ? "#ef4444" : "#94a3b8", fontSize: 11, cursor: "pointer" }}
                      >
                        <Flag size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === row.id && (
                  <tr key={`exp-${row.id}`} style={{ borderTop: "1px solid #1e2d40", background: "rgba(0,212,255,0.02)" }}>
                    <td colSpan={8} style={{ padding: "16px 20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Full Message</p>
                          <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.7, margin: 0, background: "#0f172a", padding: "12px 14px", borderRadius: 8 }}>{row.message}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Contact Details</p>
                          <div style={{ background: "#0f172a", padding: "12px 14px", borderRadius: 8 }}>
                            <p style={{ fontSize: 12, color: "#f1f5f9", margin: "0 0 4px" }}>📧 {row.email}</p>
                            <p style={{ fontSize: 12, color: "#f1f5f9", margin: "0 0 4px" }}>📞 {row.phone}</p>
                            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>📅 {row.date}</p>
                          </div>
                          {replies[row.id] && (
                            <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, fontSize: 12, color: "#94a3b8" }}>
                              <span style={{ color: "#00d4ff", fontWeight: 600 }}>Reply sent: </span>{replies[row.id]}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", maxWidth: 520, width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Enquiry #{viewItem.id}</h2>
              <button onClick={() => setViewItem(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>
            {[["Name", viewItem.name], ["Phone", viewItem.phone], ["Email", viewItem.email], ["Type", viewItem.type], ["Date", viewItem.date], ["Status", viewItem.status]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d40" }}>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</span>
                <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px", fontWeight: 600 }}>Message</p>
              <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.7, background: "#111827", padding: 14, borderRadius: 8, margin: 0 }}>{viewItem.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reply modal */}
      {replyOpen !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "28px", maxWidth: 440, width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Send Reply Note</h2>
              <button onClick={() => setReplyOpen(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={5} placeholder="Type your reply or internal note here..."
              style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={sendReply} style={{ flex: 1, padding: "11px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 8, border: "none", cursor: "pointer" }}>Save Note</button>
              <button onClick={() => setReplyOpen(null)} style={{ padding: "11px 20px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 13, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
