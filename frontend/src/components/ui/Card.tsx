import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl transition-all duration-200 ${
        hover ? "hover:border-[var(--border-default)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--navy)]/5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
