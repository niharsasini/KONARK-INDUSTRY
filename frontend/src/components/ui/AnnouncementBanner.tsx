"use client";
import { useEffect, useState } from "react";
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

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
        color: "#0a0f1e",
        padding: "10px 40px",
        textAlign: "center",
        fontSize: 13,
        fontWeight: 600,
        position: "relative",
        zIndex: 1000,
      }}
    >
      {settings.announcement_banner_text}
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
          color: "#0a0f1e",
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
