"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const BANNER_HEIGHT = 40;

export default function AnnouncementBanner() {
  const settings = useSiteSettings();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("banner_dismissed") === "true");
  }, []);

  const visible = Boolean(
    settings?.announcement_banner_enabled && settings.announcement_banner_text && !dismissed
  );

  // Pushes the fixed navbar down by the banner's height via a CSS var, so the two
  // never overlap regardless of which one mounts/unmounts first.
  useEffect(() => {
    document.documentElement.style.setProperty("--banner-h", visible ? `${BANNER_HEIGHT}px` : "0px");
    return () => {
      document.documentElement.style.setProperty("--banner-h", "0px");
    };
  }, [visible]);

  if (!visible || !settings) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem("banner_dismissed", "true");
    setDismissed(true);
  };

  const emoji = settings.announcement_banner_emoji || "🎉";
  const link = settings.announcement_banner_link;
  const message = `${emoji} ${settings.announcement_banner_text}`;

  const ticker = (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
      <div className="banner-ticker-track">
        <span className="banner-ticker-item">{message}</span>
        <span className="banner-ticker-item">{message}</span>
        <span className="banner-ticker-item">{message}</span>
      </div>
    </div>
  );

  const bar = (
    <div
      className="announcement-banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: BANNER_HEIGHT,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
      }}
    >
      {ticker}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.15)",
          border: "none",
          borderRadius: "50%",
          width: 22,
          height: 22,
          cursor: "pointer",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );

  if (link) {
    return (
      <Link href={link} style={{ textDecoration: "none" }}>
        {bar}
      </Link>
    );
  }

  return bar;
}
