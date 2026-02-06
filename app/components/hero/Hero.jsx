"use client";

import { HERO_DATA, PRODUCT_IMAGES } from "./hero.data";
import HeroLeft from "./HeroLeft";
import HeroRightCarousel from "./HeroRightCarousel";
import { HeroStyles } from "./hero.styles";

export default function Hero() {
  return (
    <section
      className="
        relative w-full min-h-screen flex items-center
        bg-gradient-to-b from-gray-900 via-[#1e1e1e] to-gray-800
        pt-[88px] sm:pt-[96px] lg:pt-0
        py-12 lg:py-0
      "
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col-reverse lg:flex-row items-center lg:justify-between gap-12 lg:gap-24">
        {/* LEFT CONTENT */}
        <HeroLeft data={HERO_DATA} />

        {/* RIGHT CARD */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2a2a2a] via-[#1b1b1b] to-black border border-gray-700 shadow-2xl" />
            <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative p-5 sm:p-6">
              <HeroRightCarousel images={PRODUCT_IMAGES} />
            </div>
          </div>
        </div>
      </div>
      <HeroStyles />
    </section>
  );
}
