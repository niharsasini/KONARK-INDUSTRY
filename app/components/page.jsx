"use client";

import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Konark EV Battery Pro",
    description:
      "High-performance lithium-ion battery designed for electric scooters and motorcycles.",
    features: [
      "Fast Charging",
      "Long Lifecycle (2000+ cycles)",
      "Advanced Thermal Safety",
      "Lightweight & Compact",
    ],
    marketFit:
      "Outperforms traditional batteries with higher efficiency and longer lifespan, ideal for Indian road conditions.",
    image: "/battery-1.png",
  },
  {
    id: 2,
    name: "Konark Energy Storage System",
    description:
      "Reliable energy storage solution for homes, businesses, and renewable energy systems.",
    features: [
      "Solar Compatible",
      "High Energy Density",
      "Smart Power Management",
      "Low Maintenance",
    ],
    marketFit:
      "Perfect for power backup and renewable integration with consistent performance and safety.",
    image: "/battery-2.png",
  },
  {
    id: 3,
    name: "Konark Industrial Battery Pack",
    description:
      "Heavy-duty battery solution built for industrial EVs and logistics vehicles.",
    features: [
      "High Load Capacity",
      "Rugged Design",
      "Smart BMS",
      "Extended Warranty",
    ],
    marketFit:
      "Designed for demanding industrial use, reducing downtime and operational costs.",
    image: "/battery-3.png",
  },
];

export default function Page() {
  return (
    <main className="w-full bg-[#f8f8f8] text-black">
      {/* Header */}
      <section className="py-20 text-center bg-gradient-to-r from-[#9a4b1e] via-[#e2a15a] to-[#9a4b1e]">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Products</h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-black/80">
          Powering electric mobility and energy storage with safe, efficient,
          and future-ready battery technology.
        </p>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-12`}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="drop-shadow-2xl"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-3">{product.name}</h2>

              <p className="text-black/80 mb-4">{product.description}</p>

              {/* Features */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm md:text-base">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Market Advantage */}
              <p className="text-sm md:text-base text-black/70 mb-6">
                <strong>Why it stands out:</strong> {product.marketFit}
              </p>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="bg-black text-white px-6 py-3 hover:bg-black/90 transition">
                  Buy Now →
                </button>
                <button className="bg-white border border-black px-6 py-3 hover:bg-gray-100 transition">
                  Request Quote →
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Market Trust Section */}
      <section className="py-20 bg-white text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose Konark Industry?
        </h2>
        <p className="max-w-3xl mx-auto text-black/75 mb-10">
          Our products are engineered with cutting-edge technology, built for
          Indian conditions, and trusted by EV manufacturers and energy
          partners.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 shadow-lg rounded-lg">
            <h3 className="font-semibold text-xl mb-2">Advanced Technology</h3>
            <p className="text-black/70">
              Smart BMS, thermal protection, and fast charging capabilities.
            </p>
          </div>
          <div className="p-6 shadow-lg rounded-lg">
            <h3 className="font-semibold text-xl mb-2">Built for India</h3>
            <p className="text-black/70">
              Designed to perform in high temperatures and rough road
              conditions.
            </p>
          </div>
          <div className="p-6 shadow-lg rounded-lg">
            <h3 className="font-semibold text-xl mb-2">Sustainable Future</h3>
            <p className="text-black/70">
              Eco-friendly manufacturing and long-life battery solutions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
