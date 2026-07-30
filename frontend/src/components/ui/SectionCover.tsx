"use client";
import type { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  const { ref, isVisible } = useScrollReveal(0.15, "0px 0px -80px 0px");

  return (
    <div
      ref={ref}
      id={id}
      className={`section-cover ${isVisible ? "section-visible" : "section-hidden"} ${className}`}
      style={{
        position: "relative",
        background,
        overflow: roundedTop ? "hidden" : undefined,
        borderRadius: roundedTop ? "24px 24px 0 0" : undefined,
        boxShadow: roundedTop ? "0 -8px 40px rgba(13,81,140,0.08)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
