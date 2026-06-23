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
    "bg-[#38bdf8] text-[#080f1e] font-semibold hover:bg-[#0ea5e9] active:scale-95",
  ghost:
    "bg-transparent text-[#f1f5f9] border border-[#1c3050] hover:border-[#38bdf8] hover:text-[#38bdf8]",
  outline:
    "bg-transparent text-[#38bdf8] border border-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#080f1e]",
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
