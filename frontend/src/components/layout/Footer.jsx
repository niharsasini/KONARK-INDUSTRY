"use client";
import Link from "next/link";

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
      style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "all 0.2s", textDecoration: "none" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.borderColor = "#00d4ff"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "#1e2d40"; }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#0a0f1e", borderTop: "1px solid #1e2d40" }}>
      {/* CTA Band */}
      <div className="footer-top footer-top-cta">
        <div className="footer-top-inner">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>
            Ready to power your future?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 15, margin: "0 0 24px" }}>
            Join 25,000+ homes, businesses, and industries already running on Konark.
          </p>
          <div className="footer-top-buttons" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/products"
              style={{ padding: "12px 28px", background: "#00d4ff", color: "#0a0f1e", fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none", transition: "background 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#00b8d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4ff")}
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              style={{ padding: "12px 28px", background: "transparent", color: "#f1f5f9", fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: "none", border: "1px solid #1e2d40", transition: "all 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d40"; e.currentTarget.style.color = "#f1f5f9"; }}
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
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,212,255,0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
                <path d="M12 2v6M6.22 6.22l4.24 4.24M2 12h6M6.22 17.78l4.24-4.24M12 22v-6M17.78 17.78l-4.24-4.24M22 12h-6M17.78 6.22l-4.24 4.24" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="#00d4ff" />
              </svg>
            </div>
            <div>
              <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#fff" }}>KONARK</span>
              <span style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: "#00d4ff", textTransform: "uppercase" }}>INDUSTRY</span>
            </div>
          </Link>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20 }}>
            Engineered in Odisha.<br />Trusted across India.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <SocialIcon href="#" label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
                <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 16, height: 16 }}>
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Products</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {PRODUCT_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Address", value: "Bhimatangi Housing Colony,\nBhubaneswar, Odisha 751002" },
              { label: "Phone", value: "+91 94376 11129" },
              { label: "Email", value: "konarkindustrie@gmail.com" },
              { label: "Hours", value: "Mon–Sat, 9AM–6PM IST" },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</p>
                <p style={{ fontSize: 13, color: "#f1f5f9", margin: 0, whiteSpace: "pre-line" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar footer-bottom">
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
          © 2024 Konark Industry Pvt. Ltd. ·{" "}
          <Link href="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>Privacy Policy</Link>
          {" "}·{" "}
          <Link href="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>Terms</Link>
          {" "}·{" "}
          <Link href="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>Sitemap</Link>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid #1e2d40", borderRadius: 6 }}>
          <span style={{ fontSize: 16 }}>🇮🇳</span>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Make in India</span>
        </div>
      </div>
    </footer>
  );
}
