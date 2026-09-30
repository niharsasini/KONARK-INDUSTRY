"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring", stiffness: 380, damping: 30 };

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
    hidden: reduce ? { opacity: 0 } : { opacity: 0, height: 0, filter: "blur(10px)" },
    show: {
      opacity: 1, height: "auto", filter: "blur(0px)",
      transition: reduce ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.045, delayChildren: 0.1 },
    },
    exit: reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, height: 0, filter: "blur(8px)", transition: { duration: 0.24, ease: [0.4, 0, 1, 1] } },
  };
  const itemVariants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: reduce ? { duration: 0 } : SPRING },
  };
  const NavItem = ({ href, label }) => (
    <motion.div variants={itemVariants}>
      <Link href={href} className="nb-m-item" onClick={close}>
        {isActive(href) && <motion.span layoutId="nb-mobile-active" className="nb-m-ind" transition={reduce ? { duration: 0 } : SPRING} />}
        <span className="nb-m-label">{label}</span>
      </Link>
    </motion.div>
  );
  const Section = ({ id, label, href, children }) => (
    <motion.div variants={itemVariants}>
      <button
        className="nb-m-item"
        onClick={() => setExpandedSection((s) => (s === id ? null : id))}
      >
        {isActive(href) && <motion.span layoutId="nb-mobile-active" className="nb-m-ind" transition={reduce ? { duration: 0 } : SPRING} />}
        <span className="nb-m-label">{label}</span>
        <span className={`nb-m-arrow nb-m-label${expandedSection === id ? " open" : ""}`}>▾</span>
      </button>
      {expandedSection === id && <div>{children}</div>}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="nb-panel"
          variants={panelVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          
        >
          <motion.div variants={itemVariants} className="nb-m-search">
            <span className="nb-m-search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              className="nb-m-search-input"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={submitSearch}
            />
          </motion.div>

          <div className="nb-m-scroll"><nav className="nb-m-nav">
            <NavItem href="/" label="Home" />

            <Section id="products" label="Products" href="/products">
              <Link href="/products?cat=ev-scooter" className="nb-m-sub" onClick={close}>EV Scooters</Link>
              <Link href="/products?cat=e-rickshaw" className="nb-m-sub" onClick={close}>E-Rickshaws</Link>
              <Link href="/products?cat=battery" className="nb-m-sub" onClick={close}>LFP Batteries</Link>
              <Link href="/test-ride" className="nb-m-sub" onClick={close}>Book Test Ride</Link>
              <Link href="/products" className="nb-m-sub" onClick={close}>All Products</Link>
            </Section>

            <Section id="services" label="Services" href="/services">
              <Link href="/services/enquiry" className="nb-m-sub" onClick={close}>AC Repair & Service</Link>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="nb-m-sub" onClick={close}>EV Charging Station Install ↗</a>
              <Link href="/battery-swap" className="nb-m-sub" onClick={close}>Battery Swap</Link>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="nb-m-sub" onClick={close}>Solar Power Plant ↗</a>
              <a href="https://www.soumyashipower.in/" target="_blank" rel="noopener noreferrer" className="nb-m-sub" onClick={close}>Wind Power Plant ↗</a>
              <Link href="/services" className="nb-m-sub" onClick={close}>All Services</Link>
            </Section>

            <NavItem href="/about" label="About" />
            <NavItem href="/contact" label="Contact" />

            <div className="nb-m-divider" />

            <motion.div variants={itemVariants}>
              <Link href="/wishlist" className="nb-m-item" onClick={close}>
                <span className="nb-m-label">❤️ My Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/cart" className="nb-m-item" onClick={close}>
                <span className="nb-m-label">🛒 My Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              {user ? (
                <button
                  onClick={() => { signOut(); close(); }}
                  className="nb-m-item"
                  style={{ color: "#DC2626" }}
                >
                  <span className="nb-m-label">Sign Out</span>
                </button>
              ) : (
                <Link href="/login" className="nb-m-item" style={{ fontWeight: 700 }} onClick={close}>
                  <span className="nb-m-label">Login / Register</span>
                </Link>
              )}
            </motion.div>

            <div className="nb-m-divider" />

            <motion.div variants={itemVariants} style={{ textAlign: "center", padding: "12px 14px 4px" }}>
              <a href="tel:+919437611129" style={{ fontSize: 18, color: "#0D518C", fontWeight: 800, display: "block", marginBottom: 4, textDecoration: "none" }}>
                📞 +91 94376 11129
              </a>
              <span style={{ fontSize: 12, color: "#64748B" }}>konarkindustrie@gmail.com</span>
            </motion.div>
          </nav></div>

          <motion.div variants={itemVariants} className="nb-m-bottom">
            <Link className="nb-m-btn nb-m-btn-ghost" href="/services/enquiry" onClick={close}>Book Service</Link>
            <Link className="nb-m-btn nb-m-btn-ghost" href="/battery-swap" onClick={close}>🔋 Battery Swap</Link>
            <Link className="nb-m-btn nb-m-btn-gold" href="/products" onClick={close}>Shop Now</Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
