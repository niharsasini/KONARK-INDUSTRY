"use client";
import { useState } from "react";
import { Calendar, List, X, ChevronDown } from "lucide-react";

const TECHNICIANS = ["Unassigned", "Ramesh Kumar", "Bikash Patel", "Sanjay Nayak", "Dilip Sahoo"];
const STATUS_FLOW = ["Booked", "Technician Assigned", "In Progress", "Completed"];
const DAYS = ["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30", "Sat 31", "Sun 1"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Booked: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  "Technician Assigned": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  "In Progress": { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  Completed: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

type Booking = {
  id: string; customer: string; phone: string; service: string;
  date: string; time: string; address: string; day: string;
  status: string; technician: string; notes: string;
};

const INITIAL: Booking[] = [
  { id: "SB001", customer: "Ramesh Patra", phone: "94376 11129", service: "EV Battery Inspection", date: "26 May", time: "10:00 AM", address: "Bhimatangi, BBSR", day: "Mon 26", status: "Booked", technician: "Unassigned", notes: "Customer says battery drains fast" },
  { id: "SB002", customer: "Sunita Behera", phone: "98765 43210", service: "Solar Panel Installation", date: "26 May", time: "2:00 PM", address: "Cuttack, Old Town", day: "Mon 26", status: "Technician Assigned", technician: "Ramesh Kumar", notes: "Install 2kW rooftop panel" },
  { id: "SB003", customer: "Manas Das", phone: "91234 56789", service: "EV Charging Setup", date: "27 May", time: "11:00 AM", address: "Puri Road, BBSR", day: "Tue 27", status: "In Progress", technician: "Bikash Patel", notes: "Home charging point setup" },
  { id: "SB004", customer: "Priya Mohanty", phone: "70123 45678", service: "Battery Replacement", date: "27 May", time: "4:00 PM", address: "Rourkela Steel City", day: "Tue 27", status: "Booked", technician: "Unassigned", notes: "48V LFP battery replacement" },
  { id: "SB005", customer: "Bikash Sahoo", phone: "81234 56789", service: "AC Motor Servicing", date: "28 May", time: "9:00 AM", address: "Berhampur, Market Rd", day: "Wed 28", status: "Completed", technician: "Sanjay Nayak", notes: "Routine motor servicing done" },
  { id: "SB006", customer: "Anita Jena", phone: "76543 21098", service: "Solar Panel Maintenance", date: "28 May", time: "3:00 PM", address: "Sambalpur, Burla", day: "Wed 28", status: "Technician Assigned", technician: "Dilip Sahoo", notes: "Annual cleaning and check" },
  { id: "SB007", customer: "Deepak Nayak", phone: "63210 98765", service: "EV Battery Inspection", date: "29 May", time: "1:00 PM", address: "Balasore Town", day: "Thu 29", status: "Booked", technician: "Unassigned", notes: "" },
  { id: "SB008", customer: "Kavita Pradhan", phone: "94567 89012", service: "Inverter Repair", date: "30 May", time: "10:30 AM", address: "Bhubaneswar, Patia", day: "Fri 30", status: "Booked", technician: "Unassigned", notes: "Inverter showing error code E4" },
];

export default function ServicesPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [detailId, setDetailId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Booking>) =>
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const advanceStatus = (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx < STATUS_FLOW.length - 1) update(id, { status: STATUS_FLOW[idx + 1] });
  };

  const detail = bookings.find((b) => b.id === detailId);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Service Bookings</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{bookings.length} bookings this week</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("list")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: view === "list" ? "#00d4ff" : "transparent", color: view === "list" ? "#0a0f1e" : "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <List size={14} /> List
          </button>
          <button onClick={() => setView("calendar")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: view === "calendar" ? "#00d4ff" : "transparent", color: view === "calendar" ? "#0a0f1e" : "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Calendar size={14} /> Calendar
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
                {["ID", "Customer", "Service", "Date & Time", "Technician", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #1e2d4060" }}>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{b.id}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>{b.customer}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{b.phone}</p>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#94a3b8" }}>{b.service}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 12, color: "#f1f5f9", margin: "0 0 2px", fontWeight: 500 }}>{b.date}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{b.time}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ position: "relative" }}>
                      <select value={b.technician} onChange={(e) => {
                        const tech = e.target.value;
                        update(b.id, { technician: tech, status: tech !== "Unassigned" && b.status === "Booked" ? "Technician Assigned" : b.status });
                      }}
                        style={{ appearance: "none", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 6, padding: "6px 28px 6px 10px", color: b.technician === "Unassigned" ? "#64748b" : "#f1f5f9", fontSize: 12, cursor: "pointer", width: "100%", outline: "none" }}>
                        {TECHNICIANS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }} />
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: STATUS_COLORS[b.status]?.bg, color: STATUS_COLORS[b.status]?.color, whiteSpace: "nowrap" }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setDetailId(b.id)}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>
                        View
                      </button>
                      {b.status !== "Completed" && (
                        <button onClick={() => advanceStatus(b.id, b.status)}
                          style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "rgba(0,212,255,0.1)", color: "#00d4ff", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                          Advance →
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${DAYS.length}, 1fr)`, borderBottom: "1px solid #1e2d40" }}>
            {DAYS.map((d) => (
              <div key={d} style={{ padding: "12px 10px", textAlign: "center", background: "#0f172a", borderRight: "1px solid #1e2d40", fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${DAYS.length}, 1fr)`, alignItems: "start" }}>
            {DAYS.map((d) => {
              const dayBookings = bookings.filter((b) => b.day === d);
              return (
                <div key={d} style={{ borderRight: "1px solid #1e2d4050", padding: 8, minHeight: 300 }}>
                  {dayBookings.map((b) => (
                    <div key={b.id} onClick={() => setDetailId(b.id)}
                      style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 6, background: STATUS_COLORS[b.status]?.bg, border: `1px solid ${STATUS_COLORS[b.status]?.color}40`, cursor: "pointer" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLORS[b.status]?.color, margin: "0 0 2px" }}>{b.time}</p>
                      <p style={{ fontSize: 11, color: "#f1f5f9", margin: "0 0 2px", fontWeight: 600 }}>{b.customer}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{b.service}</p>
                    </div>
                  ))}
                  {dayBookings.length === 0 && (
                    <p style={{ fontSize: 11, color: "#1e2d40", textAlign: "center", margin: "20px 0" }}>No bookings</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {detail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setDetailId(null)}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 18, padding: 32, width: "100%", maxWidth: 520 }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>{detail.service}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[detail.status]?.bg, color: STATUS_COLORS[detail.status]?.color }}>{detail.status}</span>
              </div>
              <button onClick={() => setDetailId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["ID", detail.id], ["Customer", detail.customer], ["Phone", detail.phone], ["Address", detail.address], ["Date", detail.date], ["Time", detail.time]].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>{k}</p>
                  <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontWeight: 600 }}>Assign Technician</p>
              <select value={detail.technician} onChange={(e) => {
                const tech = e.target.value;
                update(detail.id, { technician: tech, status: tech !== "Unassigned" && detail.status === "Booked" ? "Technician Assigned" : detail.status });
              }}
                style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none" }}>
                {TECHNICIANS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {detail.notes && (
              <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid #1e2d40", borderRadius: 10, marginBottom: 20 }}>
                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontWeight: 600 }}>Notes</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{detail.notes}</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {detail.status !== "Completed" && (
                <button onClick={() => { advanceStatus(detail.id, detail.status); setDetailId(null); }}
                  style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Advance Status →
                </button>
              )}
              <button onClick={() => setDetailId(null)}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
