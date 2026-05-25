"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", hasDropdown: true },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PRODUCT_CATEGORIES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    name: "EV & Mobility",
    desc: "Scooters, motorcycles & e-rickshaws",
    href: "/products",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2" />
      </svg>
    ),
    name: "Energy Storage",
    desc: "LFP batteries, BMS & chargers",
    href: "/products",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    name: "Home Appliances",
    desc: "BLDC fans, ACs & smart devices",
    href: "/products",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    name: "Industrial Solutions",
    desc: "Motors, cold storage & automation",
    href: "/products",
  },
];

function PowerLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
          <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" fill="#00d4ff" />
        </svg>
      </div>
      <div style={{ lineHeight: 1 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>KONARK</span>
        <span style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#00d4ff" }}>INDUSTRY</span>
      </div>
    </Link>
  );
}

function ProductsMegaMenu() {
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: 8,
        width: 680,
        background: "#0f172a",
        border: "1px solid #1e2d40",
        borderRadius: 16,
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        padding: 24,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        zIndex: 50,
      }}
    >
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "#94a3b8", marginBottom: 12 }}>
          Browse by category
        </p>
        {PRODUCT_CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid transparent", transition: "all 0.15s", marginBottom: 4, textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.05)"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <span style={{ color: "#00d4ff", flexShrink: 0 }}>{cat.icon}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{cat.name}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "#94a3b8", marginBottom: 12 }}>
          Featured product
        </p>
        <div style={{ padding: 16, borderRadius: 12, border: "1px solid rgba(0,212,255,0.2)", background: "rgba(0,212,255,0.05)" }}>
          <div style={{ height: 100, background: "#111827", borderRadius: 8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/productimg/Electric Scooter.png" alt="Electric Scooter" style={{ height: "100%", objectFit: "contain" }} />
          </div>
          <p style={{ fontSize: 11, color: "#00d4ff", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Best Seller</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>Konark X1 Electric Scooter</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 10px" }}>Range: 200km · Motor: 1000W · ₹27,000</p>
          <Link href="/products/electric-scooter" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "none" }}>
            View details →
          </Link>
        </div>
        <Link href="/products" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#00d4ff", fontWeight: 500, marginTop: 16, textDecoration: "none" }}>
          View all 50+ products →
        </Link>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productsHover, setProductsHover] = useState(false);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleProductsEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setProductsHover(true);
  };
  const handleProductsLeave = () => {
    hoverTimeout.current = setTimeout(() => setProductsHover(false), 150);
  };

  const navStyle = scrolled
    ? { background: "rgba(10,15,30,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e2d40" }
    : { background: "transparent" };

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s", ...navStyle }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <PowerLogo />

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.label} style={{ position: "relative" }} onMouseEnter={handleProductsEnter} onMouseLeave={handleProductsLeave}>
                  <Link
                    href={link.href}
                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#f1f5f9", borderRadius: 8, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                  >
                    {link.label}
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, opacity: 0.6 }}>
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  </Link>
                  {productsHover && <ProductsMegaMenu />}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#f1f5f9", borderRadius: 8, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search (hidden on mobile) */}
            <div style={{ position: "relative" }} className="hidden-mobile">
              {searchOpen ? (
                <input
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  placeholder="Search products..."
                  style={{ width: 192, background: "#111827", border: "1px solid #1e2d40", color: "#f1f5f9", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")}
                />
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  style={{ padding: 8, color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer", borderRadius: 8, transition: "color 0.2s", display: "flex", alignItems: "center" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" style={{ position: "relative", padding: 8, color: "#94a3b8", borderRadius: 8, display: "flex", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                0
              </span>
            </Link>

            {/* Shop Now (desktop) */}
            <Link
              href="/products"
              className="hidden-mobile"
              style={{ padding: "8px 16px", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
            >
              Shop Now
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="show-mobile"
              style={{ padding: 8, background: "transparent", border: "none", cursor: "pointer", color: "#f1f5f9", display: "none" }}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "#0a0f1e", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #1e2d40" }}>
            <PowerLogo />
            <button onClick={() => setMobileOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#f1f5f9" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, padding: "16px 24px" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", padding: "16px 0", borderBottom: "1px solid #1e2d40", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#f1f5f9")}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ padding: 24 }}>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 17, borderRadius: 12, textDecoration: "none" }}
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
