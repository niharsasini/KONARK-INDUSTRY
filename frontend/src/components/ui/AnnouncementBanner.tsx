"use client";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const BANNER_HEIGHT = 40;

const BANNER_STYLES: Record<string, { bg: string; accent: string; icon: string; label: string }> = {
  announcement: {
    bg: "linear-gradient(90deg, #1e1b4b, #312e81, #1e1b4b)",
    accent: "#818cf8",
    icon: "📢",
    label: "ANNOUNCEMENT",
  },
  new_product: {
    bg: "linear-gradient(90deg, #052e16, #14532d, #052e16)",
    accent: "#34d399",
    icon: "🆕",
    label: "NEW PRODUCT",
  },
  offer: {
    bg: "linear-gradient(90deg, #431407, #7c2d12, #431407)",
    accent: "#fb923c",
    icon: "🔥",
    label: "SPECIAL OFFER",
  },
  event: {
    bg: "linear-gradient(90deg, #0c4a6e, #0369a1, #0c4a6e)",
    accent: "#38bdf8",
    icon: "🎉",
    label: "EVENT",
  },
  alert: {
    bg: "linear-gradient(90deg, #450a0a, #7f1d1d, #450a0a)",
    accent: "#f87171",
    icon: "⚠️",
    label: "IMPORTANT",
  },
};

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

  const style = BANNER_STYLES[settings.announcement_banner_type] || BANNER_STYLES.announcement;
  const icon = settings.announcement_banner_emoji || style.icon;
  const link = settings.announcement_banner_link;

  return (
    <div
      className="announcement-banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: BANNER_HEIGHT,
        zIndex: 1000,
        background: style.bg,
        backgroundSize: "200% 100%",
        animation: "bannerScan 4s ease infinite",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        borderBottom: `1px solid ${style.accent}33`,
      }}
    >
      {/* Left label */}
      <div style={{
        flexShrink: 0,
        padding: "0 16px",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 2,
        color: style.accent,
        borderRight: `1px solid ${style.accent}33`,
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}>
        {icon} {style.label}
      </div>

      {/* Scrolling ticker */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div className="banner-ticker-track" style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="banner-ticker-item">
              {icon} {settings.announcement_banner_text}
            </span>
          ))}
        </div>
      </div>

      {/* Right: CTA link if present */}
      {link && (
        <a
          href={link}
          style={{
            flexShrink: 0,
            padding: "0 16px",
            fontSize: 12,
            fontWeight: 700,
            color: style.accent,
            textDecoration: "none",
            borderLeft: `1px solid ${style.accent}33`,
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          Learn More →
        </a>
      )}

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          width: 40,
          height: "100%",
          background: "rgba(0,0,0,0.3)",
          border: "none",
          borderLeft: `1px solid ${style.accent}33`,
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>
    </div>
  );
}
