'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const certs = [
  {
    id: 1,
    title: 'Startup India',
    issuer: 'Ministry of Commerce & Industry',
    subtitle: 'Dept. for Promotion of Industry & Internal Trade',
    number: 'Cert No: DIPP182913',
    valid: 'Valid till December 2032',
    tag: 'Government of India ✓',
    color: '#FF9933',
    iconText: 'SI',
    badge: 'DIPP RECOGNISED',
    driveLink: 'https://drive.google.com/file/d/1KXTqXjShczsEB4VQh5bNHgMrqwVIKT2S/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1KXTqXjShczsEB4VQh5bNHgMrqwVIKT2S/preview',
  },
  {
    id: 2,
    title: 'Startup Odisha',
    issuer: 'Govt. of Odisha — MSME Dept.',
    subtitle: 'Odisha Startup Policy 2016',
    number: 'Reg No: OSP/SP/02193',
    valid: 'Issued April 2025',
    tag: 'Government of Odisha ✓',
    color: '#00d4ff',
    iconText: 'SO',
    badge: 'STATE RECOGNISED',
    driveLink: 'https://drive.google.com/file/d/1cGzOUQD_izwzAO0aEh3Oolkp8YVF_1Rx/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1cGzOUQD_izwzAO0aEh3Oolkp8YVF_1Rx/preview',
  },
  {
    id: 3,
    title: 'Udyam MSME Registration',
    issuer: 'Ministry of MSME, Govt. of India',
    subtitle: 'Manufacturing — Motor Vehicles',
    number: 'UDYAM-OD-19-0064755',
    valid: 'Registered January 2024',
    tag: 'Government of India ✓',
    color: '#7c3aed',
    iconText: 'MSME',
    badge: 'MSME REGISTERED',
    driveLink: 'https://drive.google.com/file/d/1dSzfTJV_iwTU4ZVvcd-UFB59t7KwVt50/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1dSzfTJV_iwTU4ZVvcd-UFB59t7KwVt50/preview',
  },
  {
    id: 4,
    title: 'Importer-Exporter Code',
    issuer: 'Directorate General of Foreign Trade',
    subtitle: 'Ministry of Commerce & Industry',
    number: 'IEC: ABBFK1614L',
    valid: 'Issued November 2024',
    tag: 'DGFT Approved ✓',
    color: '#f97316',
    iconText: 'IEC',
    badge: 'EXPORT CERTIFIED',
    driveLink: 'https://drive.google.com/file/d/1iSr8CKXbYpp0IIToj9xPEkJ45Rzga08p/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1iSr8CKXbYpp0IIToj9xPEkJ45Rzga08p/preview',
  },
  {
    id: 5,
    title: 'Trade Mark Registration',
    issuer: 'Trade Marks Registry, Mumbai',
    subtitle: 'Class 9 — TV Sets & Electronics',
    number: 'TM No: 5527539',
    valid: 'Registered 13 July 2022',
    tag: 'IP India · Govt. of India ✓',
    color: '#ec4899',
    iconText: 'TM',
    badge: 'TRADE MARK REGISTERED',
    driveLink: 'https://drive.google.com/file/d/1gBi-o7MYoX3R82_SJ3N2lPpPGrnbnnZz/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1gBi-o7MYoX3R82_SJ3N2lPpPGrnbnnZz/preview',
  },
]

export default function CertificationsSection() {
  const [activeCert, setActiveCert] = useState(null)

  return (
    <>
      <section className="certs-section" style={{
        padding: '80px 0',
        background: '#0a0f1e',
        position: 'relative',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 48px',
        }} className="certs-inner">

          {/* LEFT COLUMN */}
          <div className="certs-left">
            <span style={{
              display: 'inline-block',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
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
                background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
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
              <motion.div
                key={cert.id}
                className="cert-card"
                onClick={() => setActiveCert(cert)}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e2d40',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  marginBottom: '14px',
                  transition: 'all 300ms',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                whileHover={{
                  x: 6,
                  borderColor: cert.color + '55',
                }}
              >
                {/* Top color bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: cert.color,
                  borderRadius: '16px 16px 0 0',
                }} />

                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: cert.color + '22',
                  border: `1px solid ${cert.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: cert.color,
                  flexShrink: 0,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                }}>
                  {cert.iconText}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'inline-block',
                    background: cert.color + '18',
                    color: cert.color,
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                  }}>
                    {cert.badge}
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    marginBottom: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {cert.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '2px',
                  }}>
                    {cert.issuer}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#475569',
                    fontFamily: 'monospace',
                  }}>
                    {cert.number} · {cert.valid}
                  </div>
                </div>

                {/* View button */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}>
                  <div style={{
                    background: cert.color + '18',
                    border: `1px solid ${cert.color}44`,
                    color: cert.color,
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                  }}>
                    View →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATE MODAL */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.92)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '900px',
                height: '88vh',
                background: '#0f172a',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #1e2d40',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #1e2d40',
                background: '#0a0f1e',
                flexShrink: 0,
                gap: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minWidth: 0,
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: activeCert.color + '22',
                    border: `1px solid ${activeCert.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: 800,
                    color: activeCert.color,
                    flexShrink: 0,
                  }}>
                    {activeCert.iconText}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      color: '#f1f5f9',
                      fontWeight: 700,
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {activeCert.title}
                    </div>
                    <div style={{
                      color: '#64748b',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}>
                      {activeCert.number}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  <a
                    href={activeCert.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#00d4ff',
                      color: '#0a0f1e',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Open in Drive ↗
                  </a>
                  <button
                    onClick={() => setActiveCert(null)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #1e2d40',
                      color: '#94a3b8',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* PDF iframe */}
              <iframe
                src={activeCert.embedUrl}
                style={{
                  width: '100%',
                  flex: 1,
                  border: 'none',
                  background: '#ffffff',
                }}
                title={activeCert.title}
                allow="autoplay"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
