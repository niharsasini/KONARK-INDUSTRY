"use client";

import { HERO_DATA, PRODUCT_IMAGES } from "./hero.data";
import HeroLeft from "./HeroLeft";
import HeroRightCarousel from "./HeroRightCarousal";
import { HeroStyles } from "./hero.styles";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-gradient-to-b from-gray-900 via-[#1e1e1e] to-gray-800 py-12 lg:py-0">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col-reverse lg:flex-row items-center lg:justify-between gap-12 lg:gap-24">
        {/* LEFT CONTENT */}
        <HeroLeft data={HERO_DATA} />

        {/* RIGHT CAROUSEL */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <HeroRightCarousel images={PRODUCT_IMAGES} />
        </div>
      </div>
      <HeroStyles />
    </section>
  );
}
