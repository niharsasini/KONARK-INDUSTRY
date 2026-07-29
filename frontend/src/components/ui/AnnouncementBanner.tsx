"use client";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const BANNER_HEIGHT = 38;

const BANNER_STYLES: Record<string, { bg: string; accent: string; icon: string; label: string; text: string }> = {
  announcement: {
    bg: "linear-gradient(90deg, #0B1120 0%, #0D518C 25%, #162952 50%, #0D518C 75%, #0B1120 100%)",
    accent: "var(--sky)",
    text: "var(--text-heading)",
    icon: "📢",
    label: "ANNOUNCEMENT",
  },
  new_product: {
    bg: "linear-gradient(90deg, #0A0E1A, #162952, #1E3870, #162952, #0A0E1A)",
    accent: "var(--gold)",
    text: "var(--text-heading)",
    icon: "🆕",
    label: "NEW PRODUCT",
  },
  offer: {
    bg: "linear-gradient(90deg, #1A0A00, #3D1A00, #1A0A00)",
    accent: "var(--orange)",
    text: "var(--text-heading)",
    icon: "🔥",
    label: "SPECIAL OFFER",
  },
  event: {
    bg: "linear-gradient(90deg, #0A0E1A, #1A1040, #0A0E1A)",
    accent: "var(--slate)",
    text: "var(--text-heading)",
    icon: "🎉",
    label: "EVENT",
  },
  alert: {
    bg: "linear-gradient(90deg, #96291f, #c0392b, #96291f)",
    accent: "#fecaca",
    text: "#fff",
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
        backgroundSize: "300% 100%",
        animation: "bannerScan 6s ease infinite",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        borderBottom: `1px solid rgba(79,195,247,0.12)`,
      }}
    >
      {/* Left label */}
      <div className="announcement-label" style={{
        flexShrink: 0,
        padding: "0 16px",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: 2,
        color: style.accent,
        borderRight: `1px solid ${style.accent}33`,
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(79,195,247,0.1)",
        whiteSpace: "nowrap",
      }}>
        {icon} {style.label}
      </div>

      {/* Scrolling ticker */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div className="banner-ticker-track" style={{ color: "rgba(232,244,255,0.8)", fontSize: 12, fontWeight: 500 }}>
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
          className="announcement-cta"
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
