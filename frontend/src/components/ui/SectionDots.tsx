"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "stats", label: "Stats" },
  { id: "products", label: "Products" },
  { id: "services", label: "Services" },
  { id: "why", label: "Why Us" },
  { id: "testimonials", label: "Reviews" },
];

/** Homepage-only scroll position indicator — do not render outside the marketing homepage, section ids won't exist elsewhere. */
export function SectionDots() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="section-dots-nav"
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        flexDirection: "column",
        gap: 10,
      }}
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          title={label}
          aria-label={`Scroll to ${label}`}
          style={{
            width: active === id ? 8 : 6,
            height: active === id ? 24 : 6,
            borderRadius: active === id ? 4 : 3,
            background:
              active === id
                ? "linear-gradient(180deg, #0D518C, #0EA5E9)"
                : "rgba(13,81,140,0.2)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            padding: 0,
            boxShadow: active === id ? "0 2px 8px rgba(13,81,140,0.3)" : "none",
          }}
        />
      ))}
    </div>
  );
}
