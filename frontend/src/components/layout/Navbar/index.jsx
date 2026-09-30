"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore, useWishlistStore } from "@/store";
import { products as ProductData } from "@/components/product/ProductData";
import NotificationBell from "@/components/ui/NotificationBell";
import { NAV_LINKS } from "./constants";
import PowerLogo from "./PowerLogo";
import ProductsMegaMenu from "./ProductsMegaMenu";
import ServicesMegaMenu from "./ServicesMegaMenu";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);
  const lastY = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [user, setUser] = useState(null);
  const closeTimerRef = useRef(null);

  const searchPreview = searchQuery.length > 1
    ? ProductData.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > lastY.current && y > 120) setHidden(true);
      else if (y < lastY.current) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("konark_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const handleStorage = () => {
      const s = localStorage.getItem("konark_user");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  // Keyboard close
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setActiveDropdown(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => { return () => clearTimeout(closeTimerRef.current); }, []);

  const handleNavEnter = (menu) => {
    clearTimeout(closeTimerRef.current);
    setActiveDropdown(menu);
  };

  const handleNavLeave = () => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const handleDropdownEnter = () => {
    clearTimeout(closeTimerRef.current);
  };

  const handleDropdownLeave = () => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const signOut = () => {
    localStorage.removeItem("konark_user");
    setUser(null);
    router.refresh();
  };

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const keepVisible = !reduce ? !hidden || menuOpen || activeDropdown || searchOpen : true;

  const spring = reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 };
  const containerVariants = {
    away: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    shown: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const pillVariants = {
    away: reduce ? { opacity: 0 } : { y: -110, opacity: 0 },
    shown: { y: 0, opacity: 1, transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 } },
  };

  const accountHref = user ? "/profile" : "/login";
  const cls = (base) => `${base}${scrolled ? " compact" : ""}`;

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.header
        className="nav-float navbar-root"
        variants={containerVariants}
        initial="away"
        animate={keepVisible ? "shown" : "away"}
      >
        {/* Pill 1: logo */}
        <motion.div variants={pillVariants} className={cls("nav-pill nav-pill-logo")}>
          <PowerLogo size={scrolled ? 44 : 56} />
        </motion.div>

        {/* Pill 2: links (desktop) */}
        <motion.nav
          variants={pillVariants}
          className={cls("nav-pill nav-pill-links")}
          aria-label="Primary"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const showHover = !active && (hovered === link.label || (link.hasDropdown && activeDropdown === link.hasDropdown));
            const inner = (
              <>
                {active && <motion.span layoutId="nav-active" className="nav-indicator nav-indicator-active" transition={spring} />}
                {showHover && <motion.span layoutId="nav-hover" className="nav-indicator nav-indicator-hover" transition={spring} />}
                <span className="nav-link-label">
                  {link.label}
                  {link.hasDropdown && (
                    <span className={`navbar-link-chevron${activeDropdown === link.hasDropdown ? " open" : ""}`}>▾</span>
                  )}
                </span>
              </>
            );
            return link.hasDropdown ? (
              <div
                key={link.label}
                style={{ position: "relative" }}
                onMouseEnter={() => { setHovered(link.label); handleNavEnter(link.hasDropdown); }}
                onMouseLeave={handleNavLeave}
              >
                <Link href={link.href} className="nav-pill-link">{inner}</Link>

                {link.hasDropdown === "products" && (
                  <ProductsMegaMenu
                    isOpen={activeDropdown === "products"}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  />
                )}
                {link.hasDropdown === "services" && (
                  <ServicesMegaMenu
                    isOpen={activeDropdown === "services"}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  />
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="nav-pill-link"
                onMouseEnter={() => setHovered(link.label)}
              >
                {inner}
              </Link>
            );
          })}
        </motion.nav>

        {/* Pill 3: actions (desktop) */}
        <motion.div variants={pillVariants} className={cls("nav-pill nav-pill-actions")}>
          <SearchBar
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPreview={searchPreview}
            router={router}
          />

          <div className="nav-right-desktop nav-cta-group">
            <Link href="/services/enquiry" className="nav-cta nav-cta-ghost nav-cta-secondary">
              Book Service
            </Link>
            <Link href="/products" className="nav-cta nav-cta-solid nav-cta-shop">
              Shop Now
            </Link>
          </div>

          {user && <div className="nav-bell"><NotificationBell /></div>}

          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.95 }}>
            <Link href="/wishlist" aria-label="Wishlist" className="navbar-icon-btn nav-wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke={wishlistCount > 0 ? "#F87171" : "currentColor"} strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="navbar-icon-badge badge-red">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.95 }}>
            <Link href="/cart" aria-label="Cart" className="navbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="navbar-icon-badge badge-navy">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div className="nav-account" whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.95 }}>
            <Link href={accountHref} aria-label={user ? "My account" : "Log in"} className="navbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile menu pill */}
        <motion.div variants={pillVariants} className={cls("nav-pill nav-pill-menu")}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </motion.div>

        <MobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
          wishlistCount={wishlistCount}
          cartCount={cartCount}
          user={user}
          signOut={signOut}
          pathname={pathname}
          reduce={reduce}
        />
      </motion.header>
    </>
  );
}
