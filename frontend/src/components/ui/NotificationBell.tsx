"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, ShoppingBag, Wrench, Battery } from "lucide-react";
import { getMyNotifications } from "@/lib/api";

type Notification = {
  id: string;
  type: "order" | "booking" | "battery_swap";
  title: string;
  message: string;
  created_at: string;
};

const TYPE_ICON = { order: ShoppingBag, booking: Wrench, battery_swap: Battery };
const TYPE_COLOR = { order: "var(--green)", booking: "var(--gold)", battery_swap: "var(--navy)" };
const LAST_SEEN_KEY = "konark_notifications_last_seen";
const POLL_MS = 60000;

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    getMyNotifications()
      .then((data) => {
        const res = data as { notifications: Notification[] };
        const items = res.notifications || [];
        setNotifications(items);
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        const lastSeenTime = lastSeen ? new Date(lastSeen).getTime() : 0;
        setUnreadCount(items.filter((n) => new Date(n.created_at).getTime() > lastSeenTime).length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((o) => !o);
    if (!open) {
      localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
      setUnreadCount(0);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        style={{
          position: "relative", width: 40, height: 40, color: "var(--slate)",
          background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--neu-shadow)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer", transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sky)"; e.currentTarget.style.boxShadow = "var(--neu-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.boxShadow = "var(--neu-shadow)"; e.currentTarget.style.transform = "translateY(0)"; }}
        onMouseDown={(e) => { e.currentTarget.style.boxShadow = "var(--neu-pressed)"; e.currentTarget.style.transform = "scale(0.97)"; }}
        onMouseUp={(e) => { e.currentTarget.style.boxShadow = "var(--neu-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "linear-gradient(135deg, #0D518C, #4FC3F7)", color: "var(--text-heading)", fontSize: 10, fontWeight: 800, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(13,81,140,0.4)" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, maxHeight: 400, overflowY: "auto", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 14, boxShadow: "0 20px 48px rgba(11,17,32,0.5)", zIndex: 300 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-light)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p style={{ padding: "24px 16px", fontSize: 12, color: "var(--text-subtle)", textAlign: "center", margin: 0 }}>
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => {
              const Icon = TYPE_ICON[n.type] || Bell;
              const color = TYPE_COLOR[n.type] || "var(--text-muted)";
              return (
                <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 2px" }}>{n.title}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px", lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: 0 }}>{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
