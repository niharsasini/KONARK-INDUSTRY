"use client";
import { useRef } from "react";

/**
 * Pin effect is disabled: GSAP ScrollTrigger pin + a scrub-tied opacity
 * tween on the same element raced against the hero's own async image
 * loads (card deck) that shift page height after mount. ScrollTrigger's
 * initial position calc landed wrong and left the hero stuck invisible
 * in production. Kept as a no-op hook (instead of removing heroRef/id
 * from Hero.jsx) so the section still has its ref/id for SectionDots.
 */
export function usePinnedHero() {
  const heroRef = useRef<HTMLElement>(null);
  return { heroRef };
}
