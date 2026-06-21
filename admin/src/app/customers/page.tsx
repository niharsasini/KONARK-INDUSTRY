"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, ChevronRight } from "lucide-react";
import { getCustomers, toggleCustomerStatus } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

type Customer = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  orders?: number;
  total_orders?: number;
  last_login?: string;
  created_at?: string;
  is_active?: boolean;
};

function getId(c: Customer) { return String(c.id ?? ""); }
function getOrders(c: Customer) { return c.orders ?? c.total_orders ?? 0; }
function getJoinDate(c: Customer) {
  return c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : "—";
}
function isActive(c: Customer) { return c.is_active !== false; }

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string> = {
        skip: String((page - 1) * LIMIT),
        limit: String(LIMIT),
      };
      if (search) filters.search = search;
      if (statusFilter !== "all") filters.is_active = statusFilter === "active" ? "true" : "false";
      const { items, total } = await getCustomers(filters);
      setCustomers(Array.isArray(items) ? items : []);
      setTotal(total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleToggleStatus = async (id: string, currentlyActive: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleCustomerStatus(id);
      setCustomers((cs) => cs.map((c) => getId(c) === id ? { ...c, is_active: !currentlyActive } : c));
    } catch {
      // ignore — UI stays unchanged on failure
    }
  };

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

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchCustomers} /></div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Customers</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{total} registered customers</p>
        </div>
        <button onClick={exportTxt}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Download size={14} /> Export .txt
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260, maxWidth: 360 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name, email, or phone..."
            style={{ width: "100%", background: "#111827", border: "1px solid #1e2d40", borderRadius: 9, padding: "10px 14px 10px 36px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 9, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", cursor: "pointer" }}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {customers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>👥</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>No customers found</p>
        </div>
      ) : (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
                {["Customer", "Phone", "City", "Orders", "Joined", "Status", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const id = getId(c);
                const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
                const orders = getOrders(c);
                return (
                  <tr key={id} style={{ borderBottom: "1px solid #1e2d4060", cursor: "pointer" }}
                    onClick={() => router.push(`/customers/${id}`)}
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
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{getJoinDate(c)}</td>
                    <td style={{ padding: "14px 16px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleStatus(id, isActive(c), e)}
                        style={{
                          background: isActive(c) ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                          border: `1px solid ${isActive(c) ? "#ef4444" : "#10b981"}`,
                          color: isActive(c) ? "#ef4444" : "#10b981",
                          padding: "4px 12px",
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isActive(c) ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <ChevronRight size={14} color="#64748b" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />
    </div>
  );
}
