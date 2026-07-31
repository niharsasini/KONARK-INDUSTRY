"use client";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Test Ride", href: "/test-ride" },
  { label: "Battery Swap", href: "/battery-swap" },
  { label: "Partner Program", href: "/partner" },
];

const PRODUCT_LINKS = [
  { label: "EV Scooter", href: "/products/electric-scooter" },
  { label: "Electric Motorcycle", href: "/products/electric-motor-cycle" },
  { label: "E-Rickshaw", href: "/products/e-rickshaw" },
  { label: "BLDC Fan", href: "/products/bldc-fan" },
  { label: "LFP Battery", href: "/products/lfp-battery" },
  { label: "Air Conditioner", href: "/products/air-conditioner" },
  { label: "Solar Inverter", href: "/products/solar-inverter" },
  { label: "Android TV", href: "/products/android-tv" },
];

// No dedicated pages exist yet for these — route to /contact like the rest of the
// not-yet-built support pages, and to real equivalents where one already exists.
const SUPPORT_LINKS = [
  { label: "FAQs", href: "/about#faq" },
  { label: "Order Tracking", href: "/orders" },
  { label: "Service Booking", href: "/services/enquiry" },
  { label: "Warranty Claims", href: "/contact" },
  { label: "Return Policy", href: "/contact" },
  { label: "Shipping Info", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "Terms", href: "/contact" },
];

const PAYMENT_BADGES = ["UPI", "Bank Transfer", "Cash on Delivery"];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "block", marginBottom: 10, transition: "all 0.2s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#4FC3F7"; e.currentTarget.style.paddingLeft = "6px"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.paddingLeft = "0"; }}
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#132040", boxShadow: "4px 4px 10px #0A1628, -3px -3px 8px #1C3058",
        border: "1px solid rgba(255,255,255,0.05)", color: "rgba(232,244,255,0.6)", transition: "all 0.25s ease", textDecoration: "none",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #0D518C, #0EA5E9)"; e.currentTarget.style.color = "white"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#132040"; e.currentTarget.style.color = "rgba(232,244,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </a>
  );
}

const SOCIAL_ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
      <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
};

export default function Footer() {
  const settings = useSiteSettings();
  const phone = settings?.company_phone || "+91 94376 11129";
  const email = settings?.company_email || "konarkindustrie@gmail.com";
  const address = settings?.company_address || "Bhimatangi Housing Colony,\nBhubaneswar, Odisha 751002";

  const social = [
    { key: "instagram", href: settings?.instagram_url || "https://instagram.com/konarkindustry", label: "Instagram" },
    { key: "linkedin", href: settings?.linkedin_url || "https://linkedin.com/company/konarkindustry", label: "LinkedIn" },
    { key: "youtube", href: settings?.youtube_url || "https://youtube.com/@konarkindustry", label: "YouTube" },
    { key: "facebook", href: settings?.facebook_url, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer style={{ background: "#080D18", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="footer-main">
        {/* Brand */}
        <div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, textDecoration: "none" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #0D518C, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(13,81,140,0.3), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
                <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
              </svg>
            </div>
            <div>
              <span style={{ display: "block", fontSize: 16, fontWeight: 900, color: "#FFFFFF" }}>KONARK</span>
              <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#4FC3F7", textTransform: "uppercase" }}>INDUSTRY</span>
            </div>
          </Link>

          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 14, marginBottom: 20 }}>
            Powering Odisha since 2014.
          </p>

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7, marginBottom: 24, maxWidth: 320 }}>
            Electric vehicles, home appliances and clean energy solutions — manufactured in Bhubaneswar, Odisha.
          </p>

          {social.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {social.map((s) => (
                <SocialIcon key={s.key} href={s.href} label={s.label}>
                  {SOCIAL_ICONS[s.key]}
                </SocialIcon>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, whiteSpace: "pre-line" }}>📍 {address}</p>
            <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: "#4FC3F7", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>📞 {phone}</a>
            <a href={`mailto:${email}`} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>✉️ {email}</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E8F4FF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 20 }}>Quick Links</h4>
          {QUICK_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
        </div>

        {/* Products */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E8F4FF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 20 }}>Our Products</h4>
          {PRODUCT_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E8F4FF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 20 }}>Support</h4>
          {SUPPORT_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 28px" }} />

      <div className="footer-bottom-bar">
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          © {new Date().getFullYear()} Konark Industry. All rights reserved.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          Made with ❤️ in Bhubaneswar, Odisha 🇮🇳
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PAYMENT_BADGES.map((p) => (
            <span key={p} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
