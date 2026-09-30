"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PowerLogo from "./PowerLogo";

/* Scrim + right-side sliding drawer for mobile nav */
export default function MobileMenu({ menuOpen, setMenuOpen, expandedSection, setExpandedSection, wishlistCount, user, signOut }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const close = () => setMenuOpen(false);

  const submitSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      close();
    }
  };

  return (
    <>
      <div className={`mobile-menu-scrim${menuOpen ? " open" : ""}`} onClick={close} />

      <div className={`mobile-menu-drawer${menuOpen ? " open" : ""}`}>
        <div className="mobile-menu-header">
          <PowerLogo />
          <button className="mobile-menu-close" onClick={close} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mobile-menu-search-wrap">
          <span className="mobile-menu-search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            className="mobile-menu-search-input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={submitSearch}
          />
        </div>

        <nav className="mobile-menu-nav">
          <Link href="/" className="mobile-nav-item" onClick={close}>Home</Link>

          <div>
            <button
              className="mobile-nav-item"
              onClick={() => setExpandedSection((s) => (s === "products" ? null : "products"))}
            >
              Products
              <span className={`mobile-nav-item-arrow${expandedSection === "products" ? " open" : ""}`}>▾</span>
            </button>
            {expandedSection === "products" && (
              <div>
                <Link href="/products?cat=ev-scooter" className="mobile-nav-sub" onClick={close}>EV Scooters</Link>
                <Link href="/products?cat=e-rickshaw" className="mobile-nav-sub" onClick={close}>E-Rickshaws</Link>
                <Link href="/products?cat=battery" className="mobile-nav-sub" onClick={close}>LFP Batteries</Link>
                <Link href="/test-ride" className="mobile-nav-sub" onClick={close}>Book Test Ride</Link>
                <Link href="/products" className="mobile-nav-sub" onClick={close}>All Products</Link>
              </div>
            )}
          </div>

          <div>
            <button
              className="mobile-nav-item"
              onClick={() => setExpandedSection((s) => (s === "services" ? null : "services"))}
            >
              Services
              <span className={`mobile-nav-item-arrow${expandedSection === "services" ? " open" : ""}`}>▾</span>
            </button>
            {expandedSection === "services" && (
              <div>
                <Link href="/services/enquiry" className="mobile-nav-sub" onClick={close}>AC Repair & Service</Link>
                <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={close}>EV Charging Station Install ↗</a>
                <Link href="/battery-swap" className="mobile-nav-sub" onClick={close}>Battery Swap</Link>
                <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={close}>Solar Power Plant ↗</a>
                <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={close}>Wind Power Plant ↗</a>
                <Link href="/services" className="mobile-nav-sub" onClick={close}>All Services</Link>
              </div>
            )}
          </div>

          <Link href="/about" className="mobile-nav-item" onClick={close}>About</Link>
          <Link href="/contact" className="mobile-nav-item" onClick={close}>Contact</Link>

          <div className="mobile-menu-divider" />

          <Link href="/wishlist" className="mobile-nav-item" onClick={close}>
            ❤️ My Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>

          {user ? (
            <button
              onClick={() => { signOut(); close(); }}
              className="mobile-nav-item"
              style={{ color: "var(--red)" }}
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="mobile-nav-item" style={{ color: "var(--sky)", fontWeight: 700 }} onClick={close}>
              Login / Register
            </Link>
          )}

          <div className="mobile-menu-divider" />

          <div style={{ textAlign: "center", padding: "12px 14px 4px" }}>
            <a href="tel:+919437611129" style={{ fontSize: 18, color: "var(--sky)", fontWeight: 800, display: "block", marginBottom: 4, textDecoration: "none" }}>
              📞 +91 94376 11129
            </a>
            <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>konarkindustrie@gmail.com</span>
          </div>
        </nav>

        <div className="mobile-menu-bottom">
          <Link className="mobile-btn-ghost" href="/services/enquiry" onClick={close}>Book a Service</Link>
          <Link className="mobile-btn-purple" href="/battery-swap" onClick={close}>🔋 Battery Swap</Link>
          <Link className="mobile-btn-primary" href="/products" onClick={close}>Shop Products</Link>
        </div>
      </div>
    </>
  );
}
