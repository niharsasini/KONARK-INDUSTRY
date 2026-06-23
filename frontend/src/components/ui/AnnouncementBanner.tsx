"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function AnnouncementBanner() {
  const settings = useSiteSettings();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("banner_dismissed") === "true");
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("banner_dismissed", "true");
    setDismissed(true);
  };

  if (!settings?.announcement_banner_enabled || !settings.announcement_banner_text || dismissed) {
    return null;
  }

  const emoji = settings.announcement_banner_emoji || "🎉";
  const link = settings.announcement_banner_link;

  const content = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span>{emoji}</span>
      {settings.announcement_banner_text}
    </span>
  );

  return (
    <div
      className="announcement-banner"
      style={{
        color: "#fff",
        padding: "10px 40px",
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        position: "relative",
        zIndex: 1000,
      }}
    >
      {link ? (
        <Link href={link} style={{ color: "#fff", textDecoration: "underline" }}>
          {content}
        </Link>
      ) : (
        content
      )}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          padding: "0 4px",
        }}
      >
        ✕
      </button>
    </div>
  );
}
