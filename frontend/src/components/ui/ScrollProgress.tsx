"use client";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const init = async () => {
      try {
        const g = await import("gsap");
        const gsap = g.default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(barRef.current!, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      } catch {}
    };
    init();
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "2px",
        background:
          "linear-gradient(90deg,#0D518C,#0EA5E9,#D97706)",
        transformOrigin: "0%",
        transform: "scaleX(0)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
