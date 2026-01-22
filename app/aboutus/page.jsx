import React from "react";

export default function page() {
  return (
    <div className="bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            About Us
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Powering a Smarter, Sustainable Future
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-gray-300 text-lg">
            We deliver innovative energy and technology solutions that transform
            the way people live, move, and power their world.
          </p>
        </div>
      </section>

      {/* COMPANY STORY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold">Who We Are</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We are a technology-driven company focused on delivering
              high-quality electric vehicles, energy-efficient appliances, and
              advanced power solutions. Our mission is to make sustainable and
              smart technology accessible to homes, businesses, and industries.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              With a strong focus on innovation, reliability, and customer
              satisfaction, we aim to shape the future of clean energy and
              intelligent living.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-100 p-8">
            <h3 className="text-xl font-semibold">Our Journey</h3>
            <p className="mt-3 text-gray-600">
              Started with a vision to redefine energy solutions, we have grown
              into a trusted provider of EVs, batteries, smart appliances, and
              energy storage systems.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              To provide innovative, energy-efficient, and sustainable solutions
              that empower individuals and businesses to reduce costs and
              environmental impact.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold">Our Vision</h3>
            <p className="mt-4 text-gray-600">
              To become a global leader in smart energy and technology
              solutions, driving a cleaner and more connected future.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center">Why Choose Us</h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Innovation",
              desc: "Cutting-edge technology designed for future needs.",
            },
            {
              title: "Energy Efficient",
              desc: "Solutions that save power and reduce costs.",
            },
            {
              title: "Trusted Quality",
              desc: "Built with reliability, safety, and performance in mind.",
            },
            {
              title: "Customer First",
              desc: "Dedicated support and long-term partnerships.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-3 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">Our Core Values</h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-300">
            We are driven by principles that guide every decision we make.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Sustainability",
              "Integrity",
              "Innovation",
              "Excellence",
              "Trust",
              "Growth",
            ].map((value) => (
              <div key={value} className="rounded-xl bg-gray-800 p-6">
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">
            Ready to Power Your Future?
          </h2>
          <p className="mt-4 text-gray-600">
            Explore our services and discover how we can help you move towards
            smarter energy solutions.
          </p>
          <button className="mt-8 rounded-full bg-gray-900 px-8 py-3 text-white font-medium hover:bg-gray-800 transition">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
