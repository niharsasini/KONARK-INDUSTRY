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
          {i > 0 && <span style={{ color: 'var(--border-light)' }}>›</span>}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              style={{ color: 'var(--text-subtle)', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: i === items.length - 1 ? 'var(--text-muted)' : 'var(--text-subtle)' }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
