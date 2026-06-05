import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '24px', flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {i > 0 && <span style={{ color: '#1e2d40' }}>›</span>}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              style={{ color: '#64748b', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: i === items.length - 1 ? '#94a3b8' : '#64748b' }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
