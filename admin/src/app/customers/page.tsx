"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Download, ChevronDown, ChevronUp } from "lucide-react";
import { getCustomers } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";

type Customer = {
  _id?: string;
  id?: number;
  name: string;
  phone: string;
  email: string;
  city?: string;
  orders?: number;
  total_orders?: number;
  last_active?: string;
  lastActive?: string;
  enquiries?: string[];
  join_date?: string;
  joinDate?: string;
  created_at?: string;
  is_active?: boolean;
};

function getId(c: Customer) { return String(c._id ?? c.id ?? ""); }
function getOrders(c: Customer) { return c.orders ?? c.total_orders ?? 0; }
function getLastActive(c: Customer) {
  const d = c.last_active ?? c.lastActive ?? c.created_at;
  return d ? new Date(d).toLocaleDateString("en-IN") : "—";
}
function getJoinDate(c: Customer) {
  const d = c.join_date ?? c.joinDate ?? c.created_at;
  return d ? new Date(d).toLocaleDateString("en-IN") : "—";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : (data as Record<string, Customer[]>).customers ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone ?? "").includes(search)
  );

  const exportTxt = () => {
    const lines = customers.map(
      (c) => `${c.name} | ${c.phone} | ${c.email} | ${c.city ?? "—"} | Orders: ${getOrders(c)} | Joined: ${getJoinDate(c)}`
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "konark-customers.txt";
    a.click();
  };

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchCustomers} /></div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Customers</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{customers.length} registered customers</p>
        </div>
        <button onClick={exportTxt}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Download size={14} /> Export .txt
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: 20, maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..."
          style={{ width: "100%", background: "#111827", border: "1px solid #1e2d40", borderRadius: 9, padding: "10px 14px 10px 36px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>

      {customers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>👥</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>No customers yet</p>
        </div>
      ) : (
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
                const id = getId(c);
                const expanded = expandedId === id;
                const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
                const orders = getOrders(c);
                return (
                  <>
                    <tr key={id} style={{ borderBottom: expanded ? "none" : "1px solid #1e2d4060", cursor: "pointer" }}
                      onClick={() => setExpandedId(expanded ? null : id)}
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
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{c.city ?? "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: orders > 0 ? "#10b981" : "#64748b" }}>{orders}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{getLastActive(c)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {expanded ? <ChevronUp size={14} color="#00d4ff" /> : <ChevronDown size={14} color="#64748b" />}
                      </td>
                    </tr>
                    {expanded && (
                      <tr key={`${id}-exp`} style={{ borderBottom: "1px solid #1e2d4060" }}>
                        <td colSpan={6} style={{ padding: "0 16px 16px 60px", background: "rgba(0,212,255,0.02)" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div>
                              <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontWeight: 600 }}>Recent Enquiries</p>
                              {(c.enquiries ?? []).length > 0 ? (c.enquiries ?? []).map((eq, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", flexShrink: 0, marginTop: 5 }} />
                                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{eq}</span>
                                </div>
                              )) : <p style={{ fontSize: 12, color: "#475569" }}>No enquiries on record.</p>}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              <div>
                                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>City</p>
                                <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{c.city ?? "—"}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>Member Since</p>
                                <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{getJoinDate(c)}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>Total Orders</p>
                                <p style={{ fontSize: 13, color: orders > 0 ? "#10b981" : "#64748b", margin: 0, fontWeight: 700 }}>{orders} order{orders !== 1 ? "s" : ""}</p>
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
      )}
    </div>
  );
}
