"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar Panda", location: "Bhubaneswar, Odisha",
    product: "Konark EV Scooter X1", rating: 5, initials: "RKP", color: "#00d4ff",
    text: "I bought the Konark X1 eight months ago for my daily commute from Patia to Infocity — about 22km each way. It handles the route perfectly on a single charge. When I had a minor issue with the charging port, the service team came to my house the next morning and fixed it under warranty. That kind of after-sales support is rare.",
  },
  {
    name: "Sunita Mishra", location: "Cuttack, Odisha",
    product: "LFP 48V 200Ah Battery System", rating: 5, initials: "SM", color: "#7c3aed",
    text: "We run a small rice processing unit and load-shedding was killing our productivity. We got a Konark LFP battery system with our rooftop solar in March last year. Eighteen months — zero downtime, zero issues. The investment paid back in 14 months.",
  },
  {
    name: "Pradeep Sahoo", location: "Rourkela, Odisha",
    product: "BLDC Fan + AC Service", rating: 5, initials: "PS", color: "#f97316",
    text: "First I bought six Konark BLDC fans for our office — electricity bill down by ₹2,400 from the first month. Then our old Voltas AC stopped cooling. Called Konark's service number and their technician was here within four hours. Fixed it the same day. I didn't even buy the AC from them but they serviced it anyway.",
  },
];

function Stars({ count, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} viewBox="0 0 20 20" fill={s <= count ? "#f97316" : "none"} stroke="#f97316" strokeWidth={1.5} style={{ width: size, height: size }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: contentRef, inView: contentIn } = useInView({ threshold: 0.05, triggerOnce: true });

  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section className="testimonials-section" style={{ position: "relative", overflow: "hidden" }}>
      {/* Decorative quote */}
      <div style={{ position: "absolute", top: "8%", left: "5%", fontSize: 320, fontWeight: 900, color: "rgba(0,212,255,0.025)", lineHeight: 1, pointerEvents: "none", userSelect: "none", fontFamily: "Georgia, serif" }}>&quot;</div>

      <div className="testimonials-inner">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(0,212,255,0.08)", marginBottom: 16 }}>
            Customer Stories
          </span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 10px" }}>Real People. Real Results.</h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 440, margin: "0 auto" }}>Don&apos;t take our word for it — here&apos;s what our customers actually say.</p>
        </motion.div>

        <div ref={contentRef}>
          {/* Featured card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={contentIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="testimonial-featured"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.05), rgba(124,58,237,0.05))",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            {/* Avatar */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                className="testimonial-avatar"
                style={{
                  background: `${featured.color}20`,
                  border: `3px solid ${featured.color}60`,
                  color: featured.color,
                  boxShadow: `0 0 0 6px ${featured.color}10`,
                  animation: "glow-pulse 3s ease-in-out infinite",
                  width: 80,
                  height: 80,
                  fontSize: 20,
                }}
              >
                {featured.initials}
              </div>
              <Stars count={featured.rating} />
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p className="testimonial-featured-text">&ldquo;{featured.text}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{featured.name}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{featured.location}</p>
                </div>
                <span style={{ fontSize: 11, color: featured.color, fontWeight: 600, background: `${featured.color}12`, padding: "3px 10px", borderRadius: 100, border: `1px solid ${featured.color}30` }}>
                  {featured.product}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Two smaller cards */}
          <div className="testimonial-small-row testimonials-pair">
            {rest.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                animate={contentIn ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="testimonial-small"
                style={{ borderLeft: `3px solid ${t.color}`, display: "flex", flexDirection: "column", gap: 14 }}
              >
                <Stars count={t.rating} size={12} />
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, margin: 0, fontStyle: "italic", flex: 1 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${t.color}20`, border: `2px solid ${t.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "1px 0 0" }}>{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonial-featured { flex-direction: column !important; padding: 24px !important; gap: 20px !important; }
          .testimonials-pair { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
