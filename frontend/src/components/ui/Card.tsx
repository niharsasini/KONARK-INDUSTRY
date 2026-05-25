import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-[#0f172a] border border-[#1e2d40] rounded-2xl transition-all duration-200 ${
        hover ? "hover:border-[#2d4a6b] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00d4ff]/5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
