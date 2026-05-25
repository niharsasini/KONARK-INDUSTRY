"use client";
import React from "react";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-[#00d4ff] text-[#0a0f1e] font-semibold hover:bg-[#00b8d9] active:scale-95",
  ghost:
    "bg-transparent text-[#f1f5f9] border border-[#1e2d40] hover:border-[#00d4ff] hover:text-[#00d4ff]",
  outline:
    "bg-transparent text-[#00d4ff] border border-[#00d4ff] hover:bg-[#00d4ff] hover:text-[#0a0f1e]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
