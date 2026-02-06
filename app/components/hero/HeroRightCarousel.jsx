"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroRightCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images?.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      {/* VIEWPORT */}
      <div className="relative overflow-hidden aspect-square">
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
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
                width={500}
                height={500}
                priority={i === 0}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(255,165,0,0.35)]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
