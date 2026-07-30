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
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(24px) saturate(200%)",
        borderBottom: "1px solid rgba(13,81,140,0.1)",
        boxShadow: "0 4px 24px rgba(13,81,140,0.1), 0 1px 0 rgba(255,255,255,0.6)",
      }
    : {
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(13,81,140,0.06)",
        boxShadow: "none",
      };

  return (
    <>
      <nav className="navbar-root" style={{
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
                      padding: "8px 14px", fontSize: 14, fontWeight: activeDropdown === link.hasDropdown ? 700 : 500,
                      color: activeDropdown === link.hasDropdown ? "var(--sky)" : "var(--text-muted)",
                      borderRadius: 8, border: "none",
                      background: activeDropdown === link.hasDropdown ? "rgba(148,163,184,0.08)" : "transparent",
                      cursor: "pointer", letterSpacing: "0.2px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--text-heading)";
                      e.currentTarget.style.background = "rgba(148,163,184,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = activeDropdown === link.hasDropdown ? "var(--sky)" : "var(--text-muted)";
                      e.currentTarget.style.background = activeDropdown === link.hasDropdown ? "rgba(148,163,184,0.08)" : "transparent";
                    }}
                  >
                    {link.label}
                    <svg
                      viewBox="0 0 20 20" fill="currentColor"
                      style={{
                        width: 14, height: 14, color: "var(--slate)", opacity: 0.85,
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
                    padding: "8px 14px", fontSize: 14, letterSpacing: "0.2px",
                    fontWeight: pathname === link.href ? 700 : 500,
                    color: pathname === link.href ? "var(--sky)" : "var(--text-muted)",
                    borderRadius: 8, textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-heading)";
                    e.currentTarget.style.background = "rgba(148,163,184,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = pathname === link.href ? "var(--sky)" : "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span style={{
                      position: "absolute", bottom: -2, left: "50%",
                      transform: "translateX(-50%)", width: 4, height: 4,
                      borderRadius: "50%", background: "var(--sky)",
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
                  padding: "8px 18px", borderRadius: 10, textDecoration: "none",
                  border: "1.5px solid rgba(13,81,140,0.6)", color: "var(--sky)",
                  fontSize: 14, fontWeight: 600,
                  transition: "all 0.25s ease", whiteSpace: "nowrap",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(13,81,140,0.2)";
                  e.currentTarget.style.borderColor = "var(--sky)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(13,81,140,0.6)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Book Service
              </Link>
              <Link
                href="/products"
                className="btn-ripple btn-shimmer btn-press"
                style={{
                  padding: "8px 20px",
                  background: "var(--grad-primary)",
                  color: "#FFFFFF", fontSize: 14, fontWeight: 700,
                  borderRadius: 10, textDecoration: "none",
                  transition: "all 0.25s ease", whiteSpace: "nowrap",
                  boxShadow: "0 4px 14px rgba(13,81,140,0.35)",
                  display: "inline-block",
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(13,81,140,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(13,81,140,0.35)";
                }}
              >
                Shop Now
              </Link>
            </div>

            {user && <NotificationBell />}

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{
                position: "relative", width: 40, height: 40, color: "var(--slate)",
                background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--neu-shadow)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", textDecoration: "none", cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sky)"; e.currentTarget.style.boxShadow = "var(--neu-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.boxShadow = "var(--neu-shadow)"; e.currentTarget.style.transform = "translateY(0)"; }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = "var(--neu-pressed)"; e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = "var(--neu-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#FFFFFF", fontSize: 10, fontWeight: 800, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(13,81,140,0.4)" }}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              style={{
                position: "relative", width: 40, height: 40, color: "var(--slate)",
                background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--neu-shadow)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", textDecoration: "none", cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sky)"; e.currentTarget.style.boxShadow = "var(--neu-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.boxShadow = "var(--neu-shadow)"; e.currentTarget.style.transform = "translateY(0)"; }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = "var(--neu-pressed)"; e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = "var(--neu-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "linear-gradient(135deg, #0D518C, #0EA5E9)", color: "#FFFFFF", fontSize: 10, fontWeight: 800, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(13,81,140,0.4)" }}>
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
