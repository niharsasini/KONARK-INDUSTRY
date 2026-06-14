import { motion } from 'framer-motion'

export default function CertCard({ cert, index, onClick }) {
  return (
    <motion.div
      className="cert-card"
      onClick={onClick}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
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
  )
}
