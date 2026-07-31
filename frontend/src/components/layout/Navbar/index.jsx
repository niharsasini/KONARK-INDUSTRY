"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  useEffect(() => {
    const run = async () => {
      try {
        const g = await import("gsap");
        g.default.from(".navbar-root", {
          y: -80, opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        });
      } catch {}
    };
    run();
  }, []);

  const router = useRouter();
  const pathname = usePathname();
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

  const searchPreview = searchQuery.length > 1
    ? ProductData.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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

  const navStyle = scrolled
    ? {
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        borderBottom: "1px solid rgba(13,81,140,0.12)",
        boxShadow:
          "0 4px 24px rgba(13,81,140,0.08), 0 1px 0 rgba(13,81,140,0.06), inset 0 -1px 0 rgba(13,81,140,0.04)",
      }
    : {
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(13,81,140,0.08)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.5)",
      };

  return (
    <>
      <nav className="navbar-root" style={{
        position: "fixed", top: "var(--banner-h, 0px)", left: 0, right: 0,
        zIndex: 1000, transition: "all 0.4s cubic-bezier(0.4,0,0.2,1), top 0.3s ease", ...navStyle,
      }}>
        <div className="navbar-inner">
          <div
            style={{ transition: "transform 0.2s ease", display: "flex" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <PowerLogo />
          </div>

          {/* Desktop center nav */}
          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => handleNavEnter(link.hasDropdown)}
                  onMouseLeave={handleNavLeave}
                >
                  <button
                    className={`navbar-link${activeDropdown === link.hasDropdown ? " active" : ""}`}
                  >
                    {link.label}
                    <span className={`navbar-link-chevron${activeDropdown === link.hasDropdown ? " open" : ""}`}>▾</span>
                  </button>

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
                  className={`navbar-link${pathname === link.href ? " active" : ""}`}
                >
                  {link.label}
                  {pathname === link.href && <span className="navbar-link-dot" />}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <SearchBar
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPreview={searchPreview}
              router={router}
            />

            <div className="nav-right-desktop">
              <Link
                href="/services/enquiry"
                className="ghost-btn-navy"
                style={{
                  height: 40, padding: "0 18px", fontSize: 13, letterSpacing: "0.1px",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", whiteSpace: "nowrap",
                }}
              >
                Book Service
              </Link>
              <Link
                href="/products"
                className="clay-btn clay-btn-primary"
                style={{
                  height: 40, padding: "0 20px", fontSize: 13, letterSpacing: "0.2px",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", whiteSpace: "nowrap", color: "#FFFFFF",
                }}
              >
                Shop Now
              </Link>
            </div>

            {user && <NotificationBell />}

            <Link href="/wishlist" aria-label="Wishlist" className="navbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke={wishlistCount > 0 ? "#DC2626" : "currentColor"} strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="navbar-icon-badge badge-red">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

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

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`nav-hamburger${menuOpen ? " open" : ""}`}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
        wishlistCount={wishlistCount}
        user={user}
        signOut={signOut}
      />
    </>
  );
}
