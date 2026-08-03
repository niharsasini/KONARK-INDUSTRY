'use client'
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { certs } from './data'
import CertCard from './CertCard'
import PDFModal from './PDFModal'
import { usePublicStats } from '@/hooks/usePublicStats'

export default function CertificationsSection() {
  const [activeCert, setActiveCert] = useState(null)
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.1, triggerOnce: true })
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05, triggerOnce: true })
  const publicStats = usePublicStats()
  const visibleCerts = useMemo(() => {
    const hidden = new Set((publicStats?.hidden_certifications || []).map(String))
    return certs.filter((c) => !hidden.has(String(c.id)))
  }, [publicStats])

  if (visibleCerts.length === 0) return null

  return (
    <>
      <section className="certs-section">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            ref={headRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 20 }}
          >
            <span
              className="section-tag"
              style={{ background: 'rgba(13,81,140,0.08)', border: '1px solid rgba(13,81,140,0.2)', color: '#0D518C', marginBottom: 16, display: 'inline-flex' }}
            >
              GOVT. RECOGNISED
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px', margin: '16px 0 16px', textAlign: 'center' }}>
              <span style={{ color: '#0C1A2E' }}>Certified. Verified. </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #0D518C, #0EA5E9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                by India.
              </span>
            </h2>
            <p style={{ fontSize: 15, color: '#4A6785', maxWidth: 460, margin: '0 auto', lineHeight: 1.7, textAlign: 'center' }}>
              Every certificate below is issued by the Government of India or Government of Odisha and is publicly verifiable. Click any card to view the official document.
            </p>
          </motion.div>

          <div ref={gridRef} className="cert-badges-grid" style={{ marginTop: 40 }}>
            {visibleCerts.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} inView={gridIn} onClick={() => setActiveCert(cert)} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeCert && (
          <PDFModal cert={activeCert} onClose={() => setActiveCert(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
