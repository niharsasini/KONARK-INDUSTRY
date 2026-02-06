"use client";

import React from "react";
import Image from "next/image";

// Import your images


// Define products with their respective images


export default function DropdownMenu() {
  return (
    <div className="fixed top-[64px] left-0 w-full bg-white shadow-xl border-t z-40">
      <div className="max-w-[1440px] mx-auto px-14 py-10">
        <div className="grid grid-cols-12 gap-12">
          {/* ================= PRODUCTS ================= */}
          <div className="col-span-5">
            <div className="grid grid-cols-3 gap-x-10 gap-y-12">
              {products.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="h-[90px] flex items-center justify-center">
                    {item.img && (
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={120}
                        height={80}
                        className="object-contain rounded-md"
                      />
                    )}
                  </div>

                  <p className="mt-3 font-medium text-black">{item.name}</p>
                  {item.tag && (
                    <span className="text-sm italic text-[#1ecb6b]">
                      {item.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= DIVIDER ================= */}
          <div className="col-span-1 flex justify-center">
            <div className="w-px bg-gray-200 h-full" />
          </div>

          {/* ================= LINKS ================= */}
          <div className="col-span-6 grid grid-cols-4 gap-x-12 text-black">
            <div>
              <h4 className="text-gray-400 mb-5">Tech & Design</h4>
              <ul className="space-y-4 font-medium">
                <li>Software</li>
                <li>Cell Tech</li>
                <li>Manufacturing</li>
                <li>Design</li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-400 mb-5">Ownership</h4>
              <ul className="space-y-4 font-medium">
                <li>Electric Store</li>
                <li>Hypercharger</li>
                <li>Community</li>
                <li>Referrals</li>
                <li>Hyperservice</li>
                <li>Battery Warranty</li>
                <li>Emi Calculator</li>
                <li>Accessories</li>
                <li>Charger Refund</li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-400 mb-5">Our Company</h4>
              <ul className="space-y-4 font-medium">
                <li>About Us</li>
                <li>Investor Relations</li>
                <li>News & Events</li>
                <li>Blogs</li>
                <li>Careers</li>
                <li>Partner with us</li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-400 mb-5">Account</h4>
              <ul className="space-y-4 font-medium">
                <li>Sign in</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
