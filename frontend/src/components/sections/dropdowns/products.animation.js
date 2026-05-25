export const dropdownVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 24, scale: 0.98 },
};

export const cardHover = {
  whileHover: { y: -6, scale: 1.02 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
};
