"use client";
import { useState, useEffect } from "react";
import { getAllReviews, approveReview, deleteReview } from "@/lib/adminApi";

type Review = {
  id: string;
  product_slug: string;
  product_name: string;
  name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

type Filter = "all" | "pending" | "approved";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = {};
    if (filter === "pending") params.approved = "false";
    if (filter === "approved") params.approved = "true";
    getAllReviews(params)
      .then((data) => setReviews(Array.isArray(data) ? (data as Review[]) : []))
      .catch((err) => setError(err.message || "Failed to load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      const updated = (await approveReview(id)) as Review;
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: updated.is_approved } : r)));
    } catch {
      // no-op — list stays in sync on next refetch
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const total = reviews.length;
  const pending = reviews.filter((r) => !r.is_approved).length;
  const avgRating = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : "0.0";

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
  ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1300 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" }}>Reviews</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Moderate customer product reviews</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "#111827", border: "1px solid #1e2d40", fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>
          Total: {total}
        </div>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", fontSize: 12, fontWeight: 700, color: "#f97316" }}>
          Pending: {pending}
        </div>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", fontSize: 12, fontWeight: 700, color: "#10b981" }}>
          Avg Rating: {avgRating} ★
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #1e2d40" }}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: filter === key ? "2px solid #00d4ff" : "2px solid transparent", color: filter === key ? "#00d4ff" : "#94a3b8", fontSize: 13, fontWeight: filter === key ? 700 : 400, cursor: "pointer", marginBottom: -1 }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 24 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 44, background: "#0f172a", borderRadius: 8, marginBottom: 10, opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchReviews} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#64748b" }}>No reviews found</p>
        </div>
      ) : (
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d40", background: "#0f172a" }}>
                {["Product", "Reviewer", "Rating", "Comment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #1e2d4060" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{r.product_name}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#94a3b8" }}>{r.name}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#f97316", fontWeight: 700 }}>{r.rating} ★</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", maxWidth: 320 }}>{r.comment}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: r.is_approved ? "rgba(16,185,129,0.1)" : "rgba(249,115,22,0.1)", color: r.is_approved ? "#10b981" : "#f97316" }}>
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleApprove(r.id)}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: r.is_approved ? "rgba(249,115,22,0.1)" : "rgba(16,185,129,0.1)", color: r.is_approved ? "#f97316" : "#10b981", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        {r.is_approved ? "Unapprove" : "Approve"}
                      </button>
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleDelete(r.id)}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #1e2d40", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer", fontWeight: 500 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
