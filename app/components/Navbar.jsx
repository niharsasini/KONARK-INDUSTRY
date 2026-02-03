"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import ProductDropdown from "./product-dropdown/Productdropdown";
import ServiceDropdown from "./Servicedropdown";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [productOpen, setProductOpen] = useState(false); // mobile product dropdown
  const [serviceOpen, setServiceOpen] = useState(false); // mobile service dropdown

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 60);
      if (window.scrollY <= 60) {
        setMenuOpen(false);
        setProductOpen(false);
        setServiceOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        visible ? "bg-[#3a3a3a] pt-0" : "bg-transparent pt-3"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-[64px] flex items-center text-white relative">
          {/* ================= BEFORE SCROLL ================= */}
          {!visible ? (
            <div className="flex items-center justify-between w-full">
              {/* LOGO */}
              <Link
                href="/"
                className="text-[24px] font-bold tracking-wide cursor-pointer"
              >
                KONARK
              </Link>

              {/* SEARCH */}
              <div className="relative w-[240px] hidden sm:block">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-white text-black text-sm pl-10 pr-4 py-2 rounded-full outline-none"
                />
              </div>

              {/* MOBILE MENU BUTTON */}
              <div
                className="sm:hidden text-[22px] cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? "✕" : "☰"}
              </div>
            </div>
          ) : (
            /* ================= AFTER SCROLL ================= */
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-6">
                {/* LOGO */}
                <Link
                  href="/"
                  className="text-[24px] font-bold tracking-wide cursor-pointer"
                >
                  KONARK
                </Link>

                {/* DESKTOP MENU */}
                <ul className="hidden lg:flex items-center gap-15 text-[16px] font-medium">
                  {/* PRODUCT DROPDOWN */}
                  <li
                    className="relative flex items-center gap-1 cursor-pointer hover:text-gray-300"
                    onMouseEnter={() => setProductOpen(true)}
                    onMouseLeave={() => setProductOpen(false)}
                  >
                    Product <span className="text-[11px]">▾</span>
                    <ProductDropdown open={productOpen} />
                  </li>

                  {/* SERVICE DROPDOWN */}
                  <li
                    className="relative flex items-center gap-1 cursor-pointer hover:text-gray-300"
                    onMouseEnter={() => setServiceOpen(true)}
                    onMouseLeave={() => setServiceOpen(false)}
                  >
                    Services <span className="text-[11px]">▾</span>
                    <ServiceDropdown open={serviceOpen} />
                  </li>

                  <li className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
                    Dealer <span className="text-[11px]">▾</span>
                  </li>
                </ul>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-6 text-[16px] font-medium">
                <Link
                  href="/aboutus"
                  className="hidden md:block hover:text-gray-300"
                >
                  About Us
                </Link>

                <Link
                  href="/contactus"
                  className="hidden md:block hover:text-gray-300"
                >
                  Contact Us
                </Link>

                <Link
                  href="#"
                  className="font-semibold text-[#1ecb6b] hover:text-[#19b85f]"
                >
                  Order now
                </Link>

                {/* MOBILE MENU BUTTON */}
                <div
                  className="lg:hidden text-[22px] cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? "✕" : "☰"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE / FULL MENU ================= */}
      {menuOpen && (
        <div className="lg:hidden bg-[#3a3a3a] text-white w-full py-4 px-6 space-y-3">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#2c2c2c] text-white text-sm pl-8 pr-3 py-2 rounded-full outline-none"
            />
          </div>

          <Link
            href="/aboutus"
            className="block text-lg font-medium hover:text-[#1ecb6b]"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/contactus"
            className="block text-lg font-medium hover:text-[#1ecb6b]"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            href="#"
            className="block text-lg font-semibold text-[#1ecb6b] hover:text-[#19b85f]"
            onClick={() => setMenuOpen(false)}
          >
            Order now
          </Link>

          {/* PRODUCT DROPDOWN */}
          <div>
            <button
              className="flex justify-between items-center w-full text-lg font-medium hover:text-[#1ecb6b]"
              onClick={() => setProductOpen(!productOpen)}
            >
              Product <span className="text-xl">{productOpen ? "▴" : "▾"}</span>
            </button>
            {productOpen && (
              <div className="mt-2 pl-4 border-l border-gray-500">
                <ProductDropdown open={true} />
              </div>
            )}
          </div>

          {/* SERVICES DROPDOWN */}
          <div>
            <button
              className="flex justify-between items-center w-full text-lg font-medium hover:text-[#1ecb6b]"
              onClick={() => setServiceOpen(!serviceOpen)}
            >
              Services{" "}
              <span className="text-xl">{serviceOpen ? "▴" : "▾"}</span>
            </button>
            {serviceOpen && (
              <div className="mt-2 pl-4 border-l border-gray-500">
                <ServiceDropdown open={true} />
              </div>
            )}
          </div>

          {/* DEALER */}
          <div className="text-lg font-medium hover:text-[#1ecb6b] cursor-pointer">
            Dealer
          </div>
        </div>
      )}
    </header>
  );
}
