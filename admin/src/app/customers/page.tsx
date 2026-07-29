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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>Customers</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{total} registered customers</p>
        </div>
        <button onClick={exportTxt}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Download size={14} /> Export .txt
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260, maxWidth: 360 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name, email, or phone..."
            style={{ width: "100%", background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 9, padding: "10px 14px 10px 36px", color: "var(--text-heading)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 9, padding: "10px 14px", color: "var(--text-heading)", fontSize: 13, outline: "none", cursor: "pointer" }}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {customers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>👥</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>No customers found</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(92,103,149,0.2)", background: "var(--bg-surface)" }}>
                {["Customer", "Phone", "City", "Orders", "Joined", "Status", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const id = getId(c);
                const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
                const orders = getOrders(c);
                return (
                  <tr key={id} style={{ borderBottom: "1px solid rgba(92,103,149,0.08)", cursor: "pointer" }}
                    onClick={() => router.push(`/customers/${id}`)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(13,81,140,0.12)", border: "1px solid rgba(13,81,140,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--navy)", flexShrink: 0 }}>
                          {initials}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)", margin: "0 0 2px" }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>{c.phone}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>{c.city ?? "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: orders > 0 ? "var(--green)" : "var(--text-muted)" }}>{orders}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{getJoinDate(c)}</td>
                    <td style={{ padding: "14px 16px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleStatus(id, isActive(c), e)}
                        style={{
                          background: isActive(c) ? "var(--orange)" : "var(--green)",
                          border: `1px solid ${isActive(c) ? "var(--orange)" : "var(--green)"}`,
                          color: "var(--text-heading)",
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
                      <ChevronRight size={14} color="var(--text-muted)" />
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
