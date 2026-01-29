"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroRightCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex-1 relative w-full max-w-md lg:max-w-xl mx-auto lg:mx-0 animate-float overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="min-w-full flex justify-center">
            <Image
              src={img}
              alt={`Top Product ${i + 1}`}
              width={700}
              height={700}
              priority
              className="w-full h-auto object-contain drop-shadow-[0_35px_80px_rgba(255,165,0,0.5)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
