import { useEffect, useState } from "react";

export interface PublicStats {
  customers: string;
  cities: string;
  satisfaction: string;
  founding_year: number;
  total_products: number;
  review_count: number;
  avg_rating: number | null;
  avg_rating_display: string;
  years_experience: string;
  hidden_certifications: string[];
}

let cachedStats: PublicStats | null = null;
let inFlight: Promise<PublicStats | null> | null = null;

function fetchStats(): Promise<PublicStats | null> {
  if (cachedStats) return Promise.resolve(cachedStats);
  if (inFlight) return inFlight;

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  inFlight = fetch(`${BACKEND}/api/v1/stats/public`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data) cachedStats = data;
      return data;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** Homepage stats — auto-calculated (product count, avg rating, years) plus admin overrides (customers/cities/satisfaction) and cert visibility. */
export function usePublicStats(): PublicStats | null {
  const [stats, setStats] = useState<PublicStats | null>(cachedStats);

  useEffect(() => {
    if (cachedStats) {
      setStats(cachedStats);
      return;
    }
    fetchStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  return stats;
}
