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
    "bg-[#0f4c81] text-white font-semibold hover:bg-[#0a3460] active:scale-95",
  ghost:
    "bg-transparent text-[#1a0f00] border border-[#d4c9b8] hover:border-[#0f4c81] hover:text-[#0f4c81]",
  outline:
    "bg-transparent text-[#0f4c81] border border-[#0f4c81] hover:bg-[#0f4c81] hover:text-white",
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
