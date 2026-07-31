'use client'

import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

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

function AccordionItem({ faq, isOpen, onToggle }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: `1px solid ${isOpen ? 'rgba(13,81,140,0.15)' : 'rgba(13,81,140,0.04)'}`,
        marginBottom: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: !isOpen && hovered ? 'translateX(4px)' : 'translateX(0)',
        boxShadow:
          isOpen || hovered
            ? '8px 8px 20px rgba(13,81,140,0.1), -6px -6px 16px rgba(255,255,255,1)'
            : '6px 6px 16px rgba(13,81,140,0.08), -5px -5px 14px rgba(255,255,255,0.95)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? '#0D518C' : '#0C1A2E', transition: 'color 0.2s', lineHeight: 1.4 }}>
          {faq.q}
        </span>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            flexShrink: 0,
            background: isOpen ? 'linear-gradient(135deg, #0D518C, #0EA5E9)' : 'rgba(13,81,140,0.08)',
            color: isOpen ? 'white' : '#0D518C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all 0.3s ease',
          }}
        >
          ▾
        </span>
      </div>
      <div style={{ maxHeight: isOpen ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div style={{ padding: '14px 22px 18px', borderTop: '1px solid rgba(13,81,140,0.05)', marginTop: -4 }}>
          <p style={{ fontSize: 14, color: '#4A6785', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const settings = useSiteSettings()
  const [openIdx, setOpenIdx] = useState(0)
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

  const phone = settings?.company_phone || '+91 94376 11129'
  const waNumber = settings?.whatsapp_number || '919437611129'
  const waMessage = settings?.whatsapp_message_template || 'Hi Konark Industry, I have a query'
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`

  return (
    <section id="faq" style={{ background: '#F5F7FF', padding: '88px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: 60, alignItems: 'flex-start' }} className="faq-grid">
        {/* LEFT */}
        <div>
          <span className="section-tag" style={{ background: 'rgba(13,81,140,0.08)', border: '1px solid rgba(13,81,140,0.2)', color: '#0D518C' }}>
            FAQ
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px', margin: '16px 0 12px', lineHeight: 1.15 }}>
            <span style={{ color: '#0C1A2E' }}>Got Questions? </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #0D518C, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              We Have Answers.
            </span>
          </h2>
          <p style={{ fontSize: 15, color: '#4A6785', lineHeight: 1.7, margin: 0 }}>
            Everything you need to know before you buy, book, or swap.
          </p>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              boxShadow: '8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95)',
              padding: '24px 26px',
              marginTop: 32,
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0C1A2E', margin: '0 0 8px' }}>Still have questions?</p>
            <p style={{ fontSize: 14, color: '#4A6785', margin: '0 0 20px' }}>Our team is ready to help.</p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: 'white',
                borderRadius: 12,
                padding: '12px 20px',
                width: '100%',
                boxSizing: 'border-box',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(37,211,102,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
              }}
            >
              💬 Chat on WhatsApp
            </a>

            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              style={{
                background: 'white',
                border: '1.5px solid rgba(13,81,140,0.2)',
                color: '#0D518C',
                borderRadius: 12,
                padding: '12px 20px',
                width: '100%',
                boxSizing: 'border-box',
                marginTop: 10,
                fontSize: 14,
                fontWeight: 600,
                boxShadow: '3px 3px 8px rgba(13,81,140,0.07), -2px -2px 6px rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
              }}
            >
              📞 {phone}
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} faq={faq} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
