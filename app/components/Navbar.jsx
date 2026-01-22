"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import ProductDropdown from "./Productdropdown";
import ServiceDropdown from "./Servicedropdown";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [productOpen, setProductOpen] = useState(false); // product dropdown
  const [serviceOpen, setServiceOpen] = useState(false); // service dropdown

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
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="h-[64px] flex items-center text-white relative">
          {/* ================= BEFORE SCROLL ================= */}
          {!visible ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-[24px] font-bold tracking-wide">
                KONARK
              </span>

              <div className="relative w-[240px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-white text-black text-sm pl-10 pr-4 py-2 rounded-full outline-none"
                />
              </div>
            </div>
          ) : (
            /* ================= AFTER SCROLL ================= */
            <div className="flex items-center w-full">
              <div className="flex items-center gap-6">
                <span className="text-[24px] font-bold tracking-wide">
                  KONARK
                </span>

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

              <div className="flex items-center gap-15 text-[16px] font-medium ml-auto">
                <Link
                  href="/aboutus"
                  className="hidden md:block hover:text-gray-300"
                >
                  About Us
                </Link>

                <Link href="#" className="hidden md:block hover:text-gray-300">
                  Contact Us
                </Link>
                <Link
                  href="#"
                  className="font-semibold text-[#1ecb6b] hover:text-[#19b85f]"
                >
                  Order now
                </Link>

                {/* MENU BUTTON */}
                <div
                  className="text-[22px] cursor-pointer leading-none"
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
      {visible && menuOpen && <DropdownMenu />}
    </header>
  );
}
