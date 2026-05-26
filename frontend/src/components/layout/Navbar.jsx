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
    { label: "All Services →", href: "/services", sub: "See full catalogue", highlight: true },
  ];

  const NavItem = ({ label, href, sub, highlight }) => (
    <Link href={href}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 8, textDecoration: "none", transition: "background 0.15s", marginBottom: 2 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: highlight ? 700 : 600, color: highlight ? "#00d4ff" : "#f1f5f9", margin: 0 }}>{label}</p>
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
      <Link href="/services/enquiry" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, textDecoration: "none", transition: "background 0.15s", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", margin: "0 4px" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
      >
        <span style={{ fontSize: 18 }}>📋</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#00d4ff", margin: 0 }}>Book a Service</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Get a technician in 24hrs</p>
        </div>
      </Link>
    </div>
  );
}

function UserDropdown({ user, onSignOut }) {
  return (
    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 220, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 14, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", padding: "8px", zIndex: 50 }}>
      <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid #1e2d40", marginBottom: 4 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>Hi, {user.name.split(" ")[0]}</p>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{user.email}</p>
      </div>
      {[
        { label: "My Orders", href: "/orders", icon: "📦" },
        { label: "My Wishlist", href: "/profile#wishlist", icon: "❤️" },
        { label: "My Profile", href: "/profile", icon: "👤" },
      ].map(({ label, href, icon }) => (
        <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, textDecoration: "none", color: "#f1f5f9", fontSize: 13, transition: "background 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span>{icon}</span>{label}
        </Link>
      ))}
      <div style={{ height: 1, background: "#1e2d40", margin: "4px 0" }} />
      <button onClick={onSignOut} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "transparent", border: "none", color: "#ef4444", fontSize: 13, width: "100%", cursor: "pointer", transition: "background 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span>🚪</span> Sign Out
      </button>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const hoverTimeout = useRef(null);
  const userDropRef = useRef(null);

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
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) {
        setUserDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
    setUserDropOpen(false);
    router.refresh();
  };

  const navStyle = scrolled
    ? { background: "rgba(10,15,30,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e2d40" }
    : { background: "transparent" };

  const initials = user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "";

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s", ...navStyle }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <PowerLogo />

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
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
            {/* Search */}
            <div style={{ position: "relative" }} className="hidden-mobile">
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

            {/* Cart */}
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

            {/* Auth: user avatar or login/register */}
            {user ? (
              <div ref={userDropRef} style={{ position: "relative" }} className="hidden-mobile">
                <button onClick={() => setUserDropOpen((o) => !o)}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,212,255,0.15)", border: "2px solid rgba(0,212,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4ff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                >
                  {initials}
                </button>
                {userDropOpen && <UserDropdown user={user} onSignOut={signOut} />}
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden-mobile"
                  style={{ padding: "7px 16px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 13, fontWeight: 600, transition: "all 0.2s", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; e.currentTarget.style.borderColor = "#00d4ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"; }}
                >Login</Link>
                <Link href="/register" className="hidden-mobile"
                  style={{ padding: "8px 16px", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
                >Register</Link>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen((o) => !o)} className="show-mobile"
              style={{ padding: 8, background: "transparent", border: "none", cursor: "pointer", color: "#f1f5f9", display: "none" }}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}><path d="M3 12h18M3 6h18M3 18h18" /></svg>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, padding: "16px 24px", overflowY: "auto" }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", padding: "16px 0", borderBottom: "1px solid #1e2d40", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#f1f5f9")}
              >{link.label}</Link>
            ))}
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false); }}
                style={{ fontSize: 20, fontWeight: 700, color: "#ef4444", padding: "16px 0", borderBottom: "1px solid #1e2d40", textDecoration: "none", background: "transparent", border: "none", textAlign: "left", cursor: "pointer" }}
              >Sign Out</button>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                style={{ fontSize: 20, fontWeight: 700, color: "#00d4ff", padding: "16px 0", borderBottom: "1px solid #1e2d40", textDecoration: "none" }}
              >Login / Register</Link>
            )}
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {!user && (
              <Link href="/register" onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 17, borderRadius: 12, textDecoration: "none" }}
              >Create Free Account</Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } }
      `}</style>
    </>
  );
}
