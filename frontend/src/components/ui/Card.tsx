import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-[#ffffff] border border-[#e8dfd0] rounded-2xl transition-all duration-200 ${
        hover ? "hover:border-[#d4c9b8] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0f4c81]/5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
