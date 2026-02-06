"use client";

import Link from "next/link";

export default function HeroLeft({ data }) {
  return (
    <div className="relative z-10 max-w-xl xl:max-w-2xl">
      {/* Tagline */}
      <p className="text-xs md:text-sm tracking-widest uppercase text-yellow-400 mb-4">
        {data.tagline}
      </p>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
        {data.title} <span className="block text-orange-500">{data.bold}</span>
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
        {data.description}
      </p>

      {/* Quote */}
      <p className="italic text-gray-400 text-sm md:text-base mb-8 border-l-4 border-yellow-500 pl-4">
        {data.quote}
      </p>

      {/* Highlights */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-sm md:text-base font-medium text-white">
        {data.highlights.map((item) => (
          <li
            key={item}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2"
          >
            {item}
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition">
          Explore Solutions →
        </button>

        <Link
          href="/partnerwithus"
          className="border border-orange-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-gray-900 transition"
        >
          Partner With Us →
        </Link>
      </div>
    </div>
  );
}
