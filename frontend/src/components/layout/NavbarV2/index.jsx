"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, animate, useReducedMotion } from "framer-motion";
import { useCartStore, useWishlistStore } from "@/store";
import { products as ProductData } from "@/components/product/ProductData";
import NotificationBell from "@/components/ui/NotificationBell";
import { NAV_LINKS } from "../Navbar/constants";
import ProductsMegaMenu from "../Navbar/ProductsMegaMenu";
import ServicesMegaMenu from "../Navbar/ServicesMegaMenu";
import SearchBar from "../Navbar/SearchBar";
import MobileMenuV2 from "./MobileMenuV2";
import "./navbar-v2.css";

const SPRING = { type: "spring", stiffness: 380, damping: 32 };

/*
 * Every pill is fully visible in the server-rendered HTML. Motion only
 * enhances it after hydration: the entrance drops the pills in from above
 * (with a timeout that force-restores them if the animation never runs),
 * and scroll hide/show moves the whole header.
 */
export default function NavbarV2() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [user, setUser] = useState(null);
  const closeTimerRef = useRef(null);
  const lastY = useRef(0);
  const rootRef = useRef(null);

  const searchPreview = searchQuery.length > 1
    ? ProductData.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Entrance: staggered drop-in (logo -> links -> actions). Enhancement only.
  useEffect(() => {
    if (reduce || !rootRef.current) return;
    const pills = [...rootRef.current.querySelectorAll("[data-pill]")];
    const controls = pills.map((el, i) =>
      animate(el, { y: [-90, 0], opacity: [0, 1] }, { type: "spring", stiffness: 260, damping: 22, delay: 0.1 + i * 0.09 })
    );
    const restore = () => pills.forEach((el) => { el.style.opacity = ""; el.style.transform = ""; });
    const safety = setTimeout(() => { controls.forEach((c) => c.stop()); restore(); }, 2500);
    Promise.all(controls).then(() => { clearTimeout(safety); restore(); }).catch(() => {});
    return () => { clearTimeout(safety); controls.forEach((c) => c.stop()); restore(); };
  }, [reduce]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > lastY.current + 4 && y > 120) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const read = () => {
      try {
        const s = localStorage.getItem("konark_user");
        setUser(s ? JSON.parse(s) : null);
      } catch { setUser(null); }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setActiveDropdown(null); setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setActiveDropdown(null); setMenuOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  const handleNavEnter = (menu) => { clearTimeout(closeTimerRef.current); setActiveDropdown(menu); };
  const handleNavLeave = () => { closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 200); };
  const handleDropdownEnter = () => clearTimeout(closeTimerRef.current);

  const signOut = () => {
    localStorage.removeItem("konark_user");
    setUser(null);
    router.refresh();
  };

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const away = !reduce && hidden && !menuOpen && !activeDropdown && !searchOpen;
  const spring = reduce ? { duration: 0 } : SPRING;
  const hoverProps = reduce ? {} : { whileHover: { scale: 1.03 }, whileTap: { scale: 0.95 } };
  const pillCls = (extra) => `nv2-pill ${extra}${scrolled ? " compact" : ""}`;

  return (
    <>
      {menuOpen && <div className="nv2-scrim" onClick={() => setMenuOpen(false)} />}

      <motion.header
        ref={rootRef}
        className="nv2-root"
        initial={false}
        animate={{ y: away ? -130 : 0 }}
        transition={spring}
      >
        {/* Pill 1: logo */}
        <div data-pill className={pillCls("nv2-logo")}>
          <Link href="/" aria-label="Konark Industry home">
            <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={56} height={56} priority />
          </Link>
        </div>

        {/* Pill 2: links */}
        <nav data-pill className={pillCls("nv2-links")} aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const showHover = !active && (hovered === link.label || (link.hasDropdown && activeDropdown === link.hasDropdown));
            const inner = (
              <>
                {active && <motion.span layoutId="nv2-active" className="nv2-ind nv2-ind-active" transition={spring} />}
                {showHover && <motion.span layoutId="nv2-hover" className="nv2-ind nv2-ind-hover" transition={spring} />}
                <span className="nv2-label">
                  {link.label}
                  {link.hasDropdown && <span className={`nv2-chev${activeDropdown === link.hasDropdown ? " open" : ""}`}>▾</span>}
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
                <Link href={link.href} className="nv2-link">{inner}</Link>
                {link.hasDropdown === "products" && (
                  <ProductsMegaMenu isOpen={activeDropdown === "products"} onMouseEnter={handleDropdownEnter} onMouseLeave={handleNavLeave} />
                )}
                {link.hasDropdown === "services" && (
                  <ServicesMegaMenu isOpen={activeDropdown === "services"} onMouseEnter={handleDropdownEnter} onMouseLeave={handleNavLeave} />
                )}
              </div>
            ) : (
              <Link key={link.label} href={link.href} className="nv2-link" onMouseEnter={() => setHovered(link.label)}>
                {inner}
              </Link>
            );
          })}
        </nav>

        {/* Pill 3: actions */}
        <div data-pill className={pillCls("nv2-actions")}>
          <SearchBar
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPreview={searchPreview}
            router={router}
          />
          <Link href="/services/enquiry" className="nv2-cta nv2-cta-ghost">Book Service</Link>
          <Link href="/products" className="nv2-cta nv2-cta-solid">Shop Now</Link>

          {user && <div className="nv2-bell"><NotificationBell /></div>}

          <motion.div {...hoverProps}>
            <Link href="/wishlist" aria-label="Wishlist" className="navbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke={wishlistCount > 0 ? "#F87171" : "currentColor"} strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="navbar-icon-badge badge-red">{wishlistCount > 9 ? "9+" : wishlistCount}</span>}
            </Link>
          </motion.div>

          <motion.div {...hoverProps}>
            <Link href="/cart" aria-label="Cart" className="navbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && <span className="navbar-icon-badge badge-navy">{cartCount > 9 ? "9+" : cartCount}</span>}
            </Link>
          </motion.div>

          <motion.div {...hoverProps}>
            <Link href={user ? "/profile" : "/login"} aria-label={user ? "My account" : "Log in"} className="navbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Mobile: menu pill */}
        <div data-pill className={pillCls("nv2-menu")}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`nv2-burger${menuOpen ? " open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        <MobileMenuV2
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
