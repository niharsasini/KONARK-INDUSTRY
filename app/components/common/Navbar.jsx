"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductDropdown from "../productdropdown/ProductDropdown";
import ServiceDropdown from "../service-dropdown/ServiceDropdown";
import ProfieDropdown from "../profile-dropdown/ProfieDropdown";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const isVisible = window.scrollY > 60;
      setVisible(isVisible);

      if (!isVisible) {
        setMenuOpen(false);
        setProductOpen(false);
        setServiceOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          visible ? "bg-[#3a3a3a]" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="h-[64px] flex items-center text-white">
            {!visible ? (
              <div className="flex items-center justify-between w-full">
                <Link href="/" className="text-2xl font-bold">
                  KONARK
                </Link>

                {/* DESKTOP SEARCH + PROFILE */}
                <div className="hidden sm:flex items-center gap-10">
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

                  {/* PROFILE (DESKTOP ONLY) */}
                  <div
                    className="relative hidden sm:block"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <ProfieDropdown open={profileOpen} />
                  </div>
                </div>

                {/* MOBILE MENU ICON */}
                <div
                  className="sm:hidden text-2xl cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? "✕" : "☰"}
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <div className="flex items-center gap-16">
                  <Link href="/" className="text-2xl font-bold">
                    KONARK
                  </Link>

                  <ul className="hidden lg:flex items-center gap-16 text-base">
                    <li
                      className="relative cursor-pointer"
                      onMouseEnter={() => setProductOpen(true)}
                      onMouseLeave={() => setProductOpen(false)}
                    >
                      Product ▾
                      <ProductDropdown open={productOpen} />
                    </li>

                    <li
                      className="relative cursor-pointer"
                      onMouseEnter={() => setServiceOpen(true)}
                      onMouseLeave={() => setServiceOpen(false)}
                    >
                      Services ▾
                      <ServiceDropdown open={serviceOpen} />
                    </li>

                    <li className="cursor-pointer">Dealer ▾</li>
                  </ul>
                </div>

                <div className="flex items-center gap-16 ml-auto">
                  <Link href="/aboutus" className="hidden md:block">
                    About Us
                  </Link>
                  <Link href="/contactus" className="hidden md:block">
                    Contact Us
                  </Link>

                  {/* PROFILE (DESKTOP ONLY) */}
                  <div
                    className="relative hidden sm:block"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <ProfieDropdown open={profileOpen} />
                  </div>

                  <div
                    className="lg:hidden text-2xl cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {menuOpen ? "✕" : "☰"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="sm:hidden fixed top-[64px] left-0 w-full bg-[#3a3a3a] text-white z-40">
          <ul className="flex flex-col divide-y divide-white/10 text-lg">
            <li
              className="px-6 py-4"
              onClick={() => setProductOpen(!productOpen)}
            >
              <div className="flex justify-between items-center">
                Products <span>▾</span>
              </div>
              <ProductDropdown open={productOpen} />
            </li>

            <li
              className="px-6 py-4"
              onClick={() => setServiceOpen(!serviceOpen)}
            >
              <div className="flex justify-between items-center">
                Services <span>▾</span>
              </div>
              <ServiceDropdown open={serviceOpen} />
            </li>

            <li className="px-6 py-4">
              <Link href="/aboutus" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
            </li>

            <li className="px-6 py-4">
              <Link href="/contactus" onClick={() => setMenuOpen(false)}>
                Contact Us
              </Link>
            </li>

            {/* SINGLE PROFILE – MOBILE ONLY */}
            <li className="px-6 py-5 flex justify-center">
              <ProfieDropdown open={profileOpen} />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
