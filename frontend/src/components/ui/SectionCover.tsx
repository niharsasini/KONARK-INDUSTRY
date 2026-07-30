"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface SectionCoverProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Backing color shown behind the section — also what the rounded top corners clip to. */
  background?: string;
  /** Gives the section a rounded top edge + soft shadow, like a card sliding up over the section above. */
  roundedTop?: boolean;
}

export function SectionCover({
  children,
  className = "",
  style = {},
  id,
  background,
  roundedTop = false,
}: SectionCoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Content is visible by default (matches the plain DOM/SSR state) —
  // the reveal-on-scroll animation is only ever applied AFTER mount,
  // never before. A prior version hid content via a CSS class present
  // at first render; if the IntersectionObserver never fired (it didn't,
  // in production) that left whole sections permanently invisible.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setVisible(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    observer.observe(el);

    // Safety net: never leave a section stuck hidden if the observer
    // doesn't fire for any reason.
    const fallback = setTimeout(reveal, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const hidden = mounted && !visible;

  return (
    <div
      ref={ref}
      id={id}
      className={`section-cover ${className}`}
      style={{
        position: "relative",
        background,
        overflow: roundedTop ? "hidden" : undefined,
        borderRadius: roundedTop ? "24px 24px 0 0" : undefined,
        boxShadow: roundedTop ? "0 -8px 40px rgba(13,81,140,0.08)" : undefined,
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(48px)" : "translateY(0)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        willChange: hidden ? "transform, opacity" : "auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
