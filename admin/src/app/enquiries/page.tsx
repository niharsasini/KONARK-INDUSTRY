"use client";
import { useState, useEffect, useCallback } from "react";
import { Download, Eye, X, Flag, MessageSquare, CheckSquare, Trash2, Search } from "lucide-react";
import { getEnquiries, updateEnquiryStatus, markEnquiriesRead, deleteEnquiry } from "@/lib/adminApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

const ALL_STATUSES = ["New", "Contacted", "In Progress", "Resolved", "Closed"];
const TABS = ["All", "Test Ride", "Product Enquiry", "Service Booking", "Contact"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,212,255,0.1)", color: "#00d4ff" },
  Contacted: { bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
  "In Progress": { bg: "rgba(249,115,22,0.1)", color: "#f97316" },
  Resolved: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  Closed: { bg: "rgba(100,116,139,0.1)", color: "#64748b" },
};

type Enquiry = {
  _id?: string;
  id?: string | number;
  name: string;
  phone: string;
  email: string;
  enquiry_type?: string;
  type?: string;
  message?: string;
  created_at?: string;
  date?: string;
  status: string;
  urgent?: boolean;
  admin_notes?: string;
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Enquiry | null>(null);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySaving, setReplySaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string> = {
        skip: String((page - 1) * LIMIT),
        limit: String(LIMIT),
      };
      if (search) filters.search = search;
      if (activeTab !== "All") filters.enquiry_type = activeTab.toLowerCase().replace(/ /g, "_");
      const { items, total } = await getEnquiries(filters);
      setEnquiries(Array.isArray(items) ? items : []);
      setTotal(total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTab]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);
  useEffect(() => { setPage(1); }, [search, activeTab]);

  const getType = (e: Enquiry) => e.enquiry_type ?? e.type ?? "";
  const getId = (e: Enquiry) => String(e._id ?? e.id ?? "");

  const filtered = enquiries;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteEnquiry(deleteId);
      setEnquiries((es) => es.filter((e) => getId(e) !== deleteId));
      setTotal((t) => t - 1);
      setDeleteId(null);
    } catch {
      alert("Failed to delete enquiry.");
    } finally {
      setDeleting(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    setEnquiries((es) => es.map((e) => getId(e) === id ? { ...e, status } : e));
    try { await updateEnquiryStatus(id, status); } catch { /* optimistic; ignore */ }
  };

  const markAllRead = async () => {
    const newIds = enquiries.filter((e) => e.status === "New").map(getId);
    setEnquiries((es) => es.map((e) => e.status === "New" ? { ...e, status: "Contacted" } : e));
    try { await markEnquiriesRead(newIds); } catch { /* optimistic */ }
  };

  const exportTxt = () => {
    const lines = enquiries.map((e) =>
      `[${e.created_at ?? e.date ?? ""}] ${e.name} | ${getType(e)} | ${e.phone} | ${e.email}\nStatus: ${e.status}\nMessage: ${e.message ?? ""}\n${"─".repeat(60)}`
    );
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "konark-enquiries.txt";
    a.click();
  };

  const sendReply = async () => {
    if (!replyOpen) return;
    const id = replyOpen;
    const current = enquiries.find((e) => getId(e) === id);
    setReplySaving(true);
    try {
      await updateEnquiryStatus(id, current?.status ?? "New", replyText);
      setEnquiries((es) => es.map((e) => getId(e) === id ? { ...e, admin_notes: replyText } : e));
      setReplyOpen(null);
      setReplyText("");
      setNoteSaved(id);
      setTimeout(() => setNoteSaved(null), 2500);
    } catch {
      // leave modal open so admin can retry
    } finally {
      setReplySaving(false);
    }
  };

  if (loading) return <div style={{ padding: "32px 40px" }}><SkeletonLoader variant="table" /></div>;
  if (error) return <div style={{ padding: "32px 40px" }}><ErrorState message={error} onRetry={fetchEnquiries} /></div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Enquiries</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{total} total</p>
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

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name, phone, or email..."
          style={{ width: "100%", background: "#111827", border: "1px solid #1e2d40", borderRadius: 9, padding: "10px 14px 10px 36px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1e2d40" }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "9px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#00d4ff" : "transparent"}`, color: activeTab === tab ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1 }}>
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>📬</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>No enquiries yet</p>
        </div>
      ) : (
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
              {filtered.map((row, idx) => {
                const id = getId(row);
                return (
                  <>
                    <tr key={id || idx} style={{ borderTop: "1px solid #1e2d40", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      onClick={() => setExpandedId(expandedId === id ? null : id)}
                    >
                      <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {idx + 1}
                          {row.urgent && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} title="Urgent" />}
                        </div>
                      </td>
                      <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>{row.name}</td>
                      <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.phone}</td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: "rgba(0,212,255,0.08)", color: "#00d4ff", whiteSpace: "nowrap" }}>{getType(row)}</span>
                      </td>
                      <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8", maxWidth: 180 }}>
                        <span title={row.message ?? ""}>{(row.message ?? "—").slice(0, 55)}{(row.message?.length ?? 0) > 55 ? "..." : ""}</span>
                      </td>
                      <td style={{ padding: "13px 14px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                        {row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN") : row.date ?? "—"}
                      </td>
                      <td style={{ padding: "13px 14px" }} onClick={(e) => e.stopPropagation()}>
                        <select value={row.status} onChange={(e) => changeStatus(id, e.target.value)}
                          style={{ background: STATUS_COLORS[row.status]?.bg ?? "rgba(0,212,255,0.1)", color: STATUS_COLORS[row.status]?.color ?? "#00d4ff", border: "none", borderRadius: 100, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", outline: "none" }}>
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
                          <button onClick={() => { setReplyOpen(id); setReplyText(row.admin_notes || ""); }}
                            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 11, cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
                          >
                            <MessageSquare size={11} />
                          </button>
                          {noteSaved === id && (
                            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600, alignSelf: "center" }}>Saved ✓</span>
                          )}
                          <button onClick={() => setEnquiries((es) => es.map((e) => getId(e) === id ? { ...e, urgent: !e.urgent } : e))}
                            style={{ display: "flex", alignItems: "center", padding: "5px 8px", background: row.urgent ? "rgba(239,68,68,0.1)" : "transparent", border: `1px solid ${row.urgent ? "rgba(239,68,68,0.4)" : "#1e2d40"}`, borderRadius: 6, color: row.urgent ? "#ef4444" : "#94a3b8", fontSize: 11, cursor: "pointer" }}>
                            <Flag size={11} />
                          </button>
                          <button onClick={() => setDeleteId(id)}
                            style={{ display: "flex", alignItems: "center", padding: "5px 8px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 6, color: "#94a3b8", fontSize: 11, cursor: "pointer" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === id && (
                      <tr key={`exp-${id}`} style={{ borderTop: "1px solid #1e2d40", background: "rgba(0,212,255,0.02)" }}>
                        <td colSpan={8} style={{ padding: "16px 20px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div>
                              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Full Message</p>
                              <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.7, margin: 0, background: "#0f172a", padding: "12px 14px", borderRadius: 8 }}>{row.message ?? "—"}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Contact Details</p>
                              <div style={{ background: "#0f172a", padding: "12px 14px", borderRadius: 8 }}>
                                <p style={{ fontSize: 12, color: "#f1f5f9", margin: "0 0 4px" }}>📧 {row.email}</p>
                                <p style={{ fontSize: 12, color: "#f1f5f9", margin: "0 0 4px" }}>📞 {row.phone}</p>
                              </div>
                              {row.admin_notes && (
                                <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, fontSize: 12, color: "#94a3b8" }}>
                                  <span style={{ color: "#00d4ff", fontWeight: 600 }}>Note: </span>{row.admin_notes}
                                </div>
                              )}
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
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />

      {/* Delete confirm */}
      {deleteId !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
            <Trash2 size={32} color="#ef4444" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>Delete Enquiry?</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 8, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} disabled={deleting}
                style={{ padding: "10px 24px", background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", maxWidth: 520, width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Enquiry Details</h2>
              <button onClick={() => setViewItem(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>
            {[["Name", viewItem.name], ["Phone", viewItem.phone], ["Email", viewItem.email], ["Type", getType(viewItem)], ["Status", viewItem.status]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d40" }}>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</span>
                <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px", fontWeight: 600 }}>Message</p>
              <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.7, background: "#111827", padding: 14, borderRadius: 8, margin: 0 }}>{viewItem.message ?? "—"}</p>
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
              <button onClick={sendReply} disabled={replySaving} style={{ flex: 1, padding: "11px", background: replySaving ? "#1e2d40" : "#00d4ff", color: replySaving ? "#94a3b8" : "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 8, border: "none", cursor: replySaving ? "not-allowed" : "pointer" }}>{replySaving ? "Saving..." : "Save Note"}</button>
              <button onClick={() => setReplyOpen(null)} style={{ padding: "11px 20px", background: "transparent", border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 13, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
