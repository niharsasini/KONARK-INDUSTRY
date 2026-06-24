"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShoppingBag, Wrench, Bike, Handshake, Bell } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/adminApi";

type Notification = {
  id: string;
  type: "enquiry" | "order" | "booking" | "test_ride" | "partner" | "system";
  title: string;
  message: string;
  entity_id?: string | null;
  is_read: boolean;
  created_at: string;
};

/** Order notifications carry the mongo _id as entity_id, but the order detail
 * route needs the human-readable order_number — which is embedded in the title. */
function getNotificationLink(n: Notification): string {
  if (n.type === "order") {
    const match = n.title.match(/KI-\d{4}-\d+/);
    return match ? `/orders/${match[0]}` : "/orders";
  }
  if (n.type === "enquiry" || n.type === "test_ride" || n.type === "partner") return "/enquiries";
  if (n.type === "booking") return "/services";
  return "/dashboard";
}

type Filter = "all" | "unread" | "enquiry" | "order" | "booking" | "test_ride" | "partner";

const TYPE_ICON: Record<string, typeof Mail> = {
  enquiry: Mail,
  order: ShoppingBag,
  booking: Wrench,
  test_ride: Bike,
  partner: Handshake,
  system: Bell,
};

const TYPE_COLOR: Record<string, string> = {
  enquiry: "#0f4c81",
  order: "#10b981",
  booking: "#a78bfa",
  test_ride: "#f97316",
  partner: "#60a5fa",
  system: "#6b5a45",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "order", label: "Orders" },
  { key: "enquiry", label: "Enquiries" },
  { key: "booking", label: "Services" },
  { key: "test_ride", label: "Test Rides" },
];

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const fetchNotifications = () => {
    setLoading(true);
    setError(null);
    getNotifications()
      .then((data) => {
        const res = data as { unread_count: number; notifications: Notification[] };
        setNotifications(res.notifications || []);
        setUnreadCount(res.unread_count || 0);
      })
      .catch((err) => setError(err.message || "Failed to load notifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = async (n: Notification) => {
    if (!n.is_read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await markNotificationRead(n.id);
      } catch {
        // best-effort
      }
    }
    router.push(getNotificationLink(n));
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      // best-effort
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    return n.type === filter;
  });

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0f00", margin: "0 0 4px" }}>Notifications</h1>
          <p style={{ fontSize: 13, color: "#6b5a45", margin: 0 }}>{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #e8dfd0", background: unreadCount === 0 ? "transparent" : "#1a7a4a", color: unreadCount === 0 ? "#6b5a45" : "#ffffff", fontSize: 12, fontWeight: 600, cursor: unreadCount === 0 ? "default" : "pointer" }}
        >
          Mark all read
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e8dfd0", flexWrap: "wrap" }}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ padding: "10px 16px", background: "transparent", border: "none", borderBottom: filter === key ? "2px solid #0f4c81" : "2px solid transparent", color: filter === key ? "#0f4c81" : "#6b5a45", fontSize: 13, fontWeight: filter === key ? 700 : 400, cursor: "pointer", marginBottom: -1 }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 64, background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 12, opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchNotifications} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#0f4c81", color: "#ffffff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#6b5a45" }}>No notifications</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((n) => {
            const Icon = TYPE_ICON[n.type] || Bell;
            const color = TYPE_COLOR[n.type] || "#6b5a45";
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px",
                  background: n.is_read ? "#ffffff" : "rgba(15,76,129,0.04)",
                  border: `1px solid ${n.is_read ? "#e8dfd0" : `${color}30`}`,
                  borderRadius: 12, cursor: "pointer", position: "relative",
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1a0f00", margin: "0 0 4px" }}>{n.title}</p>
                  <p style={{ fontSize: 12, color: "#6b5a45", margin: "0 0 6px", lineHeight: 1.5 }}>{n.message}</p>
                  <p style={{ fontSize: 11, color: "#6b5a45", margin: 0 }}>{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <span style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: "#0f4c81" }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
