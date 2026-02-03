"use client";

import Link from "next/link";

export default function HeroLeft({ data }) {
  return (
    <div className="flex-1 text-center lg:text-left">
      <p className="text-sm md:text-base tracking-widest uppercase text-yellow-400 mb-3 animate-fadeUp">
        {data.tagline}
      </p>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fadeUp delay-100">
        {data.title}{" "}
        <span className="font-extrabold text-orange-500">{data.bold}</span>
      </h1>

      <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 max-w-md lg:max-w-lg mx-auto lg:mx-0 animate-fadeUp delay-200">
        {data.description}
      </p>

      <p className="italic text-gray-400 text-xs sm:text-sm md:text-base mb-6 max-w-sm lg:max-w-md mx-auto lg:mx-0 animate-fadeUp delay-300">
        {data.quote}
      </p>

      <ul className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 mb-8 text-xs sm:text-sm md:text-base font-medium text-white animate-fadeUp delay-400">
        {data.highlights.map((item) => (
          <li
            key={item}
            className="bg-yellow-600/20 hover:bg-yellow-500/30 transition rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5 md:gap-6 animate-fadeUp delay-500">
        <button className="bg-yellow-500 text-gray-900 font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-xl hover:bg-yellow-400 transition">
          Explore Solutions →
        </button>

        <Link
          href="/partnerwithus"
          className="border border-orange-500 text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-orange-500 hover:text-gray-900 transition flex items-center justify-center"
        >
          Partner With Us →
        </Link>
      </div>
    </div>
  );
}
