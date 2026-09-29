"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const init = async () => {
      try {
        const g = await import("gsap");
        g.default.fromTo(
          ref.current!,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0,
            duration: 0.55, ease: "power3.out",
            // A leftover transform/filter on this wrapper becomes the containing
            // block for every position:fixed descendant (lightboxes, modals),
            // so they'd size to the whole page instead of the viewport.
            clearProps: "transform,filter,opacity",
          }
        );
      } catch {}
    };
    init();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
