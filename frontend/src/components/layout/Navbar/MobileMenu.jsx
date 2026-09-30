"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring", stiffness: 380, damping: 32 };

/* Full-width glass panel that drops down from the mobile pills */
export default function MobileMenu({ menuOpen, setMenuOpen, expandedSection, setExpandedSection, wishlistCount, cartCount, user, signOut, pathname, reduce }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const close = () => setMenuOpen(false);

  const submitSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      close();
    }
  };

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const panelVariants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: -16, scaleY: 0.92 },
    show: { opacity: 1, y: 0, scaleY: 1, transition: reduce ? { duration: 0 } : { ...SPRING, staggerChildren: 0.05, delayChildren: 0.08 } },
    exit: reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -12, scaleY: 0.95, transition: { duration: 0.18 } },
  };
  const itemVariants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: reduce ? { duration: 0 } : SPRING },
  };
  const NavItem = ({ href, label }) => (
    <motion.div variants={itemVariants}>
      <Link href={href} className="mobile-nav-item" onClick={close}>
        {isActive(href) && <motion.span layoutId="mobile-nav-active" className="mobile-nav-indicator" transition={reduce ? { duration: 0 } : SPRING} />}
        <span className="mobile-nav-label">{label}</span>
      </Link>
    </motion.div>
  );
  const Section = ({ id, label, href, children }) => (
    <motion.div variants={itemVariants}>
      <button
        className="mobile-nav-item"
        onClick={() => setExpandedSection((s) => (s === id ? null : id))}
      >
        {isActive(href) && <motion.span layoutId="mobile-nav-active" className="mobile-nav-indicator" transition={reduce ? { duration: 0 } : SPRING} />}
        <span className="mobile-nav-label">{label}</span>
        <span className={`mobile-nav-item-arrow mobile-nav-label${expandedSection === id ? " open" : ""}`}>▾</span>
      </button>
      {expandedSection === id && <div>{children}</div>}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="mobile-menu-panel"
          variants={panelVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{ transformOrigin: "top center" }}
        >
          <motion.div variants={itemVariants} className="mobile-menu-search-wrap">
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
          </motion.div>

          <nav className="mobile-menu-nav">
            <NavItem href="/" label="Home" />

            <Section id="products" label="Products" href="/products">
              <Link href="/products?cat=ev-scooter" className="mobile-nav-sub" onClick={close}>EV Scooters</Link>
              <Link href="/products?cat=e-rickshaw" className="mobile-nav-sub" onClick={close}>E-Rickshaws</Link>
              <Link href="/products?cat=battery" className="mobile-nav-sub" onClick={close}>LFP Batteries</Link>
              <Link href="/test-ride" className="mobile-nav-sub" onClick={close}>Book Test Ride</Link>
              <Link href="/products" className="mobile-nav-sub" onClick={close}>All Products</Link>
            </Section>

            <Section id="services" label="Services" href="/services">
              <Link href="/services/enquiry" className="mobile-nav-sub" onClick={close}>AC Repair & Service</Link>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={close}>EV Charging Station Install ↗</a>
              <Link href="/battery-swap" className="mobile-nav-sub" onClick={close}>Battery Swap</Link>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={close}>Solar Power Plant ↗</a>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="mobile-nav-sub" onClick={close}>Wind Power Plant ↗</a>
              <Link href="/services" className="mobile-nav-sub" onClick={close}>All Services</Link>
            </Section>

            <NavItem href="/about" label="About" />
            <NavItem href="/contact" label="Contact" />

            <div className="mobile-menu-divider" />

            <motion.div variants={itemVariants}>
              <Link href="/wishlist" className="mobile-nav-item" onClick={close}>
                <span className="mobile-nav-label">❤️ My Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/cart" className="mobile-nav-item" onClick={close}>
                <span className="mobile-nav-label">🛒 My Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              {user ? (
                <button
                  onClick={() => { signOut(); close(); }}
                  className="mobile-nav-item"
                  style={{ color: "#FCA5A5" }}
                >
                  <span className="mobile-nav-label">Sign Out</span>
                </button>
              ) : (
                <Link href="/login" className="mobile-nav-item" style={{ fontWeight: 700 }} onClick={close}>
                  <span className="mobile-nav-label">Login / Register</span>
                </Link>
              )}
            </motion.div>

            <div className="mobile-menu-divider" />

            <motion.div variants={itemVariants} style={{ textAlign: "center", padding: "12px 14px 4px" }}>
              <a href="tel:+919437611129" style={{ fontSize: 18, color: "#FFFFFF", fontWeight: 800, display: "block", marginBottom: 4, textDecoration: "none" }}>
                📞 +91 94376 11129
              </a>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>konarkindustrie@gmail.com</span>
            </motion.div>
          </nav>

          <motion.div variants={itemVariants} className="mobile-menu-bottom">
            <Link className="mobile-btn-ghost" href="/services/enquiry" onClick={close}>Book a Service</Link>
            <Link className="mobile-btn-purple" href="/battery-swap" onClick={close}>🔋 Battery Swap</Link>
            <Link className="mobile-btn-primary" href="/products" onClick={close}>Shop Products</Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
