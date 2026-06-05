"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore, useWishlistStore } from "@/store";
import { products as ProductData } from "@/components/product/ProductData";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", hasDropdown: "products" },
  { label: "Services", href: "/services", hasDropdown: "services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const DROPDOWN_VARIANTS = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

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

function ColHeader({ emoji, title, color }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color,
      textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: 12, paddingBottom: 8,
      borderBottom: "1px solid #1e2d40",
    }}>
      {emoji} {title}
    </div>
  );
}

function ProdItem({ icon, iconBg, label, href, highlight, isNew }) {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: iconBg || "rgba(0,212,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: highlight ? "#00d4ff" : "#f1f5f9", display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        {isNew && <span style={{ fontSize: 9, background: "#00d4ff", color: "#0a0f1e", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>NEW</span>}
      </span>
    </Link>
  );
}

function SvcItem({ icon, iconBg, label, desc, href }) {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, flexShrink: 0, marginTop: 1,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{desc}</div>
      </div>
    </Link>
  );
}

function ProductsMegaMenu({ onPanelEnter, onPanelLeave }) {
  return (
    <motion.div
      className="mega-menu-panel"
      variants={DROPDOWN_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.15 }}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        background: "#0f172a",
        border: "1px solid #1e2d40",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)",
        padding: 24,
        zIndex: 200,
        minWidth: 620,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 160px",
        gap: 0,
      }}
    >
      {/* Column 1 — EV Vehicles */}
      <div style={{ paddingRight: 20, borderRight: "1px solid #1e2d40" }}>
        <ColHeader emoji="⚡" title="EV Vehicles" color="#00d4ff" />
        <ProdItem icon="🛵" iconBg="rgba(0,212,255,0.12)" label="EV Scooters" href="/products?cat=ev-scooter" />
        <ProdItem icon="🛺" iconBg="rgba(0,212,255,0.10)" label="E-Rickshaws" href="/products?cat=e-rickshaw" />
        <ProdItem icon="🏍" iconBg="rgba(0,212,255,0.10)" label="Electric Motorcycles" href="/products?cat=electric-motorcycle" />
        <Link
          href="/test-ride"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 8, textDecoration: "none", marginTop: 8, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", transition: "background 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.22)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.12)")}
        >
          <span style={{ fontSize: 15 }}>🎯</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#00d4ff" }}>Book Test Ride</span>
        </Link>
      </div>

      {/* Column 2 — Shop Products */}
      <div style={{ paddingLeft: 20, paddingRight: 20, borderRight: "1px solid #1e2d40" }}>
        <ColHeader emoji="🛒" title="Shop Products" color="#a78bfa" />
        <ProdItem icon="💨" iconBg="rgba(167,139,250,0.12)" label="BLDC Fans" href="/products?cat=fan" />
        <ProdItem icon="❄️" iconBg="rgba(167,139,250,0.10)" label="Air Conditioners" href="/products?cat=ac" />
        <ProdItem icon="🔋" iconBg="rgba(167,139,250,0.10)" label="LFP Batteries" href="/products?cat=battery" />
        <ProdItem icon="☀️" iconBg="rgba(167,139,250,0.10)" label="Solar Inverters" href="/products?cat=solar" />
        <ProdItem icon="⚙️" iconBg="rgba(167,139,250,0.10)" label="Industrial Motors" href="/products?cat=industrial" />
      </div>

      {/* Column 3 — Featured Product card */}
      <div style={{ paddingLeft: 20, display: "flex", flexDirection: "column" }}>
        <ColHeader emoji="⭐" title="Featured" color="#f59e0b" />
        <Link
          href="/products?cat=ev-scooter"
          style={{ display: "block", textDecoration: "none", background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, overflow: "hidden", flex: 1, transition: "border-color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2d40")}
        >
          <div style={{ background: "#0d1424", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px", height: 90 }}>
            <img src="/productimg/Electric Scooter.png" alt="EV Scooter" style={{ maxHeight: 80, maxWidth: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ padding: "10px 10px 12px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>EV Scooter Pro</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00d4ff", marginBottom: 6 }}>₹89,999</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>View →</div>
          </div>
        </Link>
      </div>

      {/* Bottom bar */}
      <div style={{ gridColumn: "1 / -1", marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/products"
          style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 500, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          Browse all 50+ products →
        </Link>
        <Link
          href="/battery-swap"
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#a78bfa", textDecoration: "none", fontWeight: 600, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#a78bfa")}
        >
          🔋 Battery Swap —&nbsp;
          <span style={{ fontSize: 9, background: "#7c3aed", color: "#fff", padding: "2px 6px", borderRadius: 3, fontWeight: 800, letterSpacing: "0.04em" }}>NEW</span>
        </Link>
      </div>
    </motion.div>
  );
}

function ServicesMegaMenu({ onPanelEnter, onPanelLeave }) {
  return (
    <motion.div
      className="mega-menu-panel"
      variants={DROPDOWN_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.15 }}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        background: "#0f172a",
        border: "1px solid #1e2d40",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)",
        padding: 24,
        zIndex: 200,
        minWidth: 560,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
      }}
    >
      {/* Column 1 — Home Services */}
      <div style={{ paddingRight: 20, borderRight: "1px solid #1e2d40" }}>
        <ColHeader emoji="🏠" title="Home Services" color="#00d4ff" />
        <SvcItem icon="❄️" iconBg="rgba(0,212,255,0.12)" label="AC Repair" desc="All brands, same day" href="/services/enquiry" />
        <SvcItem icon="⚡" iconBg="rgba(0,212,255,0.10)" label="EV Charger Install" desc="Home & commercial" href="/services/enquiry" />
        <SvcItem icon="🏠" iconBg="rgba(0,212,255,0.10)" label="Home Electrical" desc="Wiring & fault repair" href="/services/enquiry" />
      </div>

      {/* Column 2 — Energy Services */}
      <div style={{ paddingLeft: 20 }}>
        <ColHeader emoji="☀️" title="Energy Services" color="#f59e0b" />
        <SvcItem icon="☀️" iconBg="rgba(245,158,11,0.12)" label="Solar Installation" desc="Rooftop & ground mount" href="/services/enquiry" />
        <SvcItem icon="🔋" iconBg="rgba(245,158,11,0.10)" label="Battery System Setup" desc="LFP & lead acid" href="/services/enquiry" />
        <SvcItem icon="🔧" iconBg="rgba(245,158,11,0.10)" label="Annual AMC" desc="Preventive maintenance" href="/services/enquiry" />
      </div>

      {/* Bottom bar */}
      <div style={{ gridColumn: "1 / -1", marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/services"
          style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 500, transition: "color 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          View all services →
        </Link>
        <Link
          href="/services/enquiry"
          style={{ fontSize: 13, fontWeight: 700, color: "#0a0f1e", background: "#00d4ff", padding: "8px 16px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
        >
          Book a Service Now →
        </Link>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const router = useRouter();
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
  const productTimer = useRef(null);
  const serviceTimer = useRef(null);

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

  const openProduct = () => {
    clearTimeout(productTimer.current);
    setProductOpen(true);
    setServiceOpen(false);
  };
  const closeProduct = () => {
    productTimer.current = setTimeout(() => setProductOpen(false), 100);
  };
  const openService = () => {
    clearTimeout(serviceTimer.current);
    setServiceOpen(true);
    setProductOpen(false);
  };
  const closeService = () => {
    serviceTimer.current = setTimeout(() => setServiceOpen(false), 100);
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
        <div className="navbar-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <PowerLogo />

          {/* Desktop center nav */}
          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={link.hasDropdown === "products" ? openProduct : openService}
                  onMouseLeave={link.hasDropdown === "products" ? closeProduct : closeService}
                >
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
                  <AnimatePresence>
                    {link.hasDropdown === "products" && productOpen && (
                      <ProductsMegaMenu
                        key="products-menu"
                        onPanelEnter={() => clearTimeout(productTimer.current)}
                        onPanelLeave={closeProduct}
                      />
                    )}
                    {link.hasDropdown === "services" && serviceOpen && (
                      <ServicesMegaMenu
                        key="services-menu"
                        onPanelEnter={() => clearTimeout(serviceTimer.current)}
                        onPanelLeave={closeService}
                      />
                    )}
                  </AnimatePresence>
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
            {/* Search — desktop only */}
            <div style={{ position: "relative" }} className="nav-right-desktop">
              {searchOpen ? (
                <div style={{ position: "relative" }}>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setTimeout(() => { setSearchOpen(false); setSearchQuery(""); }, 200)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                    }}
                    placeholder="Search products..."
                    style={{ width: 220, background: "#111827", border: "1px solid #00d4ff", color: "#f1f5f9", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none" }}
                  />
                  {searchPreview.length > 0 && (
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 12, zIndex: 300, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                      {searchPreview.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/products/${p.slug}`}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", textDecoration: "none", transition: "background 150ms" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        >
                          <div style={{ width: 32, height: 32, background: "#111827", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={p.image} alt={p.name} style={{ maxWidth: 28, maxHeight: 28, objectFit: "contain" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{p.name}</p>
                            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{p.category}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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

            {/* Desktop CTA buttons */}
            <div className="nav-right-desktop">
              <Link
                href="/services/enquiry"
                style={{ padding: "8px 16px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 13, fontWeight: 600, transition: "all 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Book Service
              </Link>
              <Link
                href="/products"
                style={{ padding: "8px 16px", background: "#00d4ff", color: "#0a0f1e", fontSize: 13, fontWeight: 700, borderRadius: 8, textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
              >
                Shop Now
              </Link>
            </div>

            {/* Wishlist — always visible */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{ position: "relative", padding: 8, color: "#94a3b8", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{wishlistCount > 9 ? "9+" : wishlistCount}</span>
              )}
            </Link>

            {/* Cart — always visible */}
            <Link
              href="/cart"
              style={{ position: "relative", padding: 8, color: "#94a3b8", borderRadius: 8, display: "flex", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#00d4ff", color: "#0a0f1e", fontSize: 10, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount > 9 ? "9+" : cartCount}</span>
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

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay${menuOpen ? " open" : ""}`}>
        <div style={{ position: "absolute", top: 16, left: 24, zIndex: 999 }}>
          <PowerLogo />
        </div>

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
          <Link href="/" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Home</Link>

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
              <span style={{ fontSize: 14, color: "#64748b" }}>{expandedSection === "services" ? "▲" : "▾"}</span>
            </button>
            {expandedSection === "services" && (
              <div>
                <Link href="/services/enquiry" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>AC Repair</Link>
                <Link href="/services/enquiry" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>EV Charger Install</Link>
                <Link href="/services/enquiry" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>Solar Installation</Link>
                <Link href="/battery-swap" className="mobile-nav-sub" onClick={() => setMenuOpen(false)}>Battery Swap</Link>
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
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", width: "100%", textAlign: "left" }}
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="mobile-nav-item" style={{ color: "#00d4ff" }} onClick={() => setMenuOpen(false)}>
              Login / Register
            </Link>
          )}

          <div className="mobile-menu-actions">
            <Link className="mobile-btn-primary" href="/products" onClick={() => setMenuOpen(false)}>Shop Products</Link>
            <Link className="mobile-btn-purple" href="/battery-swap" onClick={() => setMenuOpen(false)}>🔋 Battery Swap</Link>
            <Link className="mobile-btn-ghost" href="/services/enquiry" onClick={() => setMenuOpen(false)}>Book a Service</Link>
          </div>

          <div style={{ textAlign: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid #1e2d40" }}>
            <a href="tel:+919437611129" style={{ fontSize: 22, color: "#00d4ff", fontWeight: 800, display: "block", marginBottom: 6, textDecoration: "none" }}>
              📞 +91 94376 11129
            </a>
            <span style={{ fontSize: 13, color: "#64748b" }}>konarkindustrie@gmail.com</span>
          </div>
        </div>
      </div>
    </>
  );
}
