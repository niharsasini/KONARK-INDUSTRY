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
    "bg-[var(--navy)] text-white font-semibold hover:bg-[var(--navy-dark)] active:scale-95",
  ghost:
    "bg-transparent text-[var(--text-heading)] border border-[var(--border-default)] hover:border-[var(--navy)] hover:text-[var(--navy)]",
  outline:
    "bg-transparent text-[var(--navy)] border border-[var(--navy)] hover:bg-[var(--navy)] hover:text-white",
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
