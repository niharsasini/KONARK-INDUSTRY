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
        background: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(148,163,184,0.1)', borderBottom: '1px solid rgba(148,163,184,0.1)', padding: '60px 24px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <span className="section-tag">
          STAY UPDATED
        </span>
        <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>
          <span style={{ color: 'var(--text-heading)' }}>Get product launches and</span>{' '}
          <span className="gradient-text">offers first.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 32px' }}>
          Join 25,000+ customers who get our newsletter. No spam — just new products, service tips, and exclusive deals.
        </p>

        {done ? (
          <div style={{ padding: '20px', background: 'var(--green-bg)', border: '1px solid rgba(26,122,74,0.3)', borderRadius: 12, color: 'var(--green)', fontWeight: 600 }}>
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
              style={{ flex: 1, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 10, padding: '12px 16px', color: '#0F172A', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#0EA5E9')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.25)')}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px 24px', background: loading ? 'var(--navy-light)' : 'var(--grad-primary)', color: '#0F172A', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {loading ? '...' : 'Subscribe →'}
            </button>
          </form>
        )}

        <p style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 16 }}>
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
