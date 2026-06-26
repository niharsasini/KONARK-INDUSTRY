"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productOpen, setProductOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [user, setUser] = useState(null);
  const productsTimerRef = useRef(null);
  const servicesTimerRef = useRef(null);

  const searchPreview = searchQuery.length > 1
    ? ProductData.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setProductOpen(false);
        setServiceOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openProducts = () => {
    clearTimeout(productsTimerRef.current);
    clearTimeout(servicesTimerRef.current);
    servicesTimerRef.current = setTimeout(() => setServiceOpen(false), 0);
    setProductOpen(true);
  };
  const closeProducts = () => {
    productsTimerRef.current = setTimeout(() => setProductOpen(false), 200);
  };
  const keepProducts = () => {
    clearTimeout(productsTimerRef.current);
    setProductOpen(true);
  };

  const openServices = () => {
    clearTimeout(servicesTimerRef.current);
    clearTimeout(productsTimerRef.current);
    productsTimerRef.current = setTimeout(() => setProductOpen(false), 0);
    setServiceOpen(true);
  };
  const closeServices = () => {
    servicesTimerRef.current = setTimeout(() => setServiceOpen(false), 200);
  };
  const keepServices = () => {
    clearTimeout(servicesTimerRef.current);
    setServiceOpen(true);
  };

  const closeAll = () => {
    setProductOpen(false);
    setServiceOpen(false);
  };

  const signOut = () => {
    localStorage.removeItem("konark_user");
    setUser(null);
    router.refresh();
  };

  const navStyle = scrolled
    ? { background: "rgba(245, 240, 232, 0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #d4c9b8", boxShadow: "0 2px 20px rgba(26,15,0,0.08)" }
    : { background: "rgba(245, 240, 232, 0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(212,201,184,0.5)" };

  return (
    <>
      <nav style={{ position: "fixed", top: "var(--banner-h, 0px)", left: 0, right: 0, zIndex: 999, transition: "all 0.3s, top 0.3s ease", ...navStyle }}>
        <div className="navbar-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <PowerLogo />

          {/* Desktop center nav */}
          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={link.hasDropdown === "products" ? openProducts : openServices}
                  onMouseLeave={link.hasDropdown === "products" ? closeProducts : closeServices}
                >
                  <Link
                    href={link.href}
                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#6b5a45", borderRadius: 8, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1a0f00")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5a45")}
                  >
                    {link.label}
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, opacity: 0.6 }}>
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  </Link>
                  <AnimatePresence>
                    {link.hasDropdown === "products" && productOpen && (
                      <ProductsMegaMenu
                        key="products-menu"
                        onPanelEnter={keepProducts}
                        onPanelLeave={closeProducts}
                      />
                    )}
                    {link.hasDropdown === "services" && serviceOpen && (
                      <ServicesMegaMenu
                        key="services-menu"
                        onPanelEnter={keepServices}
                        onPanelLeave={closeServices}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeAll}
                  style={{ position: "relative", padding: "8px 14px", fontSize: 14, fontWeight: pathname === link.href ? 700 : 500, color: pathname === link.href ? "#0f4c81" : "#6b5a45", borderRadius: 8, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a0f00")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = pathname === link.href ? "#0f4c81" : "#6b5a45")}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: "#0f4c81" }} />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search — desktop only */}
            <SearchBar
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPreview={searchPreview}
              router={router}
            />

            {/* Desktop CTA buttons */}
            <div className="nav-right-desktop">
              <Link
                href="/services/enquiry"
                style={{ padding: "8px 16px", borderRadius: 8, textDecoration: "none", border: "2px solid #0f4c81", color: "#0f4c81", fontSize: 13, fontWeight: 700, transition: "all 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0f4c81"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f4c81"; }}
              >
                Book Service
              </Link>
              <Link
                href="/products"
                style={{ padding: "8px 16px", background: "linear-gradient(135deg, #0f4c81, #0a3460)", color: "#fff", fontSize: 13, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "all 0.25s ease", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(15,76,129,0.3)", animation: "pulseNavy 2.5s ease infinite" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,76,129,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,76,129,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Shop Now
              </Link>
            </div>

            {/* Notifications — logged-in users only */}
            {user && <NotificationBell />}

            {/* Wishlist — always visible */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{ position: "relative", padding: 8, color: "#6b5a45", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5a45")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{wishlistCount > 9 ? "9+" : wishlistCount}</span>
              )}
            </Link>

            {/* Cart — always visible */}
            <Link
              href="/cart"
              style={{ position: "relative", padding: 8, color: "#6b5a45", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0f4c81")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5a45")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#0f4c81", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
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
