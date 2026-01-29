"use client";

export default function HeroLeft({ data }) {
  return (
    <div className="flex-1 text-center lg:text-left">
      <p className="text-sm md:text-base tracking-widest uppercase text-yellow-400 mb-3 animate-fadeUp">
        {data.tagline}
      </p>

      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight animate-fadeUp delay-100">
        {data.title}{" "}
        <span className="font-extrabold text-orange-500">{data.bold}</span>
      </h1>

      <p className="text-gray-300 text-base md:text-lg mb-4 max-w-lg animate-fadeUp delay-200">
        {data.description}
      </p>

      <p className="italic text-gray-400 text-sm md:text-base mb-6 max-w-md animate-fadeUp delay-300">
        {data.quote}
      </p>

      <ul className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mb-8 text-sm md:text-base font-medium text-white animate-fadeUp delay-400">
        {data.highlights.map((item) => (
          <li
            key={item}
            className="bg-yellow-600/20 hover:bg-yellow-500/30 transition rounded-full px-4 py-1 md:px-5 md:py-2"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-fadeUp delay-500">
        <button className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-xl hover:bg-yellow-400 transition">
          Explore Solutions →
        </button>
        <button className="border border-orange-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-gray-900 transition">
          Partner With Us →
        </button>
      </div>
    </div>
  );
}
