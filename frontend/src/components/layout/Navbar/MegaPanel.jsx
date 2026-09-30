"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* Shared glass wrapper for the Products / Services mega menus.
   Fades + slides down 8px with a slight scale; children using MEGA_ITEM stagger in. */
export const MEGA_ITEM = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 32 } },
};
const MEGA_ITEM_STATIC = { hidden: { opacity: 1 }, show: { opacity: 1 } };

export function useMegaItem() {
  return useReducedMotion() ? MEGA_ITEM_STATIC : MEGA_ITEM;
}

export default function MegaPanel({ isOpen, width, onMouseEnter, onMouseLeave, children }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="nb-mega"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ width, x: "-50%", transformOrigin: "top center" }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
          animate={{
            opacity: 1, y: 0, scale: 1,
            transition: reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.035, delayChildren: 0.04 },
          }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14 } }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
