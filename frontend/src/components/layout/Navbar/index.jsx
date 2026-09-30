"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, animate, useReducedMotion, useScroll } from "framer-motion";
import { useCartStore, useWishlistStore } from "@/store";
import { products as ProductData } from "@/components/product/ProductData";
import NotificationBell from "@/components/ui/NotificationBell";
import { NAV_LINKS } from "./constants";
import PowerLogo from "./PowerLogo";
import ProductsMegaMenu from "./ProductsMegaMenu";
import ServicesMegaMenu from "./ServicesMegaMenu";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import "./navbar.css";

const SPRING = { type: "spring", stiffness: 400, damping: 32 };
const POP = { type: "spring", stiffness: 520, damping: 16 };
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function CartBadge({ count, reduce }) {
  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          key={count}
          className="nb-badge"
          initial={reduce ? false : { scale: 0.3 }}
          animate={{ scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={reduce ? { duration: 0 } : POP}
        >
          {count > 9 ? "9+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

/*
 * Floating pill navbar. Every pill is fully visible in the server HTML; Motion only
 * enhances it after hydration (fade-down entrance, sliding active/hover indicators,
 * mega menus). Always visible: fixed at the top for the whole scroll.
 */
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [user, setUser] = useState(null);
  const closeTimerRef = useRef(null);
  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const searchPreview = searchQuery.length > 1
    ? ProductData.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Entrance: fade-down, logo -> links -> actions, 80ms stagger. Enhancement only.
  useIsoLayoutEffect(() => {
    if (reduce || !rootRef.current) return;
    const els = [...rootRef.current.querySelectorAll("[data-pill]")];
    const controls = els.map((el) =>
      animate(el, { y: [-18, 0], opacity: [0, 1] }, { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 + Number(el.dataset.pill) * 0.08 })
    );
    const restore = () => els.forEach((el) => { el.style.opacity = ""; el.style.transform = ""; });
    const safety = setTimeout(() => { controls.forEach((c) => c.stop()); restore(); }, 2500);
    Promise.all(controls).then(() => { clearTimeout(safety); restore(); }).catch(() => {});
    return () => { clearTimeout(safety); controls.forEach((c) => c.stop()); restore(); };
  }, [reduce]);

  // Tighten past 40px (passive listener, state only changes on threshold crossing)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
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

  // Cursor-following spotlight: writes CSS vars directly, no re-render
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const spring = reduce ? { duration: 0 } : SPRING;
  const root = `nb-root${scrolled ? " compact" : ""}`;

  return (
    <>
      {menuOpen && <div className="nb-scrim" onClick={() => setMenuOpen(false)} />}

      <header ref={rootRef} className={root}>
        {/* Logo: bare, no pill */}
        <div data-pill="0" className="nb-pill nb-logo">
          <PowerLogo />
        </div>

        {/* Links pill */}
        <nav data-pill="1" className="nb-pill nb-links" aria-label="Primary" onMouseMove={spot}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const open = link.hasDropdown && activeDropdown === link.hasDropdown;
            const inner = (
              <>
                {active && <motion.span layoutId="nb-active" className="nb-ind-active" transition={spring} />}
                {active && <motion.span layoutId="nb-dot" className="nb-dot" transition={spring} />}
                <span className="nb-label">
                  <span className="nb-roll">
                    <span className="nb-roll-a">{link.label}</span>
                    <span className="nb-roll-b" aria-hidden="true">{link.label}</span>
                  </span>
                  {link.hasDropdown && <span className={`nb-chev${open ? " open" : ""}`}>▾</span>}
                </span>
              </>
            );
            const cls = `nb-link${active ? " active" : ""}${open ? " open" : ""}`;
            return link.hasDropdown ? (
              <div
                key={link.label}
                onMouseEnter={() => handleNavEnter(link.hasDropdown)}
                onMouseLeave={handleNavLeave}
              >
                <Link href={link.href} className={cls}>{inner}</Link>
              </div>
            ) : (
              <Link key={link.label} href={link.href} className={cls}>
                {inner}
              </Link>
            );
          })}
          <motion.span className="nb-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
        </nav>

        {/* Actions pill */}
        <div data-pill="2" className="nb-pill nb-actions" onMouseMove={spot}>
          <SearchBar
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPreview={searchPreview}
            router={router}
          />
          <Link href="/services/enquiry" className="nb-cta nb-cta-ghost">Book Service</Link>
          <Link href="/products" className="nb-cta nb-cta-gold">Shop Now</Link>

          {user && <div className="nb-bell"><NotificationBell /></div>}

          <Link href="/cart" aria-label="Cart" className="nb-icon">
            <CartIcon />
            <CartBadge count={cartCount} reduce={reduce} />
          </Link>

          <Link href={user ? "/profile" : "/login"} aria-label={user ? "My account" : "Log in"} className="nb-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>

        {/* Mobile: one pill with cart + menu */}
        <div data-pill="1" className="nb-pill nb-menu">
          <Link href="/cart" aria-label="Cart" className="nb-icon">
            <CartIcon />
            <CartBadge count={cartCount} reduce={reduce} />
          </Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`nb-burger${menuOpen ? " open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mega menus live outside the pills so their own blur works */}
        <div className="nb-mega-layer">
          <ProductsMegaMenu isOpen={activeDropdown === "products"} onMouseEnter={handleDropdownEnter} onMouseLeave={handleNavLeave} />
          <ServicesMegaMenu isOpen={activeDropdown === "services"} onMouseEnter={handleDropdownEnter} onMouseLeave={handleNavLeave} />
        </div>

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
      </header>
    </>
  );
}
