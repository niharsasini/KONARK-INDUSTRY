import Link from "next/link";
import PowerLogo from "./PowerLogo";

/* Fullscreen mobile nav overlay */
export default function MobileMenu({ menuOpen, setMenuOpen, expandedSection, setExpandedSection, wishlistCount, user, signOut }) {
  return (
    <div className={`mobile-menu-overlay${menuOpen ? " open" : ""}`}>
      <div style={{ position: "absolute", top: 16, left: 24, zIndex: 999 }}>
        <PowerLogo />
      </div>

      <button
        onClick={() => setMenuOpen(false)}
        style={{ position: "absolute", top: 12, right: 16, zIndex: 999, background: "transparent", border: "none", cursor: "pointer", color: "var(--slate)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, transition: "color 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-heading)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--slate)")}
        aria-label="Close menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 24, height: 24 }}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="mobile-menu-inner">
        <Link href="/" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Home</Link>

        <div>
          <button
            className="mobile-nav-item"
            style={{ background: "transparent", border: "none", width: "100%", cursor: "pointer" }}
            onClick={() => setExpandedSection((s) => s === "products" ? null : "products")}
          >
            Products
            <span style={{ fontSize: 14, color: "var(--slate)" }}>{expandedSection === "products" ? "▲" : "▾"}</span>
          </button>
          {expandedSection === "products" && (
            <div>
              <Link href="/products?cat=ev-scooter" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>EV Scooters</Link>
              <Link href="/products?cat=e-rickshaw" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>E-Rickshaws</Link>
              <Link href="/products?cat=battery" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>LFP Batteries</Link>
              <Link href="/test-ride" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>Book Test Ride</Link>
              <Link href="/products" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>All Products</Link>
            </div>
          )}
        </div>

        <div>
          <button
            className="mobile-nav-item"
            style={{ background: "transparent", border: "none", width: "100%", cursor: "pointer" }}
            onClick={() => setExpandedSection((s) => s === "services" ? null : "services")}
          >
            Services
            <span style={{ fontSize: 14, color: "var(--slate)" }}>{expandedSection === "services" ? "▲" : "▾"}</span>
          </button>
          {expandedSection === "services" && (
            <div>
              <Link href="/services/enquiry" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>AC Repair & Service</Link>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={() => setMenuOpen(false)} style={{ display: "block" }}>EV Charging Station Install ↗</a>
              <Link href="/battery-swap" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>Battery Swap</Link>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={() => setMenuOpen(false)} style={{ display: "block" }}>Solar Power Plant ↗</a>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={() => setMenuOpen(false)} style={{ display: "block" }}>Wind Power Plant ↗</a>
              <Link href="/services" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>All Services</Link>
            </div>
          )}
        </div>

        <Link href="/about" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/contact" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link href="/wishlist" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>❤️ My Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}</Link>

        {user ? (
          <button
            onClick={() => { signOut(); setMenuOpen(false); }}
            className="mobile-nav-item"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--red)", width: "100%", textAlign: "left" }}
          >
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="mobile-nav-item" style={{ color: "var(--sky)", fontWeight: 700 }} onClick={() => setMenuOpen(false)}>
            Login / Register
          </Link>
        )}

        <div className="mobile-menu-actions">
          <Link className="mobile-btn-primary" href="/products" onClick={() => setMenuOpen(false)}>Shop Products</Link>
          <Link className="mobile-btn-purple" href="/battery-swap" onClick={() => setMenuOpen(false)}>🔋 Battery Swap</Link>
          <Link className="mobile-btn-ghost" href="/services/enquiry" onClick={() => setMenuOpen(false)}>Book a Service</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(92,103,149,0.1)" }}>
          <a href="tel:+919437611129" style={{ fontSize: 22, color: "var(--sky)", fontWeight: 800, display: "block", marginBottom: 6, textDecoration: "none" }}>
            📞 +91 94376 11129
          </a>
          <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>konarkindustrie@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
