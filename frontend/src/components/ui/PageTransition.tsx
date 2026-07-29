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
          { opacity: 0, y: 16, filter: "blur(6px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.55, ease: "power3.out",
          }
        );
      } catch {}
    };
    init();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
