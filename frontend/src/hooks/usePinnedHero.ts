"use client";
import { useEffect, useRef } from "react";

/**
 * Pins the hero section while the next section scrolls up over it
 * (Tesla-style "cover" transition), then fades/scales it slightly as
 * it disappears underneath. No-ops gracefully if GSAP fails to load.
 */
export function usePinnedHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let cancelled = false;
    const triggers: Array<{ kill: () => void }> = [];

    const init = async () => {
      try {
        const gsapMod = await import("gsap");
        const gsap = gsapMod.default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        if (cancelled) return;

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
          })
        );

        const fadeTween = gsap.to(el, {
          opacity: 0.3,
          scale: 0.96,
          scrollTrigger: {
            trigger: el,
            start: "80% top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
        if (fadeTween.scrollTrigger) triggers.push(fadeTween.scrollTrigger);
      } catch {
        // Graceful fallback — hero just scrolls normally
      }
    };

    init();

    return () => {
      cancelled = true;
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return { heroRef };
}
