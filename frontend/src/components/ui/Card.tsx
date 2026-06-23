import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-[#0c1525] border border-[#1c3050] rounded-2xl transition-all duration-200 ${
        hover ? "hover:border-[#2d4a6b] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#38bdf8]/5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
