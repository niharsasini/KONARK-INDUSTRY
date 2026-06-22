'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export default function NewsletterSection() {
  const { ref, isVisible } = useScrollReveal()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch(`${BASE_URL}/api/v1/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiry_type: 'contact', message: 'Newsletter subscription', email }),
      })
      localStorage.setItem('konark_newsletter_email', email)
      setDone(true)
      toast.success("You're subscribed! 🎉")
    } catch {
      toast.error('Could not subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const alreadySubscribed = typeof window !== 'undefined' && !!localStorage.getItem('konark_newsletter_email')
  if (alreadySubscribed && done) return null

  return (
    <section
      ref={ref}
      style={{
        background: '#060d1a', borderTop: '1px solid #1e2d40', borderBottom: '1px solid #1e2d40', padding: '60px 24px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.14em', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', padding: '4px 14px', borderRadius: 999, marginBottom: 16 }}>
          STAY UPDATED
        </span>
        <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>
          <span style={{ color: '#f1f5f9' }}>Get product launches and</span>{' '}
          <span style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>offers first.</span>
        </h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 32px' }}>
          Join 25,000+ customers who get our newsletter. No spam — just new products, service tips, and exclusive deals.
        </p>

        {done ? (
          <div style={{ padding: '20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#10b981', fontWeight: 600 }}>
            ✅ You're subscribed! Welcome to the Konark family.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              aria-label="Email address for newsletter"
              style={{ flex: 1, background: '#0f172a', border: '1px solid #1e2d40', borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#00d4ff')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#1e2d40')}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px 24px', background: loading ? '#0891b2' : '#00d4ff', color: '#0a0f1e', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {loading ? '...' : 'Subscribe →'}
            </button>
          </form>
        )}

        <p style={{ fontSize: 12, color: '#475569', marginTop: 16 }}>
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
