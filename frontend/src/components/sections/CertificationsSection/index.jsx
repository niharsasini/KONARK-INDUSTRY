'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { certs } from './data'
import CertCard from './CertCard'
import PDFModal from './PDFModal'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function CertificationsSection() {
  const [activeCert, setActiveCert] = useState(null)
  const { ref, isVisible } = useScrollReveal()

  return (
    <>
      <section className="certs-section" style={{
        padding: '80px 0',
        background: 'transparent',
        position: 'relative',
      }}>
        <div ref={ref} style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 48px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
        }} className="certs-inner">

          {/* LEFT COLUMN */}
          <div className="certs-left">
            <span style={{
              display: 'inline-block',
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.2)',
              color: '#38bdf8',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '5px 14px',
              borderRadius: '100px',
              marginBottom: '16px',
            }}>
              GOVT. RECOGNISED
            </span>

            <h2 style={{
              fontSize: 'clamp(28px,4vw,42px)',
              fontWeight: 900,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              Certified{' '}
              <span style={{
                background: 'linear-gradient(135deg,#38bdf8,#818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>by India.</span>
            </h2>

            <p style={{
              color: '#94a3b8',
              fontSize: '16px',
              lineHeight: 1.8,
              marginBottom: '32px',
              maxWidth: '360px',
            }}>
              Every certificate below is issued by the Government
              of India or Government of Odisha and is publicly
              verifiable on official government portals.
            </p>

            <div style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              maxWidth: '360px',
            }}>
              <span style={{
                fontSize: '20px',
                lineHeight: 1,
                marginTop: '2px',
              }}>✅</span>
              <div>
                <p style={{
                  color: '#10b981',
                  fontSize: '13px',
                  fontWeight: 700,
                  margin: '0 0 4px',
                }}>
                  All certificates are active
                </p>
                <p style={{
                  color: '#64748b',
                  fontSize: '12px',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  Click any certificate to view the
                  official document directly.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Certificate Cards */}
          <div className="certs-right">
            {certs.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} onClick={() => setActiveCert(cert)} />
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATE MODAL */}
      <AnimatePresence>
        {activeCert && (
          <PDFModal cert={activeCert} onClose={() => setActiveCert(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
