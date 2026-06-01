"use client";
import { useState } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface SwapTrack {
  token_number: string;
  status: string;
  name: string;
  city: string;
  battery_capacity: string;
  preferred_date: string;
  preferred_time_slot: string;
  swap_location: string;
  assigned_technician: string | null;
  confirmed_date: string | null;
  confirmed_time_slot: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_FLOW = [
  { key: "pending", label: "Request Submitted", icon: "📋", desc: "Your swap request has been received." },
  { key: "confirmed", label: "Slot Confirmed", icon: "📞", desc: "Admin has confirmed your preferred slot." },
  { key: "assigned", label: "Technician Assigned", icon: "🔧", desc: "A technician has been assigned to your request." },
  { key: "in_progress", label: "Swap In Progress", icon: "⚡", desc: "Your battery swap is currently being carried out." },
  { key: "completed", label: "Swap Completed", icon: "✅", desc: "Your battery has been swapped successfully!" },
];

const STATUS_ORDER = ["pending", "confirmed", "assigned", "in_progress", "completed"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: "rgba(249,115,22,0.12)", color: "#f97316" },
    confirmed: { bg: "rgba(0,212,255,0.12)", color: "#00d4ff" },
    assigned: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
    in_progress: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
    completed: { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
    cancelled: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
  };
  const style = colors[status] || { bg: "rgba(100,116,139,0.12)", color: "#64748b" };
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 999,
      background: style.bg, color: style.color, fontSize: 12, fontWeight: 700,
      textTransform: "capitalize",
    }}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function BatterySwapTrackPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [swap, setSwap] = useState<SwapTrack | null>(null);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const token = tokenInput.trim().toUpperCase();
    if (!token) return;

    setLoading(true);
    setError("");
    setSwap(null);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/battery-swap/${token}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Token not found");
      setSwap(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStatusIdx = swap ? STATUS_ORDER.indexOf(swap.status) : -1;

  function formatDate(d: string | null | undefined) {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return d;
    }
  }

  function formatDateTime(d: string) {
    try {
      return new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
      return d;
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0f1e", padding: "100px 24px 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 999,
            border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff",
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 16,
          }}>⚡ Battery Swap</span>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 10px" }}>
            Track Your Battery Swap
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Enter your swap token to see the current status.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleTrack} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="BSW-2024-XXXXX"
              style={{
                flex: 1, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 8,
                color: "#f1f5f9", fontSize: 15, padding: "12px 16px", outline: "none",
                fontFamily: "monospace", letterSpacing: "0.06em",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
            />
            <button type="submit" disabled={loading || !tokenInput.trim()} style={{
              padding: "12px 24px", background: loading ? "#1e2d40" : "#00d4ff",
              border: "none", borderRadius: 8, color: loading ? "#64748b" : "#0a0f1e",
              fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s", whiteSpace: "nowrap",
            }}>
              {loading ? "..." : "Track →"}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8, padding: "12px 16px", marginBottom: 24, color: "#ef4444", fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {swap && (
          <div>
            {/* Summary card */}
            <div style={{
              background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16,
              padding: 24, marginBottom: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Swap Token</p>
                  <p style={{ color: "#00d4ff", fontFamily: "monospace", fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: "0.06em" }}>
                    {swap.token_number}
                  </p>
                </div>
                <StatusBadge status={swap.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(
                  [
                    ["Name", swap.name],
                    ["City", swap.city],
                    ["Battery", swap.battery_capacity],
                    ["Location", swap.swap_location],
                    ["Requested", formatDateTime(swap.created_at)],
                    ...(swap.assigned_technician ? [["Technician", swap.assigned_technician]] : []),
                    ...((swap.confirmed_date || swap.preferred_date) ? [["Date", formatDate(swap.confirmed_date) || formatDate(swap.preferred_date)]] : []),
                    ...((swap.confirmed_time_slot || swap.preferred_time_slot) ? [["Slot", swap.confirmed_time_slot || swap.preferred_time_slot]] : []),
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} style={{ background: "#0a0f1e", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</p>
                    <p style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600, margin: 0 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status timeline */}
            {swap.status !== "cancelled" && (
              <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: 24 }}>
                <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 20px" }}>Status Timeline</p>
                {STATUS_FLOW.map((step, i) => {
                  const done = i < currentStatusIdx;
                  const active = i === currentStatusIdx;
                  const pending = i > currentStatusIdx;
                  const lineColor = done ? "#10b981" : "#1e2d40";
                  return (
                    <div key={step.key} style={{ display: "flex", gap: 14, position: "relative" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: done ? "#10b981" : active ? "rgba(0,212,255,0.12)" : "#0a0f1e",
                          border: `2px solid ${done ? "#10b981" : active ? "#00d4ff" : "#1e2d40"}`,
                          fontSize: done ? 14 : 16,
                          color: done ? "#fff" : pending ? "#1e2d40" : undefined,
                          boxShadow: active ? "0 0 12px rgba(0,212,255,0.3)" : "none",
                        }}>
                          {done ? "✓" : step.icon}
                        </div>
                        {i < STATUS_FLOW.length - 1 && (
                          <div style={{ width: 2, flex: 1, minHeight: 24, background: lineColor, margin: "4px 0" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < STATUS_FLOW.length - 1 ? 20 : 0, flex: 1 }}>
                        <p style={{
                          fontSize: 14, fontWeight: 700, margin: "6px 0 4px",
                          color: done ? "#10b981" : active ? "#00d4ff" : "#64748b",
                        }}>
                          {step.label}
                          {active && <span style={{ marginLeft: 8, fontSize: 11, color: "#00d4ff", background: "rgba(0,212,255,0.1)", padding: "2px 8px", borderRadius: 999 }}>CURRENT</span>}
                        </p>
                        <p style={{ fontSize: 12, color: done || active ? "#94a3b8" : "#1e2d40", margin: 0, lineHeight: 1.5 }}>
                          {active || done ? step.desc : "Pending"}
                        </p>
                        {step.key === "assigned" && swap.assigned_technician && (active || done) && (
                          <p style={{ fontSize: 12, color: "#a78bfa", margin: "4px 0 0" }}>
                            🔧 {swap.assigned_technician}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {swap.status === "cancelled" && (
              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <p style={{ fontSize: 20, marginBottom: 8 }}>❌</p>
                <p style={{ color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>Swap Request Cancelled</p>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>
                  Please call <a href="tel:+919437611129" style={{ color: "#00d4ff" }}>+91 94376 11129</a> if you need help.
                </p>
              </div>
            )}

            <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
              <Link href="/battery-swap" style={{
                padding: "10px 20px", background: "#00d4ff", color: "#0a0f1e",
                fontWeight: 700, fontSize: 13, borderRadius: 8, textDecoration: "none",
              }}>
                Book Another Swap
              </Link>
              <Link href="/" style={{
                padding: "10px 20px", background: "transparent", color: "#94a3b8",
                fontWeight: 600, fontSize: 13, borderRadius: 8, textDecoration: "none",
                border: "1px solid #1e2d40",
              }}>
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
