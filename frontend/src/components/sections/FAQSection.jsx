'use client'

import { useState, useEffect } from 'react'

const FALLBACK_FAQS = [
  {
    q: "Do you deliver outside Odisha?",
    a: "Yes, we deliver pan-India. Standard delivery takes 5-7 business days. For remote locations, please call +91 94376 11129 to confirm availability.",
  },
  {
    q: "What is the warranty on EV scooters?",
    a: "All Konark EV scooters come with a 2-year comprehensive warranty covering the motor, battery, and electrical components. The frame carries a 5-year warranty.",
  },
  {
    q: "Can I test ride before buying?",
    a: "Yes! Book a free test ride at our Bhubaneswar showroom at Bhimatangi Housing Colony. Use the 'Book Test Ride' option on any EV product page.",
  },
  {
    q: "How does the battery swap service work?",
    a: "Submit a swap request with your battery details and preferred date. Our team calls within 2 hours to confirm. We either pick up from your location or you visit our centre. Swap fee starts from ₹150.",
  },
  {
    q: "Do you repair ACs and EVs of other brands?",
    a: "Yes, our service team handles all major brands for AC repair, EV charger installation, and home electrical work. We do not charge for the initial inspection.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI (GPay, PhonePe, Paytm), bank transfer, and cash on delivery for orders below ₹10,000. EMI options available through select banks.",
  },
  {
    q: "How do I track my order?",
    a: "After placing an order, go to My Orders in your account. You will receive SMS and email updates at each stage from confirmation to delivery.",
  },
  {
    q: "Do you offer bulk/institutional pricing?",
    a: "Yes, we offer special pricing for bulk orders (10+ units) and institutional buyers (government, corporate). Contact sales@konarkindustry.com or call us.",
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null)
  const [faqs, setFaqs] = useState(FALLBACK_FAQS)

  useEffect(() => {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    fetch(`${BACKEND}/api/v1/faqs`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data.map((f) => ({ q: f.question, a: f.answer })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section style={{ background: 'transparent', padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.14em', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', padding: '4px 14px', borderRadius: 999, marginBottom: 16 }}>
            FAQ
          </span>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: '#0f172a',
                border: `1px solid ${openIdx === i ? 'rgba(0,212,255,0.3)' : '#1e2d40'}`,
                borderLeft: `3px solid ${openIdx === i ? '#00d4ff' : 'transparent'}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <span style={{ fontSize: 20, color: '#00d4ff', flexShrink: 0, fontWeight: 300 }}>
                  {openIdx === i ? '−' : '+'}
                </span>
              </button>
              {openIdx === i && (
                <div style={{ padding: '0 20px 18px' }}>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
