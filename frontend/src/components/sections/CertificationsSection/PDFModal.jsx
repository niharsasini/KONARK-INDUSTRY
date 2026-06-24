import { motion } from 'framer-motion'

export default function PDFModal({ cert, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
          background: 'var(--bg-card)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
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
          borderBottom: '1px solid var(--border-light)',
          background: '#fff',
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
              background: cert.color + '22',
              border: `1px solid ${cert.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 800,
              color: cert.color,
              flexShrink: 0,
            }}>
              {cert.iconText}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                color: 'var(--text-heading)',
                fontWeight: 700,
                fontSize: '15px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {cert.title}
              </div>
              <div style={{
                color: 'var(--text-subtle)',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}>
                {cert.number}
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
              href={cert.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--navy)',
                color: '#fff',
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
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-light)',
                color: 'var(--text-muted)',
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
          src={cert.embedUrl}
          style={{
            width: '100%',
            flex: 1,
            border: 'none',
            background: '#ffffff',
          }}
          title={cert.title}
          allow="autoplay"
        />
      </motion.div>
    </motion.div>
  )
}
