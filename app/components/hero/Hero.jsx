"use client";

import { HERO_DATA, PRODUCT_IMAGES } from "./hero.data";
import HeroLeft from "./HeroLeft";
import HeroRightCarousel from "./HeroRightCarousal";
import { HeroStyles } from "./hero.styles";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-gradient-to-b from-gray-900 via-[#1e1e1e] to-gray-800">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-24">
        <HeroLeft data={HERO_DATA} />
        <HeroRightCarousel images={PRODUCT_IMAGES} />
      </div>
      <HeroStyles />
    </section>
  );
}
