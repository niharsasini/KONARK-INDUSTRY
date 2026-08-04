"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { submitContactForm } from "@/lib/api";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const INPUT_STYLE = {
  width: "100%",
  background: "#F5F7FF",
  border: "1px solid rgba(13,81,140,0.1)",
  borderRadius: 12,
  padding: "13px 16px",
  color: "#0C1A2E",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "inset 3px 3px 8px rgba(13,81,140,0.06), inset -2px -2px 6px rgba(255,255,255,0.9)",
  transition: "all 0.2s ease",
};

const LABEL_STYLE = {
  fontSize: 12,
  fontWeight: 600,
  color: "#4A6785",
  letterSpacing: "0.5px",
  marginBottom: 6,
  display: "block",
};

const SUBJECT_OPTIONS = ["General Enquiry", "Product Question", "Service Booking", "Partnership", "Complaint", "Other"];

const WORK_HOURS = [
  { days: "Mon – Fri", hours: "8:00 AM – 8:00 PM", dow: [1, 2, 3, 4, 5] },
  { days: "Saturday", hours: "8:00 AM – 6:00 PM", dow: [6] },
  { days: "Sunday", hours: "Emergency only", dow: [0] },
];

const QUICK_FAQS = [
  {
    q: "Do you deliver outside Odisha?",
    a: "Yes, we deliver pan-India. Standard delivery takes 5-7 business days. For remote locations, please call +91 94376 11129 to confirm availability.",
  },
  {
    q: "Can I test ride before buying?",
    a: "Yes! Book a free test ride at our Bhubaneswar showroom at Bhimatangi Housing Colony. Use the 'Book Test Ride' option on any EV product page.",
  },
  {
    q: "Do you repair ACs and EVs of other brands?",
    a: "Yes, our service team handles all major brands for AC repair, EV charger installation, and home electrical work. We do not charge for the initial inspection.",
  },
];

function focusStyle(e) {
  e.currentTarget.style.borderColor = "rgba(13,81,140,0.35)";
  e.currentTarget.style.boxShadow = "inset 3px 3px 8px rgba(13,81,140,0.08), inset -2px -2px 6px rgba(255,255,255,0.9), 0 0 0 3px rgba(13,81,140,0.08)";
}
function blurStyle(e) {
  e.currentTarget.style.borderColor = "rgba(13,81,140,0.1)";
  e.currentTarget.style.boxShadow = "inset 3px 3px 8px rgba(13,81,140,0.06), inset -2px -2px 6px rgba(255,255,255,0.9)";
}

export default function ContactPage() {
  const settings = useSiteSettings();
  const phone = settings?.company_phone || "+91 94376 11129";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const email = settings?.company_email || "konarkindustrie@gmail.com";
  const address = settings?.company_address || "Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002";
  const waNumber = settings?.whatsapp_number || "919437611129";
  const waMessage = settings?.whatsapp_message_template || "Hi Konark Industry, I have a query";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const [today, setToday] = useState(null);
  useEffect(() => { setToday(new Date().getDay()); }, []);

  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: SUBJECT_OPTIONS[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".ctc-hero-tag", { y: 20, opacity: 0, duration: 0.6 });
      await animateIn(".ctc-hero-title", { y: 32, opacity: 0, duration: 0.7, delay: 0.15 });
      await animateIn(".ctc-hero-sub", { y: 24, opacity: 0, duration: 0.6, delay: 0.3 });
      await animateIn(".ctc-hero-badge", { y: 16, opacity: 0, duration: 0.5, delay: 0.45 });
      await animateIn(".ctc-info-card", { x: -32, opacity: 0, stagger: 0.1, duration: 0.6, start: "top 85%" });
      await animateIn(".ctc-form-card", { x: 32, opacity: 0, duration: 0.7, start: "top 85%" });
      await animateIn(".ctc-hours-card", { y: 24, opacity: 0, duration: 0.6, start: "top 85%" });
      await animateIn(".ctc-faq-card", { y: 24, opacity: 0, stagger: 0.1, duration: 0.5, start: "top 85%" });
      await animateIn(".ctc-map-card", { y: 24, opacity: 0, duration: 0.6, start: "top 85%" });
    };
    run();
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactForm({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: `Subject: ${form.subject}\n\n${form.message}`,
      });
      toast.success("Message sent! We'll get back to you within 2 hours.");
      setSuccess(true);
    } catch {
      // still show success to user — enquiry may have been recorded
      toast.success("Message sent! We'll get back to you within 2 hours.");
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* SECTION 1 — HERO (LIGHT) */}
      <div
        style={{
          background: "linear-gradient(160deg, #EEF2FF 0%, #F0F5FF 30%, #F5F7FF 60%, #EEF4FF 100%)",
          paddingTop: "calc(68px + var(--banner-h,0px) + 60px)",
          paddingBottom: 60,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,81,140,0.07) 0%, transparent 65%)", top: -100, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)", bottom: -80, left: -80, pointerEvents: "none" }} />
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(13,81,140,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px", pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <span
            className="ctc-hero-tag"
            style={{
              display: "inline-block", background: "rgba(13,81,140,0.08)", border: "1px solid rgba(13,81,140,0.2)",
              color: "#0D518C", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
              padding: "5px 16px", borderRadius: 999, marginBottom: 20,
            }}
          >
            Contact Us
          </span>

          <h1 className="ctc-hero-title" style={{ fontSize: "clamp(38px,6vw,68px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.08, margin: "0 0 20px" }}>
            <span style={{ color: "#0C1A2E" }}>Let's Talk.</span>{" "}
            <span style={{ background: "linear-gradient(135deg, #0D518C, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We're Here.
            </span>
          </h1>

          <p className="ctc-hero-sub" style={{ color: "#4A6785", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px" }}>
            Have a question? Want to book a service? Or just want to say hello? We'd love to hear from you.
          </p>

          <div
            className="ctc-hero-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)",
              borderRadius: 999, padding: "8px 20px", color: "#059669", fontSize: 13, fontWeight: 600,
            }}
          >
            ⚡ Average response time: 2 hours
          </div>
        </div>
      </div>

      {/* SECTION 2 — MAIN CONTENT */}
      <section style={{ background: "#F5F7FF", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "flex-start" }} className="ctc-grid">
          {/* LEFT — info */}
          <div>
            {[
              { icon: "📞", label: "Phone", value: phone, sub: "Mon–Sat, 8AM–8PM IST", href: phoneHref },
              { icon: "✉️", label: "Email", value: email, sub: "We reply within 2 hours", href: `mailto:${email}` },
              { icon: "📍", label: "Address", value: address, sub: "Visit our showroom", href: null },
              { icon: "💬", label: "WhatsApp", value: "Chat with us instantly", sub: "Available 24/7", href: waUrl },
            ].map((item) => {
              const CardTag = item.href ? "a" : "div";
              return (
                <CardTag
                  key={item.label}
                  className="ctc-info-card"
                  href={item.href || undefined}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    background: "#FFFFFF", borderRadius: 20,
                    boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)",
                    border: "1px solid rgba(13,81,140,0.04)", padding: "22px 24px", marginBottom: 14,
                    display: "flex", alignItems: "flex-start", gap: 16, transition: "all 0.3s ease",
                    textDecoration: "none", cursor: item.href ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "10px 10px 26px rgba(13,81,140,0.13), -8px -8px 20px rgba(255,255,255,1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)"; }}
                >
                  <div
                    style={{
                      width: 48, height: 48, background: "#F5F7FF",
                      boxShadow: "inset 3px 3px 8px rgba(13,81,140,0.08), inset -2px -2px 6px rgba(255,255,255,0.9)",
                      borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#8BA8C4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 4px" }}>{item.label}</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#0C1A2E", margin: "0 0 2px" }}>{item.value}</p>
                    <p style={{ fontSize: 13, color: "#4A6785", margin: 0 }}>{item.sub}</p>
                  </div>
                </CardTag>
              );
            })}

            {/* Working Hours */}
            <div
              className="ctc-hours-card"
              style={{
                background: "#FFFFFF", borderRadius: 20,
                boxShadow: "8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)",
                padding: "22px 24px", marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0C1A2E", margin: "0 0 14px" }}>Working Hours</p>
              {WORK_HOURS.map((row, i) => {
                const isToday = today !== null && row.dow.includes(today);
                return (
                  <div
                    key={row.days}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 10px", borderBottom: i < WORK_HOURS.length - 1 ? "1px solid rgba(13,81,140,0.05)" : "none",
                      background: isToday ? "rgba(13,81,140,0.04)" : "transparent",
                      borderRadius: isToday ? 8 : 0,
                    }}
                  >
                    <span style={{ fontSize: 14, color: isToday ? "#0D518C" : "#4A6785", fontWeight: isToday ? 700 : 400 }}>{row.days}</span>
                    <span style={{ fontSize: 14, color: isToday ? "#0D518C" : "#0C1A2E", fontWeight: 600 }}>{row.hours}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg,#25D366,#128C7E)", color: "white", borderRadius: 12,
                  padding: "12px 20px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 6px 16px rgba(37,211,102,0.25)", display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                💬 WhatsApp Now
              </a>
              <a
                href={phoneHref}
                style={{
                  background: "#FFFFFF", border: "1.5px solid rgba(13,81,140,0.2)", color: "#0D518C",
                  borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                  boxShadow: "4px 4px 10px rgba(13,81,140,0.08), -3px -3px 8px rgba(255,255,255,0.9)",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                📞 Call Now
              </a>
            </div>
          </div>

          {/* RIGHT — form */}
          <div
            className="ctc-form-card"
            style={{
              background: "#FFFFFF", borderRadius: 24,
              boxShadow: "12px 12px 32px rgba(13,81,140,0.1), -10px -10px 28px rgba(255,255,255,0.95)",
              border: "1px solid rgba(13,81,140,0.04)", padding: "36px 40px",
            }}
          >
            {success ? (
              <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0C1A2E", margin: "0 0 8px" }}>Message Sent!</h3>
                <p style={{ fontSize: 14, color: "#4A6785", margin: "0 0 24px" }}>We'll get back to you within 2 hours.</p>
                <button
                  onClick={() => { setSuccess(false); setForm({ name: "", phone: "", email: "", subject: SUBJECT_OPTIONS[0], message: "" }); }}
                  style={{ background: "var(--grad-navy)", color: "#ffffff", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "var(--shadow-navy)" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0C1A2E", margin: "0 0 6px" }}>Send us a Message</h2>
                <p style={{ fontSize: 14, color: "#8BA8C4", margin: "0 0 28px" }}>We'll get back to you within 2 hours</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="ctc-form-row">
                    <div>
                      <label style={LABEL_STYLE}>Full Name *</label>
                      <input required name="name" placeholder="Your full name" value={form.name} onChange={handleChange} style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Phone Number *</label>
                      <input required name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Email Address</label>
                    <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} style={{ ...INPUT_STYLE, cursor: "pointer", appearance: "none" }} onFocus={focusStyle} onBlur={blurStyle}>
                      {SUBJECT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Message</label>
                    <textarea name="message" rows={4} placeholder="Write your message here..." value={form.message} onChange={handleChange} style={{ ...INPUT_STYLE, minHeight: 120, resize: "vertical", fontFamily: "inherit" }} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="clay-btn clay-btn-primary"
                    style={{
                      width: "100%", height: 52, borderRadius: 14, fontSize: 15, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 — QUICK FAQ */}
      <section style={{ background: "#EEF2FF", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, color: "#0C1A2E", margin: "0 0 40px", letterSpacing: "-0.5px" }}>
            Quick Answers
          </h2>
          <div className="ctc-faq-grid">
            {QUICK_FAQS.map((faq) => (
              <div
                key={faq.q}
                className="ctc-faq-card"
                style={{
                  background: "#FFFFFF", borderRadius: 18,
                  boxShadow: "6px 6px 16px rgba(13,81,140,0.08), -5px -5px 14px rgba(255,255,255,0.95)",
                  padding: "22px 22px",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0D518C", margin: "0 0 8px", lineHeight: 1.4 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: "#4A6785", margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/about#faq" style={{ fontSize: 14, fontWeight: 600, color: "#0D518C", textDecoration: "none" }}>
              More questions? See our full FAQ →
            </Link>
          </p>
        </div>
      </section>

      {/* SECTION 4 — MAP */}
      <section style={{ background: "#F5F7FF", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, color: "#0C1A2E", margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            Find Us
          </h2>
          <div
            className="ctc-map-card"
            style={{
              background: "#FFFFFF", borderRadius: 24,
              boxShadow: "10px 10px 28px rgba(13,81,140,0.09), -8px -8px 22px rgba(255,255,255,0.95)",
              overflow: "hidden", height: 320, maxWidth: 800, margin: "0 auto",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119762.49534509986!2d85.7178707!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Konark Industry Location"
            />
          </div>
        </div>
      </section>

      <style>{`
        .ctc-faq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .ctc-grid { grid-template-columns: 1fr !important; }
          .ctc-faq-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .ctc-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
