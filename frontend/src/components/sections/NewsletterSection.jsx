'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

const SOCIAL_META = {
  facebook: { icon: '📘', label: 'Facebook' },
  instagram: { icon: '📸', label: 'Instagram' },
  youtube: { icon: '📺', label: 'YouTube' },
  linkedin: { icon: '💼', label: 'LinkedIn' },
}

function SocialButton({ href, icon, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        background: hovered ? 'linear-gradient(135deg, #0D518C, #0EA5E9)' : '#132040',
        boxShadow: hovered ? '0 6px 16px rgba(13,81,140,0.3)' : '5px 5px 12px #0A1628, -4px -4px 10px #1C3058',
        border: '1px solid rgba(255,255,255,0.04)',
        color: hovered ? 'white' : 'rgba(232,244,255,0.6)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {icon}
    </a>
  )
}

export default function NewsletterSection() {
  const settings = useSiteSettings()
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
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

  const social = [
    { key: 'facebook', href: settings?.facebook_url },
    { key: 'instagram', href: settings?.instagram_url || 'https://instagram.com/konarkindustry' },
    { key: 'youtube', href: settings?.youtube_url || 'https://youtube.com/@konarkindustry' },
    { key: 'linkedin', href: settings?.linkedin_url || 'https://linkedin.com/company/konarkindustry' },
  ].filter((s) => s.href)

  return (
    <section style={{ background: 'linear-gradient(135deg, #1A2E56 0%, #16264A 45%, #132040 100%)', padding: '88px 0', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,81,140,0.18) 0%, transparent 65%)',
          top: -180,
          right: -150,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      <div ref={ref} style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '0 28px', position: 'relative' }}>
        <h2
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            marginBottom: 16,
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}
        >
          <span style={{ color: '#E8F4FF' }}>Ready to power</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #4FC3F7, #F4C430)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            your future?
          </span>
        </h2>

        <p style={{ color: 'rgba(232,244,255,0.55)', fontSize: 16, marginBottom: 40 }}>
          Get exclusive deals, new product alerts and energy tips — straight to your inbox.
        </p>

        {done ? (
          <div style={{ padding: 20, background: 'rgba(52,199,138,0.1)', border: '1px solid rgba(52,199,138,0.3)', borderRadius: 16, color: '#34C78A', fontWeight: 600, maxWidth: 480, margin: '0 auto 48px' }}>
            ✅ You're subscribed! Welcome to the Konark family.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#132040',
              borderRadius: 20,
              boxShadow: 'inset 5px 5px 14px #0A1628, inset -4px -4px 12px #1C3058',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '6px 6px 6px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              maxWidth: 480,
              margin: '0 auto 48px',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              aria-label="Email address for newsletter"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#E8F4FF', fontSize: 14, minWidth: 0 }}
            />
            <button
              type="submit"
              disabled={loading}
              className="cta-btn-shimmer"
              style={{
                background: 'linear-gradient(135deg, #0D518C, #0EA5E9)',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(13,81,140,0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(13,81,140,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,81,140,0.3)'
              }}
            >
              {loading ? '...' : 'Subscribe →'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
          {social.map((s) => (
            <SocialButton key={s.key} href={s.href} icon={SOCIAL_META[s.key].icon} label={SOCIAL_META[s.key].label} />
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'rgba(232,244,255,0.25)' }}>No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
