"use client";
import { useState, useEffect, useCallback } from "react";
import { Calendar, List, X, ChevronDown, Search, Download } from "lucide-react";
import { getServiceBookings, updateServiceBooking, getSettings, exportServiceBookings } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

const STATUS_FLOW = ["Booked", "Technician Assigned", "In Progress", "Completed"];
const ALL_STATUSES = ["Booked", "Technician Assigned", "In Progress", "Completed", "Cancelled"];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Booked: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  "Technician Assigned": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  "In Progress": { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  Completed: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  Cancelled: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

type Booking = {
  _id?: string;
  id?: string;
  customer?: string;
  customer_name?: string;
  name?: string;
  phone?: string;
  service?: string;
  service_type?: string;
  date?: string;
  preferred_date?: string;
  time?: string;
  address?: string;
  city?: string;
  status: string;
  technician?: string;
  assigned_technician?: string;
  notes?: string;
};

function getId(b: Booking) { return String(b._id ?? b.id ?? ""); }
function getName(b: Booking) { return b.customer ?? b.customer_name ?? b.name ?? ""; }
function getService(b: Booking) { return b.service ?? b.service_type ?? ""; }
function getDate(b: Booking) { return b.date ?? b.preferred_date ?? ""; }
function getTech(b: Booking) { return b.technician ?? b.assigned_technician ?? "Unassigned"; }

export default function ServicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<string[]>(["Unassigned", "Ramesh Kumar", "Bikash Patel", "Sanjay Nayak", "Dilip Sahoo"]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getSettings()
      .then((data) => {
        const list = (data as Record<string, unknown>).technicians;
        if (Array.isArray(list)) setTechnicians(["Unassigned", ...(list as string[])]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string> = {
        skip: String((page - 1) * LIMIT),
        limit: String(LIMIT),
      };
      if (statusFilter !== "all") filters.status = statusFilter;
      if (typeFilter) filters.service_type = typeFilter;
      if (search) filters.search = search;
      const { items, total } = await getServiceBookings(filters);
      setBookings(Array.isArray(items) ? items : []);
      setTotal(total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load service bookings.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter, search]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { setPage(1); }, [statusFilter, typeFilter, search]);

  const update = async (id: string, patch: Partial<Booking>) => {
    setBookings((bs) => bs.map((b) => getId(b) === id ? { ...b, ...patch } : b));
    try { await updateServiceBooking(id, patch as Record<string, unknown>); } catch { /* optimistic */ }
  };

  const advanceStatus = (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx < STATUS_FLOW.length - 1) update(id, { status: STATUS_FLOW[idx + 1] });
  };

  const detail = bookings.find((b) => getId(b) === detailId);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const serviceTypes = Array.from(new Set(bookings.map(getService).filter(Boolean)));

  const INPUT: React.CSSProperties = {
    background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8,
    padding: "9px 14px", color: "#f1f5f9", fontSize: 13, outline: "none",
  };

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchBookings} /></div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Service Bookings</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{total} bookings</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => exportServiceBookings()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Download size={13} /> Export CSV
          </button>
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

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by customer name or phone..."
            style={{ ...INPUT, paddingLeft: 36, width: "100%", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...INPUT, cursor: "pointer" }}>
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...INPUT, cursor: "pointer" }}>
          <option value="">All Service Types</option>
          {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>🛠</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>No service bookings found</p>
        </div>
      ) : view === "list" ? (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
                {["Customer", "Service", "Date", "Technician", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={getId(b)} style={{ borderBottom: "1px solid #1e2d4060" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: "0 0 2px" }}>{getName(b)}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{b.phone}</p>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#94a3b8" }}>{getService(b)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#f1f5f9" }}>{getDate(b)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ position: "relative" }}>
                      <select value={getTech(b)} onChange={(e) => {
                        const tech = e.target.value;
                        update(getId(b), { technician: tech, assigned_technician: tech, status: tech !== "Unassigned" && b.status === "Booked" ? "Technician Assigned" : b.status });
                      }}
                        style={{ appearance: "none", background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 6, padding: "6px 28px 6px 10px", color: getTech(b) === "Unassigned" ? "#64748b" : "#f1f5f9", fontSize: 12, cursor: "pointer", width: "100%", outline: "none" }}>
                        {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }} />
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: STATUS_COLORS[b.status]?.bg ?? "rgba(0,212,255,0.1)", color: STATUS_COLORS[b.status]?.color ?? "#00d4ff", whiteSpace: "nowrap" }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setDetailId(getId(b))}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #1e2d40", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
                        View
                      </button>
                      {b.status !== "Completed" && (
                        <button onClick={() => advanceStatus(getId(b), b.status)}
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
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Calendar view requires bookings to be grouped by date. Switch to List view to manage all bookings.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            {bookings.map((b) => (
              <div key={getId(b)} onClick={() => setDetailId(getId(b))}
                style={{ padding: "12px 16px", borderRadius: 10, background: STATUS_COLORS[b.status]?.bg ?? "rgba(0,212,255,0.08)", border: `1px solid ${STATUS_COLORS[b.status]?.color ?? "#00d4ff"}40`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{getName(b)}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{getService(b)} · {getDate(b)}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[b.status]?.bg, color: STATUS_COLORS[b.status]?.color }}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />

      {/* Detail modal */}
      {detail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setDetailId(null)}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 18, padding: 32, width: "100%", maxWidth: 520 }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" }}>{getService(detail)}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: STATUS_COLORS[detail.status]?.bg, color: STATUS_COLORS[detail.status]?.color }}>{detail.status}</span>
              </div>
              <button onClick={() => setDetailId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["Customer", getName(detail)], ["Phone", detail.phone ?? "—"], ["Address", detail.address ?? detail.city ?? "—"], ["Date", getDate(detail)]].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontWeight: 600 }}>{k}</p>
                  <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontWeight: 600 }}>Assign Technician</p>
              <select value={getTech(detail)} onChange={(e) => {
                const tech = e.target.value;
                update(getId(detail), { technician: tech, assigned_technician: tech, status: tech !== "Unassigned" && detail.status === "Booked" ? "Technician Assigned" : detail.status });
              }}
                style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none" }}>
                {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
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
                <button onClick={() => { advanceStatus(getId(detail), detail.status); setDetailId(null); }}
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
