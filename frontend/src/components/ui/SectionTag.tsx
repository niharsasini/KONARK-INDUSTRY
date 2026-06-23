import React from "react";

interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTag({ children, className = "" }: SectionTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-[#38bdf8]/30 text-[#38bdf8] bg-[#38bdf8]/10 ${className}`}
    >
      {children}
    </span>
  );
}
