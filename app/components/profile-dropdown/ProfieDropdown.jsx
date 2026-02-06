"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* ================= PROFILE BUTTON ================= */}
      <button
        onClick={() => setOpen(!open)}
        className="
          group flex items-center gap-2 rounded-full px-3 py-1.5
          border border-white/30 bg-white/10 backdrop-blur
          hover:bg-white/20 transition
        "
      >
        {/* Avatar */}
        <div className="relative">
          <div
            className="
              h-8 w-8 rounded-full flex items-center justify-center
              bg-gradient-to-br from-indigo-500 to-cyan-500
              shadow-[0_0_0_2px_rgba(255,255,255,0.35)]
            "
          >
            <User size={16} className="text-white" />
          </div>

          {/* glow */}
          <div
            className="
              absolute inset-0 rounded-full opacity-0
              group-hover:opacity-100 transition
              blur-md bg-cyan-400/40
            "
          />
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================= DROPDOWN ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* mobile overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="
                absolute right-0 mt-4 w-64 z-50
                rounded-2xl bg-[#0f172a] text-white
                border border-cyan-400/30
                shadow-[0_0_30px_rgba(34,211,238,0.15)]
                overflow-hidden

                max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0
                max-md:w-full max-md:rounded-t-2xl
              "
            >
              {/* glow border */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-cyan-400/30" />

              {/* ================= USER INFO ================= */}
              <div className="px-5 py-4 border-b border-white/10">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-white/60 truncate">
                  johndoe@konark.com
                </p>
              </div>

              {/* ================= MENU ================= */}
              <div className="py-2">
                <Item icon={User} label="My Profile" />
                <Item icon={Settings} label="Settings" />
              </div>

              {/* ================= LOGOUT ================= */}
              <div className="border-t border-white/10 py-2">
                <Item icon={LogOut} label="Logout" danger />
              </div>

              <div className="h-2 md:hidden" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= ITEM ================= */
function Item({ icon: Icon, label, danger }) {
  return (
    <button
      className={`
        w-full flex items-center gap-3 px-5 py-2.5 text-sm
        transition
        ${
          danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-white/90 hover:bg-white/10"
        }
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
