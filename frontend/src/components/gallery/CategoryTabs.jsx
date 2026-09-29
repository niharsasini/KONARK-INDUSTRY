"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const CATEGORY_TABS_CSS = `
.gtabs-wrap { display: flex; justify-content: center; margin-bottom: 40px; }
.gtabs { position: relative; display: flex; gap: 4px; padding: 5px; border-radius: 999px; background: #fff; max-width: 100%; overflow-x: auto; scrollbar-width: none;
  box-shadow: 6px 6px 16px rgba(13,81,140,0.08), -5px -5px 12px rgba(255,255,255,0.95); }
.gtabs::-webkit-scrollbar { display: none; }
.gtabs-pill { position: absolute; top: 5px; bottom: 5px; left: 0; border-radius: 999px; background: linear-gradient(135deg, #0D518C, #0EA5E9);
  box-shadow: 0 4px 14px rgba(13,81,140,0.28); transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
.gtab { position: relative; z-index: 1; border: 0; background: transparent; cursor: pointer; white-space: nowrap; padding: 9px 20px; border-radius: 999px;
  font: inherit; font-size: 13px; font-weight: 600; color: #4A6785; transition: color 0.25s ease; }
.gtab:hover { color: #0D518C; }
.gtab.active, .gtab.active:hover { color: #fff; }
.gtab:focus-visible { outline: 3px solid #0EA5E9; outline-offset: -2px; }
`;

/** Pill-style tabs; the highlighted pill slides to the active tab. tabs: [{ key, label, emoji? }] */
export default function CategoryTabs({ tabs, value, onChange }) {
  const refs = useRef({});
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  const measure = () => {
    const el = refs.current[value];
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  };

  useLayoutEffect(measure, [value, tabs.length]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Keep the active tab in view on narrow screens.
  useEffect(() => {
    refs.current[value]?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [value]);

  return (
    <div className="gtabs-wrap">
      <div className="gtabs" role="tablist">
        <span className="gtabs-pill" style={{ width: pill.w, transform: `translateX(${pill.x}px)`, opacity: pill.ready ? 1 : 0 }} />
        {tabs.map((t) => (
          <button
            key={t.key}
            ref={(el) => { refs.current[t.key] = el; }}
            role="tab"
            aria-selected={value === t.key}
            className={`gtab${value === t.key ? " active" : ""}`}
            onClick={() => onChange(t.key)}
          >
            {t.emoji ? `${t.emoji} ` : ""}{t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
