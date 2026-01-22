"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProductDropdown({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-1/2 top-[62px] z-50 w-[1120px] -translate-x-1/2 rounded-3xl bg-white border border-gray-100 shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
        >
          {/* Header */}
          <div className="px-12 pt-8 pb-5">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Products & Ecosystem
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              Powering the Next-Gen Electric Future
            </h2>
          </div>

          {/* Products */}
          <div className="grid grid-cols-4 gap-8 px-12 py-6">
            {PRODUCTS.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group rounded-2xl bg-[#f7f8fa] hover:bg-white border border-gray-100 hover:shadow-xl cursor-pointer overflow-hidden"
              >
                {/* Image (FIXED) */}
                <div className="relative h-[160px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-[15px]">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-12 h-px bg-gray-100" />

          {/* Bottom Section */}
          <div className="grid grid-cols-4 gap-8 px-12 py-8 text-sm">
            <MenuColumn
              title="Technology"
              links={["Battery Software", "Cell Tech", "Manufacturing"]}
            />
            <MenuColumn
              title="Solutions"
              links={["EV Charging", "Energy Management", "Warranty"]}
            />
            <MenuColumn title="Company" links={["About", "Careers", "News"]} />

            <div className="flex flex-col justify-between">
              <p className="text-gray-500 leading-relaxed">
                Designed for India.
                <br />
                Built for the world.
              </p>
              <button className="mt-5 w-fit rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition">
                Explore ecosystem →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Helpers ---------- */

function MenuColumn({ title, links }) {
  return (
    <div>
      <p className="mb-3 font-semibold text-gray-900">{title}</p>
      <ul className="space-y-2 text-gray-600">
        {links.map((link) => (
          <li key={link} className="cursor-pointer hover:text-black transition">
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Data ---------- */

const PRODUCTS = [
  {
    title: "EV Batteries",
    description: "Advanced lithium battery technology",
    badge: "Gen 3",
    image: "/konark/productevbatterie.png",
  },
  {
    title: "Electric Vehicles",
    description: "Smart electric mobility solutions",
    badge: "New",
    image: "/konark/productevscooty.png",
  },
  {
    title: "Energy Storage",
    description: "Grid-scale and industrial energy systems",
    badge: "Industrial",
    image: "/konark/productenergystored.png",
  },
  {
    title: "Konark Air Conditioner",
    description: "Smart & energy-efficient cooling systems",
    badge: "AI",
    image: "/konark/productac.png",
  },
];
