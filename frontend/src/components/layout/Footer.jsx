"use client";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const PRODUCT_LINKS = [
  { label: "EV Scooters", href: "/products/electric-scooter" },
  { label: "Electric Motorcycles", href: "/products/electric-motor-cycle" },
  { label: "LFP Batteries", href: "/products/lfp-battery" },
  { label: "BLDC Fans", href: "/products/bldc-fan" },
  { label: "Solar Inverters", href: "/products" },
  { label: "Industrial Motors", href: "/products/bldc-motor" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Battery Swap", href: "/battery-swap" },
  { label: "Partner With Us", href: "/partner" },
  { label: "FAQ", href: "/about#faq" },
  { label: "Careers", href: "/contact" },
  { label: "Press", href: "/contact" },
];

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(92,103,149,0.2)", background: "rgba(22,41,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7B8DB8", transition: "all 0.2s", textDecoration: "none" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(13,81,140,0.3)"; e.currentTarget.style.borderColor = "rgba(79,195,247,0.4)"; e.currentTarget.style.color = "#4FC3F7"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(22,41,82,0.5)"; e.currentTarget.style.borderColor = "rgba(92,103,149,0.2)"; e.currentTarget.style.color = "#7B8DB8"; }}
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
  const tagline = settings?.footer_tagline || "Engineered in Odisha.\nTrusted across India.";
  const social = [
    { key: "instagram", href: settings?.instagram_url || "https://instagram.com/konarkindustry", label: "Instagram" },
    { key: "linkedin", href: settings?.linkedin_url || "https://linkedin.com/company/konarkindustry", label: "LinkedIn" },
    { key: "youtube", href: settings?.youtube_url || "https://youtube.com/@konarkindustry", label: "YouTube" },
    { key: "facebook", href: settings?.facebook_url, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer style={{ background: "#0A0E1A", borderTop: "1px solid rgba(92,103,149,0.15)" }}>
      {/* CTA Band */}
      <div className="footer-top footer-top-cta">
        <div className="footer-top-inner">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#E8F4FF", margin: "0 0 8px" }}>
            Ready to power your future?
          </h2>
          <p style={{ color: "#7B8DB8", fontSize: 15, margin: "0 0 24px" }}>
            Join 25,000+ homes, businesses, and industries already running on Konark.
          </p>
          <div className="footer-top-buttons" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/products"
              style={{ padding: "12px 28px", background: "var(--grad-primary)", color: "#E8F4FF", fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none", transition: "all 0.2s", display: "inline-block", boxShadow: "0 4px 12px rgba(13,81,140,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(13,81,140,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(13,81,140,0.3)")}
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              style={{ padding: "12px 28px", background: "transparent", color: "#E8F4FF", fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: "none", border: "1px solid rgba(92,103,149,0.25)", transition: "all 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F4C430"; e.currentTarget.style.color = "#F4C430"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(92,103,149,0.25)"; e.currentTarget.style.color = "#E8F4FF"; }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main footer-grid">
        {/* Brand */}
        <div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,196,48,0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
                <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="var(--gold)" />
              </svg>
            </div>
            <div>
              <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#E8F4FF" }}>KONARK</span>
              <span style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: "#5C6795", textTransform: "uppercase" }}>INDUSTRY</span>
            </div>
          </Link>
          <p style={{ fontSize: 13, color: "#7B8DB8", lineHeight: 1.7, marginBottom: 20, whiteSpace: "pre-line" }}>
            {tagline}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {social.map((s) => (
              <SocialIcon key={s.key} href={s.href} label={s.label}>
                {SOCIAL_ICONS[s.key]}
              </SocialIcon>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E8F4FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Products</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {PRODUCT_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} style={{ fontSize: 13, color: "#5C6795", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4FC3F7")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5C6795")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E8F4FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} style={{ fontSize: 13, color: "#5C6795", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4FC3F7")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5C6795")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E8F4FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Address", value: "Bhimatangi Housing Colony,\nBhubaneswar, Odisha 751002" },
              { label: "Phone", value: "+91 94376 11129" },
              { label: "Email", value: "konarkindustrie@gmail.com" },
              { label: "Hours", value: "Mon–Sat, 9AM–6PM IST" },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: 11, color: "#4A5880", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</p>
                <p style={{ fontSize: 13, color: "#B8D0E8", margin: 0, whiteSpace: "pre-line" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar footer-bottom">
        <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>
          © 2024 Konark Industry Pvt. Ltd. ·{" "}
          <Link href="/contact" style={{ color: "var(--text-subtle)", textDecoration: "none" }}>Privacy Policy</Link>
          {" "}·{" "}
          <Link href="/contact" style={{ color: "var(--text-subtle)", textDecoration: "none" }}>Terms</Link>
          {" "}·{" "}
          <Link href="/contact" style={{ color: "var(--text-subtle)", textDecoration: "none" }}>Sitemap</Link>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid rgba(92,103,149,0.15)", borderRadius: 6 }}>
          <span style={{ fontSize: 16 }}>🇮🇳</span>
          <span style={{ fontSize: 12, color: "#7B8DB8", fontWeight: 600 }}>Make in India</span>
        </div>
      </div>
    </footer>
  );
}
