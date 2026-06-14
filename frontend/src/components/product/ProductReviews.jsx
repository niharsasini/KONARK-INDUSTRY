"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductReviews, submitReview } from "@/lib/api";
import toast from "react-hot-toast";

function useReviews(slug) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => {
    setLoading(true);
    getProductReviews(slug)
      .then((data) => setReviews(Array.isArray(data) ? data : data?.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, [slug]);
  return { reviews, loading, refresh };
}

/* Reviews tab content for the Flipkart-style product detail page */
export default function ProductReviews({ slug }) {
  const { reviews, loading, refresh } = useReviews(slug);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("konark_token");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await submitReview(slug, rating, comment);
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit review. Please log in first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
      {/* Submit form */}
      {isLoggedIn && (
        <div style={{ background: "#0f172a", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12, padding: 20, marginBottom: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 14px" }}>Write a Review</p>
          <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg viewBox="0 0 20 20" fill={s <= rating ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 24, height: 24 }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={3} placeholder="Share your experience with this product..." style={{ width: "100%", background: "#0a0f1e", border: "1px solid #1e2d40", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")} onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2d40")} />
            <button type="submit" disabled={submitting} style={{ padding: "10px 24px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 13, borderRadius: 8, border: "none", cursor: submitting ? "not-allowed" : "pointer", width: "fit-content", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 24px" }}>
          <p style={{ fontSize: 20, marginBottom: 8 }}>⭐</p>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>No reviews yet. Be the first to review this product!</p>
          {!isLoggedIn && <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}><Link href="/login" style={{ color: "#00d4ff" }}>Sign in</Link> to write a review.</p>}
        </div>
      ) : (
        reviews.map((r, i) => (
          <div key={r.id || i} style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{r.reviewer_name || r.name || "Customer"}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
              </span>
            </div>
            <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} viewBox="0 0 20 20" fill={s <= (r.rating || 5) ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: 13, height: 13 }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>{r.comment || r.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
