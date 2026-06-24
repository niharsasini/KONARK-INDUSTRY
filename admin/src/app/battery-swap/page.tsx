"use client";
import { useEffect, useState, useCallback } from "react";
import {
  getBatterySwaps,
  getBatterySwap,
  updateBatterySwap,
  deleteBatterySwap,
  getBatterySwapStats,
  getSettings,
} from "@/lib/adminApi";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const STATUS_OPTIONS = ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"];
const TIME_SLOT_OPTIONS = ["Morning 9-12", "Afternoon 12-4", "Evening 4-7"];
const CITIES = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Berhampur", "Sambalpur", "Balasore", "Other"];

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:     { bg: "rgba(193,127,36,0.12)",  color: "#c17f24",  border: "rgba(193,127,36,0.3)" },
  confirmed:   { bg: "rgba(15,76,129,0.12)",   color: "#0f4c81",  border: "rgba(15,76,129,0.3)" },
  assigned:    { bg: "rgba(124,58,237,0.12)",  color: "#7c3aed",  border: "rgba(124,58,237,0.3)" },
  in_progress: { bg: "rgba(59,130,246,0.12)",  color: "#3b82f6",  border: "rgba(59,130,246,0.3)" },
  completed:   { bg: "rgba(26,122,74,0.12)",   color: "#1a7a4a",  border: "rgba(26,122,74,0.3)" },
  cancelled:   { bg: "rgba(192,57,43,0.12)",   color: "#c0392b",  border: "rgba(192,57,43,0.3)" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11,
      fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      textTransform: "capitalize", whiteSpace: "nowrap",
    }}>
      {status.replace("_", " ")}
    </span>
  );
}

interface SwapItem {
  id: string; token_number: string; name: string; phone: string;
  battery_capacity: string; battery_type: string; preferred_date: string;
  preferred_time_slot: string; swap_location: string; status: string;
  is_read: boolean; created_at: string;
}

interface SwapDetail extends SwapItem {
  email: string | null; city: string; address: string;
  battery_brand: string; purchase_year: number; current_charge_percent: number;
  battery_condition: string; battery_serial_number: string | null;
  battery_photo_url: string | null; any_physical_damage: boolean;
  damage_description: string | null; special_instructions: string | null;
  assigned_technician: string | null; confirmed_date: string | null;
  confirmed_time_slot: string | null; technician_notes: string | null;
  swap_fee: number; is_read: boolean; admin_notes: string | null; updated_at: string;
}

interface Stats {
  total: number; pending: number; confirmed: number; assigned: number;
  in_progress: number; completed: number; cancelled: number;
  completed_today: number; unread: number;
}

export default function BatterySwapAdminPage() {
  const [swaps, setSwaps] = useState<SwapItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SwapDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");

  // Update form
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateTech, setUpdateTech] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateSlot, setUpdateSlot] = useState("");
  const [updateFee, setUpdateFee] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [techNotes, setTechNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [photoOpen, setPhotoOpen] = useState(false);
  const [technicians, setTechnicians] = useState<string[]>(["Unassigned", "Ramesh Kumar", "Bikash Patel", "Sanjay Nayak", "Dilip Sahoo"]);

  useEffect(() => {
    getSettings()
      .then((data) => {
        const list = (data as Record<string, unknown>).technicians;
        if (Array.isArray(list)) setTechnicians(["Unassigned", ...(list as string[])]);
      })
      .catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {
        skip: String((page - 1) * LIMIT),
        limit: String(LIMIT),
      };
      if (statusFilter) filters.status = statusFilter;
      if (cityFilter) filters.city = cityFilter;
      if (search) filters.search = search;
      const [{ items, total }, statsData] = await Promise.all([
        getBatterySwaps(filters) as Promise<{ items: SwapItem[]; total: number }>,
        getBatterySwapStats() as Promise<Stats>,
      ]);
      setSwaps(items);
      setTotal(total);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, cityFilter, search, page]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { setPage(1); }, [statusFilter, cityFilter, search]);

  async function openDetail(id: string) {
    setSelectedId(id);
    setDetailLoading(true);
    setSaveMsg("");
    try {
      const d = await getBatterySwap(id) as SwapDetail;
      setDetail(d);
      setUpdateStatus(d.status);
      setUpdateTech(d.assigned_technician || "Unassigned");
      setUpdateDate(d.confirmed_date || "");
      setUpdateSlot(d.confirmed_time_slot || "");
      setUpdateFee(d.swap_fee ? String(d.swap_fee) : "");
      setAdminNotes(d.admin_notes || "");
      setTechNotes(d.technician_notes || "");
      // Auto-mark as read
      if (!d.is_read) {
        await updateBatterySwap(id, { is_read: true });
        setSwaps((prev) => prev.map((s) => s.id === id ? { ...s, is_read: true } : s));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleUpdate() {
    if (!selectedId || !detail) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const payload: Record<string, unknown> = {
        status: updateStatus,
        assigned_technician: updateTech === "Unassigned" ? null : updateTech,
        confirmed_date: updateDate || null,
        confirmed_time_slot: updateSlot || null,
        swap_fee: updateFee ? parseFloat(updateFee) : undefined,
        admin_notes: adminNotes || null,
        technician_notes: techNotes || null,
        is_read: true,
      };
      await updateBatterySwap(selectedId, payload);
      setSaveMsg("✓ Updated successfully");
      loadData();
      const updated = await getBatterySwap(selectedId) as SwapDetail;
      setDetail(updated);
    } catch (e: unknown) {
      setSaveMsg("Error: " + (e instanceof Error ? e.message : "Failed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this battery swap request?")) return;
    await deleteBatterySwap(id);
    setSelectedId(null);
    setDetail(null);
    loadData();
  }

  function formatDate(d: string | null | undefined) {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return d; }
  }

  const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 12, padding: "16px 20px", flex: "1 1 120px" }}>
      <p style={{ color: "#6b5a45", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{label}</p>
      <p style={{ color, fontSize: 26, fontWeight: 900, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div style={{ padding: "24px 28px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0f00", margin: 0 }}>🔋 Battery Swap Requests</h1>
          <p style={{ color: "#6b5a45", fontSize: 13, margin: "4px 0 0" }}>Manage and process all battery swap service requests</p>
        </div>
        <button onClick={loadData} style={{
          padding: "8px 16px", background: "transparent", border: "1px solid #e8dfd0",
          borderRadius: 8, color: "#6b5a45", fontSize: 13, cursor: "pointer",
        }}>
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <StatCard label="Total" value={stats.total} color="#1a0f00" />
          <StatCard label="Pending" value={stats.pending} color="#c17f24" />
          <StatCard label="Confirmed" value={stats.confirmed} color="#0f4c81" />
          <StatCard label="Assigned" value={stats.assigned} color="#7c3aed" />
          <StatCard label="In Progress" value={stats.in_progress} color="#3b82f6" />
          <StatCard label="Completed" value={stats.completed} color="#1a7a4a" />
          <StatCard label="Done Today" value={stats.completed_today} color="#1a7a4a" />
          {stats.unread > 0 && <StatCard label="Unread" value={stats.unread} color="#c0392b" />}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="Search token, name, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadData()}
          style={{
            flex: "1 1 200px", background: "#ffffff", border: "1px solid #e8dfd0",
            borderRadius: 8, color: "#1a0f00", fontSize: 13, padding: "8px 12px", outline: "none",
          }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 8, color: "#1a0f00", fontSize: 13, padding: "8px 12px", cursor: "pointer" }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
          style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 8, color: "#1a0f00", fontSize: 13, padding: "8px 12px", cursor: "pointer" }}
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={loadData} style={{
          padding: "8px 16px", background: "#0f4c81", border: "none", borderRadius: 8,
          color: "#ffffff", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          Apply
        </button>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Table */}
        <div style={{ flex: selectedId ? "0 0 55%" : "1", overflow: "auto" }}>
          <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 12, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#6b5a45" }}>Loading...</div>
            ) : swaps.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#6b5a45" }}>No battery swap requests found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e8dfd0", background: "#f9f4ec" }}>
                    {["Token", "Customer", "Battery", "Date", "Slot", "Location", "Status", ""].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", fontSize: 11, color: "#6b5a45", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {swaps.map((sw) => (
                    <tr
                      key={sw.id}
                      onClick={() => openDetail(sw.id)}
                      style={{
                        borderBottom: "1px solid #e8dfd0", cursor: "pointer",
                        background: selectedId === sw.id ? "rgba(15,76,129,0.05)" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (selectedId !== sw.id) (e.currentTarget as HTMLTableRowElement).style.background = "#f9f4ec"; }}
                      onMouseLeave={(e) => { if (selectedId !== sw.id) (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {!sw.is_read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f4c81", flexShrink: 0 }} />}
                          <span style={{ fontFamily: "monospace", color: "#0f4c81", fontSize: 12, fontWeight: 700 }}>{sw.token_number}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <p style={{ color: "#1a0f00", fontSize: 13, fontWeight: 600, margin: 0 }}>{sw.name}</p>
                        <p style={{ color: "#6b5a45", fontSize: 11, margin: 0 }}>{sw.phone}</p>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#6b5a45", fontSize: 12 }}>
                        <p style={{ margin: 0 }}>{sw.battery_capacity}</p>
                        <p style={{ margin: 0, color: "#6b5a45", fontSize: 11 }}>{sw.battery_type}</p>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#6b5a45", fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(sw.preferred_date)}</td>
                      <td style={{ padding: "10px 12px", color: "#6b5a45", fontSize: 11 }}>{sw.preferred_time_slot.replace(" ", "\n")}</td>
                      <td style={{ padding: "10px 12px", color: "#6b5a45", fontSize: 11 }}>{sw.swap_location}</td>
                      <td style={{ padding: "10px 12px" }}><StatusBadge status={sw.status} /></td>
                      <td style={{ padding: "10px 12px" }}>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(sw.id); }} style={{
                          background: "transparent", border: "none", color: "#6b5a45", cursor: "pointer", fontSize: 14, padding: 4,
                        }} title="Delete">🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / LIMIT))} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />
        </div>

        {/* Detail panel */}
        {selectedId && (
          <div style={{ flex: "0 0 44%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 16, overflow: "hidden" }}>
            {detailLoading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#6b5a45" }}>Loading details...</div>
            ) : detail ? (
              <div>
                {/* Panel header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8dfd0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ color: "#6b5a45", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Swap Token</p>
                    <p style={{ color: "#0f4c81", fontFamily: "monospace", fontSize: 18, fontWeight: 900, margin: 0 }}>{detail.token_number}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <StatusBadge status={detail.status} />
                    <button onClick={() => { setSelectedId(null); setDetail(null); }}
                      style={{ background: "transparent", border: "none", color: "#6b5a45", cursor: "pointer", fontSize: 18, padding: 4 }}>×</button>
                  </div>
                </div>

                <div style={{ padding: "16px 20px", maxHeight: "80vh", overflowY: "auto" }}>
                  {/* Customer info */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: "#6b5a45", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Customer</p>
                    <div style={{ background: "#f9f4ec", borderRadius: 10, padding: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(15,76,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0f4c81", marginBottom: 10 }}>
                        {detail.name.charAt(0)}
                      </div>
                      {[["Name", detail.name], ["Phone", detail.phone], ["Email", detail.email || "—"], ["City", detail.city], ["Address", detail.address]].map(([k, v]) => (
                        <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #e8dfd0" }}>
                          <span style={{ color: "#6b5a45", fontSize: 12 }}>{k}</span>
                          <span style={{ color: "#1a0f00", fontSize: 12, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Battery info */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: "#6b5a45", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Battery Details</p>
                    <div style={{ background: "#f9f4ec", borderRadius: 10, padding: 14 }}>
                      {detail.battery_photo_url && (
                        <img
                          src={`${BASE_URL}${detail.battery_photo_url}`}
                          alt="Battery"
                          onClick={() => setPhotoOpen(true)}
                          style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginBottom: 12, cursor: "zoom-in" }}
                        />
                      )}
                      {[
                        ["Type", detail.battery_type], ["Capacity", detail.battery_capacity],
                        ["Brand", detail.battery_brand], ["Year", String(detail.purchase_year)],
                        ["Condition", detail.battery_condition],
                        ["Charge", `${detail.current_charge_percent}%`],
                        detail.battery_serial_number ? ["Serial #", detail.battery_serial_number] : null,
                      ].filter((x): x is string[] => Boolean(x)).map(([k, v]) => (
                        <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #e8dfd0" }}>
                          <span style={{ color: "#6b5a45", fontSize: 12 }}>{k}</span>
                          <span style={{ color: "#1a0f00", fontSize: 12, fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                      {detail.any_physical_damage && (
                        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 6 }}>
                          <p style={{ color: "#c0392b", fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>⚠️ Physical Damage Reported</p>
                          {detail.damage_description && <p style={{ color: "#6b5a45", fontSize: 12, margin: 0 }}>{detail.damage_description}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: "#6b5a45", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Schedule Requested</p>
                    <div style={{ background: "#f9f4ec", borderRadius: 10, padding: 14 }}>
                      {[
                        ["Preferred Date", formatDate(detail.preferred_date)],
                        ["Time Slot", detail.preferred_time_slot],
                        ["Location", detail.swap_location],
                        detail.special_instructions ? ["Instructions", detail.special_instructions] : null,
                      ].filter((x): x is string[] => Boolean(x)).map(([k, v]) => (
                        <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #e8dfd0" }}>
                          <span style={{ color: "#6b5a45", fontSize: 12 }}>{k}</span>
                          <span style={{ color: "#1a0f00", fontSize: 12, fontWeight: 500, maxWidth: "60%", textAlign: "right" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin update form */}
                  <div style={{ background: "#f9f4ec", border: "1px solid rgba(15,76,129,0.15)", borderRadius: 12, padding: 16 }}>
                    <p style={{ color: "#0f4c81", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Admin Actions</p>

                    {[
                      { label: "Status", content: (
                        <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px" }}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                      )},
                      { label: "Assign Technician", content: (
                        <select value={updateTech} onChange={(e) => setUpdateTech(e.target.value)}
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px" }}>
                          {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      )},
                      { label: "Confirmed Date", content: (
                        <input type="date" value={updateDate} onChange={(e) => setUpdateDate(e.target.value)}
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px", boxSizing: "border-box" as const }} />
                      )},
                      { label: "Confirmed Slot", content: (
                        <select value={updateSlot} onChange={(e) => setUpdateSlot(e.target.value)}
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px" }}>
                          <option value="">Same as requested</option>
                          {TIME_SLOT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      )},
                      { label: "Swap Fee (₹)", content: (
                        <input type="number" value={updateFee} onChange={(e) => setUpdateFee(e.target.value)}
                          placeholder="150"
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px", boxSizing: "border-box" as const }} />
                      )},
                      { label: "Admin Notes", content: (
                        <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2}
                          placeholder="Internal notes..."
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px", boxSizing: "border-box" as const, resize: "vertical" }} />
                      )},
                      { label: "Technician Notes", content: (
                        <textarea value={techNotes} onChange={(e) => setTechNotes(e.target.value)} rows={2}
                          placeholder="Technician observations..."
                          style={{ width: "100%", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 6, color: "#1a0f00", fontSize: 13, padding: "8px 10px", boxSizing: "border-box" as const, resize: "vertical" }} />
                      )},
                    ].map(({ label, content }) => (
                      <div key={label} style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 11, color: "#6b5a45", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                        {content}
                      </div>
                    ))}

                    {saveMsg && (
                      <p style={{ fontSize: 12, color: saveMsg.startsWith("✓") ? "#1a7a4a" : "#c0392b", margin: "0 0 10px" }}>{saveMsg}</p>
                    )}

                    <button onClick={handleUpdate} disabled={saving} style={{
                      width: "100%", padding: "10px", background: saving ? "#d4c9b8" : "#0f4c81",
                      border: "none", borderRadius: 8, color: saving ? "#6b5a45" : "#ffffff",
                      fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                    }}>
                      {saving ? "Saving..." : "Update Request"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Photo lightbox */}
      {photoOpen && detail?.battery_photo_url && (
        <div
          onClick={() => setPhotoOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out",
          }}
        >
          <img
            src={`${BASE_URL}${detail.battery_photo_url}`}
            alt="Battery full"
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, border: "2px solid #e8dfd0" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
