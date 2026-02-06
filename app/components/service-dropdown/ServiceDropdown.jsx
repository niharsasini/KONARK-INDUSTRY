"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BoltIcon,
  SparklesIcon,
  Cog6ToothIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

export default function ServiceDropdown({ open }) {
  const router = useRouter();

  const services = [
    {
      name: "Solar Power Plants",
      description:
        "Complete turnkey solutions for designing, installing, and commissioning solar power plants.",
      icon: <SparklesIcon className="h-5 w-5 text-gray-700" />,
    },
    {
      name: "Robotic Arm Solutions",
      description:
        "Designing and manufacturing precision robotic arms for industrial automation.",
      icon: <Cog6ToothIcon className="h-5 w-5 text-gray-700" />,
    },
    {
      name: "Cold Storage Systems",
      description:
        "End-to-end cold storage design and execution for agriculture and industry.",
      icon: <CubeIcon className="h-5 w-5 text-gray-700" />,
    },
    {
      name: "EV Charging Infrastructure",
      description:
        "Smart and scalable EV charging station solutions for residential and commercial use.",
      icon: <BoltIcon className="h-5 w-5 text-gray-700" />,
    },
  ];

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, type: "spring", stiffness: 180 },
    }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="
            fixed left-1/2 top-[62px] z-50 -translate-x-1/2
            w-[95vw] sm:w-[90%] max-w-[1100px]
            rounded-2xl bg-white border border-gray-200 shadow-lg overflow-auto
          "
          style={{ maxHeight: "70vh" }} // reduced dropdown height
        >
          {/* Header */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 pt-3 pb-2 border-b border-gray-100 text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Our Services
            </p>
            <h2 className="mt-1 text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-snug">
              Powering the Energy Future
            </h2>
            <p className="mt-1 text-[10px] sm:text-sm text-gray-600 max-w-xs sm:max-w-lg mx-auto sm:mx-0">
              Explore our advanced energy solutions for homes, industries, and
              mobility.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4 md:px-8 lg:px-12 py-2 sm:py-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={() => router.push("/services")}
                className="
                  group flex flex-col p-2 sm:p-3 rounded-lg
                  bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md
                  cursor-pointer transition relative overflow-hidden
                  h-28 sm:h-32 md:h-36
                "
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 250 }}
                    className="p-1 sm:p-2 rounded-full bg-gray-100"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-sm">
                    {service.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm leading-snug line-clamp-3">
                  {service.description}
                </p>

                {/* subtle hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white opacity-0 pointer-events-none"
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center sm:justify-end px-2 sm:px-6 md:px-8 lg:px-12 pb-2 sm:pb-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/services")}
              className="w-full sm:w-fit rounded-full bg-gray-900 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Explore Solutions →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
