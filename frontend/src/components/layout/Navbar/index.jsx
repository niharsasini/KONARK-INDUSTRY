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
    const onScroll = () => setScrolled(window.scrollY > 50);
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
        background: "rgba(245,240,232,0.95)",
        backdropFilter: "blur(24px) saturate(200%)",
        borderBottom: "1px solid rgba(212,201,184,0.5)",
        boxShadow: "0 4px 24px rgba(26,15,0,0.06)",
      }
    : {
        background: "rgba(245,240,232,0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(212,201,184,0.3)",
      };

  return (
    <>
      <nav style={{
        position: "fixed", top: "var(--banner-h, 0px)", left: 0, right: 0,
        zIndex: 999, transition: "all 0.4s ease, top 0.3s ease", ...navStyle,
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 24px",
          height: 68, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 24,
        }}>
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
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "8px 16px", fontSize: 14, fontWeight: 500,
                      color: activeDropdown === link.hasDropdown ? "var(--text-heading)" : "var(--text-muted)",
                      borderRadius: 8, border: "none",
                      background: activeDropdown === link.hasDropdown ? "rgba(15,76,129,0.06)" : "transparent",
                      cursor: "pointer", letterSpacing: "0.2px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--text-heading)";
                      e.currentTarget.style.background = "rgba(15,76,129,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = activeDropdown === link.hasDropdown ? "var(--text-heading)" : "var(--text-muted)";
                      e.currentTarget.style.background = activeDropdown === link.hasDropdown ? "rgba(15,76,129,0.06)" : "transparent";
                    }}
                  >
                    {link.label}
                    <svg
                      viewBox="0 0 20 20" fill="currentColor"
                      style={{
                        width: 14, height: 14, opacity: 0.55,
                        transform: activeDropdown === link.hasDropdown ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                        flexShrink: 0,
                      }}
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
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
                  style={{
                    position: "relative", display: "inline-flex", alignItems: "center",
                    padding: "8px 16px", fontSize: 14, letterSpacing: "0.2px",
                    fontWeight: pathname === link.href ? 700 : 500,
                    color: pathname === link.href ? "var(--navy)" : "var(--text-muted)",
                    borderRadius: 8, textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-heading)";
                    e.currentTarget.style.background = "rgba(15,76,129,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = pathname === link.href ? "var(--navy)" : "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span style={{
                      position: "absolute", bottom: 2, left: "50%",
                      transform: "translateX(-50%)", width: 4, height: 4,
                      borderRadius: "50%", background: "var(--navy)",
                    }} />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                style={{
                  padding: "8px 18px", borderRadius: 8, textDecoration: "none",
                  border: "1.5px solid var(--navy)", color: "var(--navy)",
                  fontSize: 14, fontWeight: 600,
                  transition: "all 0.25s ease", whiteSpace: "nowrap",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--navy)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,76,129,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--navy)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Book Service
              </Link>
              <Link
                href="/products"
                style={{
                  padding: "8px 20px",
                  background: "linear-gradient(135deg, var(--navy), var(--navy-dark))",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  borderRadius: 8, textDecoration: "none",
                  transition: "all 0.25s ease", whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(15,76,129,0.3)",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,76,129,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,76,129,0.3)";
                }}
              >
                Shop Now
              </Link>
            </div>

            {user && <NotificationBell />}

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{ position: "relative", padding: 8, color: "var(--text-muted)", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              style={{ position: "relative", padding: 8, color: "var(--text-muted)", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "var(--navy)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
