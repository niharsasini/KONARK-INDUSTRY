export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", hasDropdown: "products" },
  { label: "Services", href: "/services", hasDropdown: "services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const DROPDOWN_VARIANTS = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};
