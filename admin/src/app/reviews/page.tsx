"use client";
import { useState, useEffect } from "react";
import { getAllReviews, approveReview, deleteReview } from "@/lib/adminApi";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;

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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = {
      skip: String((page - 1) * LIMIT),
      limit: String(LIMIT),
    };
    if (filter === "pending") params.approved = "false";
    if (filter === "approved") params.approved = "true";
    if (ratingFilter) params.rating = ratingFilter;
    getAllReviews(params)
      .then(({ items, total }) => {
        setReviews(Array.isArray(items) ? items : []);
        setTotal(total);
      })
      .catch((err) => setError(err.message || "Failed to load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, ratingFilter, page]);

  useEffect(() => { setPage(1); }, [filter, ratingFilter]);

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
      setTotal((t) => t - 1);
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const pending = reviews.filter((r) => !r.is_approved).length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
  ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1300 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px" }}>Reviews</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Moderate customer product reviews</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", fontSize: 12, fontWeight: 700, color: "var(--text-heading)" }}>
          Total: {total}
        </div>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "rgba(255,112,67,0.1)", border: "1px solid rgba(255,112,67,0.3)", fontSize: 12, fontWeight: 700, color: "var(--orange)" }}>
          Pending: {pending}
        </div>
        <div style={{ padding: "7px 14px", borderRadius: 100, background: "rgba(52,199,138,0.1)", border: "1px solid rgba(52,199,138,0.3)", fontSize: 12, fontWeight: 700, color: "var(--green)" }}>
          Avg Rating: {avgRating} ★
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(92,103,149,0.2)" }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: filter === key ? "2px solid var(--navy)" : "2px solid transparent", color: filter === key ? "var(--navy)" : "var(--text-muted)", fontSize: 13, fontWeight: filter === key ? 700 : 400, cursor: "pointer", marginBottom: -1 }}
            >
              {label}
            </button>
          ))}
        </div>
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(92,103,149,0.3)", background: "var(--bg-card)", color: "var(--text-heading)", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none" }}>
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 24 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 44, background: "var(--bg-surface)", borderRadius: 8, marginBottom: 10, opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ background: "rgba(255,92,92,0.06)", border: "1px solid rgba(255,92,92,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--red)", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchReviews} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "var(--navy)", color: "var(--text-heading)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>No reviews found</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(92,103,149,0.2)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(92,103,149,0.2)", background: "var(--bg-surface)" }}>
                {["Product", "Reviewer", "Rating", "Comment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(92,103,149,0.2)" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-heading)", fontWeight: 600 }}>{r.product_name}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>{r.name}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--gold)", fontWeight: 700 }}>{r.rating} ★</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)", maxWidth: 320 }}>{r.comment}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: r.is_approved ? "rgba(52,199,138,0.1)" : "rgba(244,196,48,0.12)", color: r.is_approved ? "var(--green)" : "var(--gold)" }}>
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleApprove(r.id)}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: r.is_approved ? "rgba(244,196,48,0.12)" : "rgba(52,199,138,0.1)", color: r.is_approved ? "var(--gold)" : "var(--green)", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        {r.is_approved ? "Unapprove" : "Approve"}
                      </button>
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleDelete(r.id)}
                        style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(92,103,149,0.2)", background: "transparent", color: "var(--orange)", fontSize: 11, cursor: "pointer", fontWeight: 500 }}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={LIMIT} />
    </div>
  );
}
