"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", hasDropdown: "products" },
  { label: "Services", href: "/services", hasDropdown: "services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function PowerLogo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)" }}>
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
  const EV_LINKS = [
    { label: "EV Scooters", href: "/products/electric-scooter", sub: "Book a test ride" },
    { label: "Electric Motorcycle", href: "/products/electric-motor-cycle", sub: "High performance" },
    { label: "E-Rickshaws", href: "/products/e-rickshaw", sub: "Commercial transport" },
    { label: "Utility Vehicles", href: "/products/utility-vehicle", sub: "Industrial campuses" },
  ];
  const SHOP_LINKS = [
    { label: "BLDC Fans & ACs", href: "/products", sub: "Home appliances" },
    { label: "LFP Batteries", href: "/products/lfp-battery", sub: "Solar & EV batteries" },
    { label: "Inverters & BMS", href: "/products/bms", sub: "Energy management" },
    { label: "Industrial Equipment", href: "/products", sub: "Motors, cold storage" },
  ];
  const SERVICE_LINKS = [
    { label: "AC Repair & Service", href: "/services/enquiry", sub: "Same-day response" },
    { label: "EV Charger Install", href: "/services/enquiry", sub: "Home & commercial" },
    { label: "Solar Installation", href: "/services/enquiry", sub: "Rooftop & industrial" },
    { label: "Battery Swap", href: "/battery-swap", sub: "Hand in dead, drive out charged", isNew: true },
    { label: "All Services →", href: "/services", sub: "See full catalogue", highlight: true },
  ];

  const NavItem = ({ label, href, sub, highlight, isNew }) => (
    <Link href={href}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 8, textDecoration: "none", transition: "background 0.15s", marginBottom: 2 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: highlight ? 700 : 600, color: highlight ? "#00d4ff" : "#f1f5f9", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
          {label}
          {isNew && <span style={{ fontSize: 9, background: "#00d4ff", color: "#0a0f1e", padding: "1px 5px", borderRadius: 3, fontWeight: 800, letterSpacing: "0.05em" }}>NEW</span>}
        </p>
        <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{sub}</p>
      </div>
    </Link>
  );

  return (
    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8, width: 720, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, boxShadow: "0 25px 50px rgba(0,0,0,0.5)", padding: "20px 8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, zIndex: 50 }}>
      <div style={{ padding: "0 16px", borderRight: "1px solid #1e2d40" }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#00d4ff", marginBottom: 10, padding: "0 10px", display: "flex", alignItems: "center", gap: 6 }}>
          🏍 EV Vehicles
          <span style={{ fontSize: 9, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", padding: "1px 6px", borderRadius: 4, color: "#00d4ff" }}>Book a Ride</span>
        </p>
        {EV_LINKS.map((l) => <NavItem key={l.label} {...l} />)}
        <Link href="/test-ride" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", marginTop: 8, background: "#00d4ff", color: "#0a0f1e", fontSize: 12, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
        >Book Test Ride →</Link>
      </div>
      <div style={{ padding: "0 16px", borderRight: "1px solid #1e2d40" }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#10b981", marginBottom: 10, padding: "0 10px", display: "flex", alignItems: "center", gap: 6 }}>
          🛒 Shop Products
          <span style={{ fontSize: 9, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "1px 6px", borderRadius: 4, color: "#10b981" }}>Buy Online</span>
        </p>
        {SHOP_LINKS.map((l) => <NavItem key={l.label} {...l} />)}
        <Link href="/products" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", marginTop: 8, border: "1px solid #1e2d40", color: "#94a3b8", fontSize: 12, fontWeight: 600, borderRadius: 8, textDecoration: "none", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#94a3b8"; }}
        >View All Products</Link>
      </div>
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#a78bfa", marginBottom: 10, padding: "0 10px", display: "flex", alignItems: "center", gap: 6 }}>
          🔧 Services
          <span style={{ fontSize: 9, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", padding: "1px 6px", borderRadius: 4, color: "#a78bfa" }}>Book Online</span>
        </p>
        {SERVICE_LINKS.map((l) => <NavItem key={l.label} {...l} />)}
        <Link href="/services/enquiry" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", marginTop: 8, background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
        >Book a Service →</Link>
      </div>
    </div>
  );
}

function ServicesMegaMenu() {
  return (
    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8, width: 320, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, boxShadow: "0 25px 50px rgba(0,0,0,0.5)", padding: "12px 8px", zIndex: 50 }}>
      <Link href="/services" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, textDecoration: "none", transition: "background 0.15s", marginBottom: 2 }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span style={{ fontSize: 18 }}>🔧</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>All Services</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>AC, electrical, solar & more</p>
        </div>
      </Link>
      <div style={{ height: 1, background: "#1e2d40", margin: "6px 8px" }} />
      <Link href="/services/enquiry" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, textDecoration: "none", transition: "background 0.15s", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", margin: "0 4px 4px" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
      >
        <span style={{ fontSize: 18 }}>📋</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#00d4ff", margin: 0 }}>Book a Service</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Get a technician in 24hrs</p>
        </div>
      </Link>
      <Link href="/battery-swap" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, textDecoration: "none", transition: "background 0.15s", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", margin: "0 4px" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.06)")}
      >
        <span style={{ fontSize: 18 }}>🔋</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
            Battery Swap
            <span style={{ fontSize: 9, background: "#00d4ff", color: "#0a0f1e", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>NEW</span>
          </p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Dead battery? Swap it today</p>
        </div>
      </Link>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [user, setUser] = useState(null);
  const hoverTimeout = useRef(null);

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

  const handleEnter = (key) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveDropdown(key);
  };
  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const signOut = () => {
    localStorage.removeItem("konark_user");
    setUser(null);
    router.refresh();
  };

  const navStyle = scrolled
    ? { background: "rgba(10,15,30,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e2d40" }
    : { background: "transparent" };

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s", ...navStyle }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <PowerLogo />

          {/* Desktop center nav */}
          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.label} style={{ position: "relative" }} onMouseEnter={() => handleEnter(link.hasDropdown)} onMouseLeave={handleLeave}>
                  <Link href={link.href} style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#f1f5f9", borderRadius: 8, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                  >
                    {link.label}
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, opacity: 0.6 }}>
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  </Link>
                  {activeDropdown === link.hasDropdown && (
                    link.hasDropdown === "products" ? <ProductsMegaMenu /> : <ServicesMegaMenu />
                  )}
                </div>
              ) : (
                <Link key={link.label} href={link.href} style={{ padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#f1f5f9", borderRadius: 8, textDecoration: "none", transition: "color 0.2s" }}
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
            {/* Search — desktop only */}
            <div style={{ position: "relative" }} className="nav-right-desktop">
              {searchOpen ? (
                <input autoFocus onBlur={() => setSearchOpen(false)} placeholder="Search products..."
                  style={{ width: 192, background: "#111827", border: "1px solid #1e2d40", color: "#f1f5f9", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4ff")} />
              ) : (
                <button onClick={() => setSearchOpen(true)} style={{ padding: 8, color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer", borderRadius: 8, transition: "color 0.2s", display: "flex", alignItems: "center" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              )}
            </div>

            {/* Desktop CTA buttons */}
            <div className="nav-right-desktop">
              <Link href="/services/enquiry" style={{ padding: "8px 16px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 13, fontWeight: 600, transition: "all 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Book Service</Link>
              <Link href="/products" style={{ padding: "8px 16px", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
              >Shop Now</Link>
            </div>

            {/* Cart — always visible */}
            <Link href="/cart" style={{ position: "relative", padding: 8, color: "#94a3b8", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>0</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="nav-hamburger"
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay${menuOpen ? " open" : ""}`}>
        {/* Logo top-left */}
        <div style={{ position: "absolute", top: 16, left: 24, zIndex: 999 }}>
          <PowerLogo />
        </div>

        {/* Close button top-right */}
        <button
          onClick={() => setMenuOpen(false)}
          style={{ position: "absolute", top: 12, right: 16, zIndex: 999, background: "transparent", border: "none", cursor: "pointer", color: "#f1f5f9", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mobile-menu-inner">
          {/* Home */}
          <Link href="/" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {/* Products — expandable */}
          <div>
            <button
              className="mobile-nav-item"
              style={{ background: "transparent", border: "none", width: "100%", cursor: "pointer" }}
              onClick={() => setExpandedSection((s) => s === "products" ? null : "products")}
            >
              Products
              <span style={{ fontSize: 14, color: "#64748b" }}>{expandedSection === "products" ? "▲" : "▾"}</span>
            </button>
            {expandedSection === "products" && (
              <div>
                <Link href="/products?cat=ev" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>EV Scooters</Link>
                <Link href="/products?cat=rickshaw" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>E-Rickshaws</Link>
                <Link href="/products?cat=battery" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>Batteries</Link>
                <Link href="/products" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>All Products</Link>
              </div>
            )}
          </div>

          {/* Services — expandable */}
          <div>
            <button
              className="mobile-nav-item"
              style={{ background: "transparent", border: "none", width: "100%", cursor: "pointer" }}
              onClick={() => setExpandedSection((s) => s === "services" ? null : "services")}
            >
              Services
              <span style={{ fontSize: 14, color: "#64748b" }}>{expandedSection === "services" ? "▲" : "▾"}</span>
            </button>
            {expandedSection === "services" && (
              <div>
                <Link href="/services/enquiry" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>AC Repair</Link>
                <Link href="/services/enquiry" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>EV Charger</Link>
                <Link href="/battery-swap" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>Battery Swap</Link>
                <Link href="/services" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>All Services</Link>
              </div>
            )}
          </div>

          {/* About */}
          <Link href="/about" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          {/* Contact */}
          <Link href="/contact" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          {/* Auth */}
          {user ? (
            <button
              onClick={() => { signOut(); setMenuOpen(false); }}
              className="mobile-nav-item"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", width: "100%", textAlign: "left" }}
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="mobile-nav-item" style={{ color: "#00d4ff" }} onClick={() => setMenuOpen(false)}>
              Login / Register
            </Link>
          )}

          {/* Action buttons */}
          <div className="mobile-menu-actions">
            <Link className="mobile-btn-primary" href="/products" onClick={() => setMenuOpen(false)}>
              Shop Products
            </Link>
            <Link className="mobile-btn-purple" href="/battery-swap" onClick={() => setMenuOpen(false)}>
              🔋 Battery Swap
            </Link>
            <Link className="mobile-btn-ghost" href="/services/enquiry" onClick={() => setMenuOpen(false)}>
              Book a Service
            </Link>
          </div>

          {/* Contact strip */}
          <div style={{ textAlign: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid #1e2d40" }}>
            <a
              href="tel:+919437611129"
              style={{ fontSize: 22, color: "#00d4ff", fontWeight: 800, display: "block", marginBottom: 6, textDecoration: "none" }}
            >
              📞 +91 94376 11129
            </a>
            <span style={{ fontSize: 13, color: "#64748b" }}>konarkindustrie@gmail.com</span>
          </div>
        </div>
      </div>
    </>
  );
}
