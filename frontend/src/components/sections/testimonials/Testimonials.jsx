"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar Panda",
    location: "Bhubaneswar, Odisha",
    product: "Konark EV Scooter X1",
    rating: 5,
    text: "I bought the Konark X1 eight months ago for my daily commute from Patia to Infocity — about 22km each way. It handles the route perfectly on a single charge. When I had a minor issue with the charging port, the service team came to my house the next morning and fixed it under warranty. That kind of after-sales support is rare.",
    initials: "RKP",
    color: "#00d4ff",
  },
  {
    name: "Sunita Mishra",
    location: "Cuttack, Odisha",
    product: "LFP 48V 200Ah Battery System",
    rating: 5,
    text: "We run a small rice processing unit and load-shedding was killing our productivity. We got a Konark LFP battery system installed with our rooftop solar in March last year. Eighteen months now — zero downtime, zero issues. It survived three major grid surges that would have fried a normal battery. The investment paid back in 14 months.",
    initials: "SM",
    color: "#7c3aed",
  },
  {
    name: "Pradeep Sahoo",
    location: "Rourkela, Odisha",
    product: "BLDC Fan + AC Service",
    rating: 5,
    text: "First I bought six Konark BLDC fans for our office — the electricity bill difference was noticeable from the first month, down by around ₹2,400. Then our old Voltas AC stopped cooling in the summer. Called Konark's service number and their technician was here within four hours. Fixed it the same day. I didn't even buy the AC from them but they serviced it anyway. That's integrity.",
    initials: "PS",
    color: "#f97316",
  },
];

const CARD_VARIANTS = [
  { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
];

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20"
          fill={s <= count ? "#f97316" : "none"}
          stroke="#f97316" strokeWidth={1.5}
          style={{ width: 14, height: 14 }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section style={{ background: "#0a0f1e", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)",
            color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16,
          }}>
            Customer Stories
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.2 }}>
            Real People. Real Results.
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 480, margin: "0 auto" }}>
            Don't take our word for it. Here's what our customers say.
          </p>
        </motion.div>

        <div
          ref={gridRef}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={CARD_VARIANTS[i].initial}
              animate={gridIn ? CARD_VARIANTS[i].animate : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              style={{
                background: "rgba(15,23,42,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid #1e2d40",
                borderLeft: `3px solid ${t.color}`,
                borderRadius: 16,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Stars count={t.rating} />
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: `${t.color}20`,
                  border: `2px solid ${t.color}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: t.color, fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0" }}>{t.location}</p>
                  <span style={{
                    fontSize: 10, color: t.color, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    background: `${t.color}12`, padding: "1px 6px",
                    borderRadius: 4, display: "inline-block",
                  }}>
                    {t.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
