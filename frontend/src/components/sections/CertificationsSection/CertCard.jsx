import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CertCard({ cert, index, inView, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '28px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? '12px 12px 28px rgba(13,81,140,0.13), -10px -10px 24px rgba(255,255,255,1)'
          : '8px 8px 20px rgba(13,81,140,0.09), -6px -6px 16px rgba(255,255,255,0.95), 0 0 0 1px rgba(13,81,140,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          margin: '0 auto 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          fontWeight: 800,
          color: cert.color,
          letterSpacing: '0.02em',
          background: '#F5F7FF',
          boxShadow: 'inset 4px 4px 10px rgba(13,81,140,0.08), inset -3px -3px 8px rgba(255,255,255,0.9)',
        }}
      >
        {cert.iconText}
      </div>

      <p style={{ fontSize: 15, fontWeight: 800, color: '#0C1A2E', margin: '0 0 4px' }}>{cert.title}</p>
      <p style={{ fontSize: 12, color: '#8BA8C4', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{cert.subtitle}</p>

      <div
        style={{
          color: '#059669',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          justifyContent: 'center',
          marginTop: 12,
        }}
      >
        {cert.tag}
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: cert.color,
          marginTop: 8,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        View certificate →
      </div>
    </motion.div>
  )
}
