"use client";

const CUSTOMERS = [
  { id: 1, name: "Ramesh Patra", phone: "94376 11129", email: "ramesh@gmail.com", city: "Bhubaneswar", orders: 3, lastActive: "25 May 2026" },
  { id: 2, name: "Sunita Behera", phone: "98765 43210", email: "sunita.b@gmail.com", city: "Cuttack", orders: 1, lastActive: "24 May 2026" },
  { id: 3, name: "Manas Das", phone: "91234 56789", email: "manas.das@yahoo.com", city: "Puri", orders: 2, lastActive: "23 May 2026" },
  { id: 4, name: "Priya Mohanty", phone: "70123 45678", email: "priya.m@gmail.com", city: "Bhubaneswar", orders: 0, lastActive: "22 May 2026" },
  { id: 5, name: "Bikash Sahoo", phone: "81234 56789", email: "bikash.sahoo@gmail.com", city: "Rourkela", orders: 4, lastActive: "21 May 2026" },
  { id: 6, name: "Anita Rath", phone: "63789 01234", email: "anita.r@gmail.com", city: "Sambalpur", orders: 1, lastActive: "20 May 2026" },
];

export default function CustomersPage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Customers</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{CUSTOMERS.length} registered customers</p>
      </div>

      <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#0f172a" }}>
              <tr>
                {["Name", "Phone", "Email", "City", "Total Orders", "Last Active"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CUSTOMERS.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #1e2d40" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#00d4ff", flexShrink: 0 }}>
                        {c.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{c.phone}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{c.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{c.city}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.orders > 0 ? "#10b981" : "#64748b" }}>
                      {c.orders}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{c.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
