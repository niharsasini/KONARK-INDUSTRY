"use client";

import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "./products.animation";
import ProductCarousel from "./product.carousel.config";
import MenuColumn from "./MenuColumn";
import { useRouter } from "next/navigation";

const ProductDropdown = ({ open }) => {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push("/products");
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            fixed left-1/2 top-[62px] z-50 w-[95%] sm:w-[90%] md:w-[1120px]
            -translate-x-1/2 rounded-3xl bg-white border border-gray-100
            shadow-[0_30px_80px_rgba(0,0,0,0.12)] max-h-[calc(100vh-96px)] overflow-auto
          "
        >
          {/* Header */}
          <motion.div
            className="px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-4 text-center sm:text-left"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Our Top Products
            </p>
            <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
              Powering the Next-Gen Electric Future
            </h2>
          </motion.div>

          {/* Carousel */}
          <motion.div
            className="px-2 sm:px-4 md:px-12 mb-4 sm:mb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <ProductCarousel />
          </motion.div>

          {/* Divider */}
          <motion.div
            className="mx-2 sm:mx-12 h-px bg-gray-100 mb-4 sm:mb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          />

          {/* Footer */}
          <motion.div
            className="flex flex-col sm:flex-row sm:flex-wrap md:grid md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-12 py-4 sm:py-6 text-sm"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Solutions Column */}
            <MenuColumn
              title="Solutions"
              links={[
                "EV Charging",
                "Robotics Arm",
                "Solar Power",
                "Cold Storage Systems",
              ]}
            />

            {/* Company Column with routes */}
            <MenuColumn
              title="Company"
              links={[
                { label: "About Us", path: "/about" },
                { label: "Careers", path: "/careers" },
                { label: "Contact Us", path: "/contactus" },
              ]}
              isNavigable
            />

            {/* Placeholder/empty column if needed */}
            <div></div>

            {/* Explore Button */}
            <div className="flex flex-col justify-between mt-4 sm:mt-0 text-center sm:text-left">
              <p className="text-gray-500 text-sm sm:text-base">
                Designed for India.
                <br />
                Built for the world.
              </p>
              <motion.button
                onClick={handleExploreClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 sm:mt-5 w-full sm:w-fit rounded-full bg-black px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Explore All Products →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDropdown;
