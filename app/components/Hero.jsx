"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const slides = [
  {
    tagline: "Powering Tomorrow",
    title: "KONARK",
    bold: "INDUSTRY",
    description:
      "A next-generation EV & Battery Technology company delivering high-performance, safe, and sustainable energy solutions for electric mobility and energy storage.",
    quote: "Driving Innovation • Accelerating Clean Energy • Built for India",
    highlights: [
      "⚡ Advanced EV Batteries",
      "🔋 Energy Storage Systems",
      "🌱 Sustainable Manufacturing",
      "🇮🇳 Made for Indian Roads",
    ],
    image: "/konark/bike.png",
  },
  {
    tagline: "Energy That Moves India",
    title: "SMART",
    bold: "BATTERIES",
    description:
      "High-efficiency lithium battery packs engineered for durability, safety, and long life across Indian terrain.",
    quote: "Reliable • Powerful • Future-Ready",
    highlights: [
      "🔌 Fast Charging",
      "🛡️ Thermal Safety",
      "📊 Smart BMS",
      "🚀 High Power Density",
    ],
    image: "/konark/bike.png",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[index];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-r from-[#9a4b1e] via-[#e2a15a] to-[#9a4b1e] pt-24 pb-24">
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* TEXT */}
            <p className="text-sm md:text-lg tracking-widest mb-3 uppercase">
              {slide.tagline}
            </p>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide">
              {slide.title} <span className="font-extrabold">{slide.bold}</span>
            </h1>

            <p className="text-base md:text-lg text-black/85 mb-3 max-w-2xl">
              {slide.description}
            </p>

            <p className="italic text-sm md:text-base text-black/70 mb-6">
              {slide.quote}
            </p>

            {/* HIGHLIGHTS */}
            <div className="flex flex-wrap justify-center gap-5 mb-8 text-sm md:text-base font-medium">
              {slide.highlights.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button className="bg-black text-white px-7 py-3 rounded-md shadow-md hover:bg-orange-500 hover:text-black transition-all">
                Explore Solutions →
              </button>

              <button className="bg-white text-black px-7 py-3 rounded-md shadow-md hover:bg-black hover:text-white transition-all">
                Partner With Us →
              </button>
            </div>

            {/* IMAGE */}
            <div className="relative mt-14 w-[280px] sm:w-[360px] md:w-[480px] lg:w-[600px] xl:w-[700px]">
              <Image
                src={slide.image}
                alt="Konark EV"
                width={600}
                height={900}
                className="w-full h-auto mx-auto object-contain drop-shadow-[0_35px_80px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ARROWS */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 text-3xl hover:scale-125 transition"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 text-3xl hover:scale-125 transition"
      >
        ›
      </button>
    </section>
  );
}
