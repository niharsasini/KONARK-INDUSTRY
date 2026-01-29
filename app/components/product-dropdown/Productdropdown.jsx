"use client"; // <-- make sure this is at the top

import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "./animation";
import ProductCarousel from "./ProductCarasoul";
import MenuColumn from "./MenuColumn";
import { useRouter } from "next/navigation"; // <-- import router

const ProductDropdown = ({ open }) => {
  const router = useRouter(); // <-- initialize router

  const handleExploreClick = () => {
    router.push("/products"); // <-- navigate to your ProductPage
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed left-1/2 top-[62px] z-50 w-[1120px]
          -translate-x-1/2 rounded-3xl bg-white border border-gray-100
          shadow-[0_30px_80px_rgba(0,0,0,0.12)]
          max-h-[calc(100vh-96px)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-12 pt-8 pb-4">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Products & Ecosystem
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              Powering the Next-Gen Electric Future
            </h2>
          </div>

          {/* Carousel */}
          <ProductCarousel />

          {/* Divider */}
          <div className="mx-12 h-px bg-gray-100" />

          {/* Footer */}
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
              <p className="text-gray-500">
                Designed for India.
                <br />
                Built for the world.
              </p>
              <button
                onClick={handleExploreClick} // <-- navigate on click
                className="mt-5 w-fit rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Explore All Products →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDropdown;
