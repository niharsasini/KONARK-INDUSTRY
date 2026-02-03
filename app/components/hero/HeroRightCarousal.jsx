"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroRightCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative flex-1 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto lg:mx-0">
      {/* VIEWPORT */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[560px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="min-w-full h-full flex items-center justify-center"
            >
              <Image
                src={img}
                alt={`Top Product ${i + 1}`}
                width={600}
                height={600}
                priority={i === 0}
                className="max-h-full w-auto object-contain drop-shadow-[0_25px_60px_rgba(255,165,0,0.35)]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
