import React from "react";

type BadgeVariant = "cyan" | "purple" | "orange" | "green" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  cyan: "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30",
  purple: "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30",
  orange: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
  green: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
  gray: "bg-[#94a3b8]/10 text-[#94a3b8] border-[#94a3b8]/30",
};

export default function Badge({ variant = "cyan", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
