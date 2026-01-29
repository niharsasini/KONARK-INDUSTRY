"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BoltIcon,
  LightBulbIcon,
  SparklesIcon,
  Cog6ToothIcon,
  HomeIcon,
  TvIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

export default function ServiceDropdown({ open }) {
  const router = useRouter();

  const services = [
    {
      name: "Solar Power Plants",
      description:
        "Complete turnkey solutions for designing, installing, and commissioning solar power plants.",
      icon: <SparklesIcon className="h-6 w-6 text-gray-700" />,
    },
    {
      name: "Robotic Arm Solutions",
      description:
        "Designing and manufacturing precision robotic arms for industrial automation.",
      icon: <Cog6ToothIcon className="h-6 w-6 text-gray-700" />,
    },
    {
      name: "Cold Storage Systems",
      description:
        "End-to-end cold storage design and execution for agriculture and industry.",
      icon: <CubeIcon className="h-6 w-6 text-gray-700" />,
    },
    {
      name: "EV Charging Infrastructure",
      description:
        "Smart and scalable EV charging station solutions for residential and commercial use.",
      icon: <BoltIcon className="h-6 w-6 text-gray-700" />,
    },
  ];

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 200,
      },
    }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-1/2 top-[62px] z-50 -translate-x-1/2 w-[95vw] max-w-[1100px] rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-5 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Our Services
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              Powering the Energy Future
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Explore our advanced energy solutions for homes, industries, and
              mobility.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-8 py-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, scale: 1.03, rotate: 0.5 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                onClick={() => router.push("/services")}
                className="group flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md cursor-pointer transition relative overflow-hidden"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-2 rounded-full bg-gray-100"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {service.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-snug">
                  {service.description}
                </p>

                {/* subtle hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white opacity-0 pointer-events-none"
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-end px-8 pb-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/services")}
              className="w-fit rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Explore Solutions →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
