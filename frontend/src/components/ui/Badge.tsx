import React from "react";

type BadgeVariant = "cyan" | "purple" | "orange" | "green" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  cyan: "bg-[var(--navy)]/10 text-[var(--navy)] border-[var(--navy)]/30",
  purple: "bg-[#5b21b6]/10 text-[#5b21b6] border-[#5b21b6]/30",
  orange: "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30",
  green: "bg-[#1a7a4a]/10 text-[#1a7a4a] border-[#1a7a4a]/30",
  gray: "bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/30",
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
