"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { submitTestRide } from "@/lib/api";
import Breadcrumb from "@/components/ui/Breadcrumb";

const VEHICLES = [
  "Konark X1 Electric Scooter",
  "Konark Electric Motorcycle",
  "Konark E-Rickshaw",
  "Konark Utility Vehicle",
];

const TIME_SLOTS = ["Morning (9AM – 12PM)", "Afternoon (12PM – 3PM)", "Evening (3PM – 6PM)"];

const INPUT_STYLE = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border-default)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "var(--text-body)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-muted)",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  marginBottom: 6,
};

export default function TestRidePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: VEHICLES[0],
    date: "",
    slot: TIME_SLOTS[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import("@/lib/gsapUtils");
      await animateIn(".test-ride-header", {
        y: 48, opacity: 0, blur: 8, duration: 0.8,
      });
      await animateIn(".test-ride-form", {
        y: 48, opacity: 0, scale: 0.96,
        blur: 4, duration: 0.75, delay: 0.2,
      });
    };
    run();
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--navy)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.1)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border-default)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitTestRide(form);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit booking. Please call us at +91 94376 11129."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🏍</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 12px" }}>Booking Confirmed!</h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 12 }}>
            We will call you on{" "}
            <strong style={{ color: "var(--navy)" }}>{form.phone}</strong>{" "}
            to confirm your test ride slot for the{" "}
            <strong style={{ color: "var(--text-heading)" }}>{form.vehicle}</strong>.
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>
            📍 Bhimatangi Housing Colony, Bhubaneswar, Odisha 751002
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" style={{ padding: "12px 28px", background: "var(--grad-navy)", color: "#ffffff", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", boxShadow: "var(--shadow-navy)" }}>
              Explore More EVs
            </Link>
            <Link href="/" style={{ padding: "12px 28px", border: "1px solid var(--border-default)", color: "var(--text-muted)", fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: "none" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Test Ride" }]} />
        {/* Header */}
        <div className="test-ride-header" style={{ maxWidth: 600, marginBottom: 60 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid var(--border-navy)",
            color: "var(--navy)", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", background: "var(--navy-bg)", marginBottom: 20,
          }}>
            ⚡ EV Experience
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "var(--text-heading)", margin: "0 0 16px", lineHeight: 1.1 }}>
            Book a Test Ride
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
            Come experience the Konark EV at our Bhubaneswar showroom. No pressure, just drive.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>📍</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>Bhimatangi Housing Colony</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>Bhubaneswar, Odisha 751002</p>
            </div>
          </div>
        </div>

        {/* Two column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 48, alignItems: "start" }} className="test-ride-grid">
          {/* Form */}
          <div className="test-ride-form" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "36px", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 28px" }}>Your Details</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {error && (
                <div style={{ background: "var(--red-bg)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 10, padding: "12px 16px" }}>
                  <p style={{ color: "var(--red)", fontSize: 13, margin: "0 0 6px" }}>{error}</p>
                  <a href="tel:+919437611129" style={{ color: "var(--navy)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    Or call us directly: +91 94376 11129
                  </a>
                </div>
              )}
              <div>
                <label style={LABEL_STYLE}>Full Name</label>
                <input type="text" value={form.name} onChange={set("name")} required placeholder="Rajesh Kumar" style={INPUT_STYLE} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={set("phone")} required placeholder="+91 94376 11129" style={INPUT_STYLE} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Which Vehicle</label>
                <select value={form.vehicle} onChange={set("vehicle")} style={INPUT_STYLE} onFocus={focus} onBlur={blur}>
                  {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Preferred Date</label>
                  <input type="date" value={form.date} onChange={set("date")} required style={{ ...INPUT_STYLE, colorScheme: "light" }} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Time Slot</label>
                  <select value={form.slot} onChange={set("slot")} style={INPUT_STYLE} onFocus={focus} onBlur={blur}>
                    {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 8, padding: "16px", background: "var(--grad-navy)",
                  color: "#ffffff", fontWeight: 800, fontSize: 16, borderRadius: 12,
                  border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background 0.2s", opacity: submitting ? 0.7 : 1,
                  boxShadow: "var(--shadow-navy)",
                }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "var(--navy-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--grad-navy)"; }}
              >
                {submitting ? "Confirming..." : "Confirm Test Ride →"}
              </button>
            </form>
          </div>

          {/* Info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* What to expect */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16, padding: "24px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-heading)", marginBottom: 16 }}>What to expect</h3>
              {[
                { icon: "👋", text: "Friendly welcome at our showroom" },
                { icon: "🏍", text: "Guided test ride on designated route" },
                { icon: "🔋", text: "Full demo of charging & battery features" },
                { icon: "💬", text: "Q&A with our EV expert — no sales pressure" },
                { icon: "📝", text: "On-spot pricing & EMI options if interested" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Call direct */}
            <div style={{ background: "var(--navy-bg)", border: "1px solid var(--border-navy)", borderRadius: 14, padding: "20px 22px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>Prefer to call directly?</p>
              <a href="tel:+919437611129" style={{ fontSize: 22, fontWeight: 900, color: "var(--navy)", textDecoration: "none", display: "block", marginBottom: 4 }}>
                +91 94376 11129
              </a>
              <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>Mon–Sat, 9AM–6PM</p>
            </div>

            {/* Browse EVs */}
            <Link href="/products?type=vehicle" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "14px", border: "1px solid var(--border-default)",
              color: "var(--text-muted)", fontSize: 14, fontWeight: 600,
              borderRadius: 12, textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; e.currentTarget.style.color = "var(--navy)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              Browse All EV Vehicles →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .test-ride-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
