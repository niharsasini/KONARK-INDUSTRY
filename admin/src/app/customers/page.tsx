"use client";
import { useState } from "react";
import { Search, Download, ChevronDown, ChevronUp } from "lucide-react";

type Customer = {
  id: number; name: string; phone: string; email: string; city: string;
  orders: number; lastActive: string; enquiries: string[]; joinDate: string;
};

const CUSTOMERS: Customer[] = [
  { id: 1, name: "Ramesh Patra", phone: "94376 11129", email: "ramesh@gmail.com", city: "Bhubaneswar", orders: 3, lastActive: "25 May 2026", enquiries: ["Test Ride – Konark EV Max (23 May)", "Product Enquiry – LFP Battery (18 May)"], joinDate: "10 Jan 2026" },
  { id: 2, name: "Sunita Behera", phone: "98765 43210", email: "sunita.b@gmail.com", city: "Cuttack", orders: 1, lastActive: "24 May 2026", enquiries: ["Product Enquiry – Solar Panel 2kW (22 May)"], joinDate: "5 Feb 2026" },
  { id: 3, name: "Manas Das", phone: "91234 56789", email: "manas.das@yahoo.com", city: "Puri", orders: 2, lastActive: "23 May 2026", enquiries: ["Service Booking – EV Charging Setup (21 May)", "Test Ride – Konark Urban (15 May)"], joinDate: "20 Mar 2026" },
  { id: 4, name: "Priya Mohanty", phone: "70123 45678", email: "priya.m@gmail.com", city: "Bhubaneswar", orders: 0, lastActive: "22 May 2026", enquiries: ["Test Ride – Konark EV Max (20 May)"], joinDate: "1 Apr 2026" },
  { id: 5, name: "Bikash Sahoo", phone: "81234 56789", email: "bikash.sahoo@gmail.com", city: "Rourkela", orders: 4, lastActive: "21 May 2026", enquiries: ["Product Enquiry – Inverter 1500W (19 May)", "Service Booking – Battery Replacement (14 May)", "Product Enquiry – Charger (8 May)"], joinDate: "15 Dec 2025" },
  { id: 6, name: "Anita Rath", phone: "63789 01234", email: "anita.r@gmail.com", city: "Sambalpur", orders: 1, lastActive: "20 May 2026", enquiries: ["Service Booking – Solar Panel Maintenance (18 May)"], joinDate: "22 Feb 2026" },
  { id: 7, name: "Deepak Nayak", phone: "63210 98765", email: "deepak.n@gmail.com", city: "Balasore", orders: 2, lastActive: "19 May 2026", enquiries: ["Test Ride – Konark Cargo (17 May)"], joinDate: "3 Mar 2026" },
  { id: 8, name: "Kavita Pradhan", phone: "94567 89012", email: "kavita.p@gmail.com", city: "Bhubaneswar", orders: 1, lastActive: "18 May 2026", enquiries: ["Service Booking – Inverter Repair (16 May)"], joinDate: "28 Jan 2026" },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const exportTxt = () => {
    const lines = CUSTOMERS.map(
      (c) => `${c.name} | ${c.phone} | ${c.email} | ${c.city} | Orders: ${c.orders} | Joined: ${c.joinDate}`
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "konark-customers.txt";
    a.click();
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Customers</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{CUSTOMERS.length} registered customers</p>
        </div>
        <button onClick={exportTxt}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Download size={14} /> Export .txt
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..."
          style={{ width: "100%", background: "#111827", border: "1px solid #1e2d40", borderRadius: 9, padding: "10px 14px 10px 36px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>

      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
              {["Customer", "Phone", "City", "Orders", "Last Active", ""].map((h, i) => (
                <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const expanded = expandedId === c.id;
              const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
              return (
                <>
                  <tr key={c.id} style={{ borderBottom: expanded ? "none" : "1px solid #1e2d4060", cursor: "pointer" }}
                    onClick={() => setExpandedId(expanded ? null : c.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#00d4ff", flexShrink: 0 }}>
                          {initials}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{c.phone}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{c.city}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.orders > 0 ? "#10b981" : "#64748b" }}>{c.orders}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{c.lastActive}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {expanded ? <ChevronUp size={14} color="#00d4ff" /> : <ChevronDown size={14} color="#64748b" />}
                    </td>
                  </tr>
                  {expanded && (
                    <tr key={`${c.id}-exp`} style={{ borderBottom: "1px solid #1e2d4060" }}>
                      <td colSpan={6} style={{ padding: "0 16px 16px 60px", background: "rgba(0,212,255,0.02)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                          <div>
                            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontWeight: 600 }}>Recent Enquiries</p>
                            {c.enquiries.map((eq, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", flexShrink: 0, marginTop: 5 }} />
                                <span style={{ fontSize: 12, color: "#94a3b8" }}>{eq}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div>
                              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>City</p>
                              <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{c.city}, Odisha</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>Member Since</p>
                              <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{c.joinDate}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>Total Orders</p>
                              <p style={{ fontSize: 13, color: c.orders > 0 ? "#10b981" : "#64748b", margin: 0, fontWeight: 700 }}>{c.orders} order{c.orders !== 1 ? "s" : ""}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b", fontSize: 13 }}>No customers found for "{search}"</div>
        )}
      </div>
    </div>
  );
}
