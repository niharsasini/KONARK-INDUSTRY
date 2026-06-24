import React from "react";

type BadgeVariant = "cyan" | "purple" | "orange" | "green" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  cyan: "bg-[#0f4c81]/10 text-[#0f4c81] border-[#0f4c81]/30",
  purple: "bg-[#5b21b6]/10 text-[#5b21b6] border-[#5b21b6]/30",
  orange: "bg-[#c17f24]/10 text-[#c17f24] border-[#c17f24]/30",
  green: "bg-[#1a7a4a]/10 text-[#1a7a4a] border-[#1a7a4a]/30",
  gray: "bg-[#6b5a45]/10 text-[#6b5a45] border-[#6b5a45]/30",
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
