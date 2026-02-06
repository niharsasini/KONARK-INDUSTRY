"use client";

import React, { memo } from "react";
import { PARTNERS } from "./partners.data";

const stats = [
  { label: "Global Partners", value: "50+" },
  { label: "Countries Served", value: "20+" },
  { label: "Enterprise Clients", value: "100+" },
  { label: "Years of Trust", value: "10+" },
];

const OurPartners = () => {
  return (
    <section className="w-full bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto">
          <span className="text-sm sm:text-base font-semibold text-blue-600 uppercase tracking-wide">
            Our Network
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Trusted by Industry Leaders
          </h2>

          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            We partner with globally recognized organizations and technology
            innovators to ensure reliability, security, and excellence in every
            solution we deliver.
          </p>
        </header>

        {/* Stats with animated glow */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-2xl animate-glow delay-${index * 200}`}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {item.value}
              </h3>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Partners Logos */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 items-center">
          {PARTNERS.map(({ id, name, logo, alt }) => (
            <div
              key={id}
              className="group bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              <img
                src={logo}
                alt={alt}
                loading="lazy"
                className="h-10 sm:h-12 md:h-16 object-contain grayscale group-hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 sm:mt-24 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Interested in Partnering With Us?
          </h3>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Join our growing network of partners and collaborate to build
            innovative, scalable, and impactful solutions.
          </p>

          <button className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 sm:px-10 py-3 sm:py-4 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            Become a Partner
          </button>
        </div>
      </div>

      {/* Tailwind custom animations */}
      <style jsx>{`
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 1);
          }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default memo(OurPartners);
