'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { products as ProductData } from '@/components/product/ProductData'
import { getProducts } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store'
import Breadcrumb from '@/components/ui/Breadcrumb'

function ProductCard({ product }: { product: any }) {
  const router = useRouter()
  const { addItem } = useCartStore()
  const isService = product.type === 'service'
  const isVehicle = product.type === 'vehicle'

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        background: '#0f172a',
        border: '1px solid #1e2d40',
        borderRadius: 14,
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e2d40'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <div style={{ background: '#111827', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'contain', padding: 20 }} sizes="(max-width: 768px) 50vw, 25vw" />
        {product.isNew && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#00d4ff', color: '#0a0f1e', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>NEW</span>
        )}
        {isVehicle && (
          <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>⚡ EV</span>
        )}
        {!isVehicle && !isService && (
          <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>● In Stock</span>
        )}
      </div>
      <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.4 }}>{product.name}</p>
        <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{product.category}</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: product.price ? '#00d4ff' : '#94a3b8', margin: 0, marginTop: 'auto' }}>
          {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request'}
        </p>
      </div>
    </Link>
  )
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<any[]>(() =>
    ProductData.filter((p: any) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(query.toLowerCase())
    )
  )

  useEffect(() => {
    const local = ProductData.filter((p: any) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(query.toLowerCase())
    )
    setResults(local)
    getProducts({ search: query || undefined })
      .then((data: any) => {
        if (Array.isArray(data)) {
          setResults(data.map((p: any) => ({ ...p, image: p.images?.[0] || p.image })))
        }
      })
      .catch(() => {})
  }, [query])

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search Results' }]} />
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
            {' '}/{' '}
            <span style={{ color: '#94a3b8' }}>Search</span>
          </p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#f1f5f9', marginTop: '12px' }}>
            {query ? (
              <>
                Results for{' '}
                <span style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  "{query}"
                </span>
              </>
            ) : 'Search Products'}
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: 14 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {results.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              No results found
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Try searching for "EV Scooter", "Battery", "Fan" or "AC"
            </p>
            <Link href="/products" style={{ background: '#00d4ff', color: '#0a0f1e', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
              Browse All Products
            </Link>
          </div>
        )}

        {results.length === 0 && (
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', marginBottom: '12px' }}>Popular searches:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['EV Scooter', 'E-Rickshaw', 'LFP Battery', 'BLDC Fan', 'Air Conditioner', 'Solar'].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  style={{ background: '#0f172a', border: '1px solid #1e2d40', color: '#94a3b8', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', textDecoration: 'none' }}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0f1e', minHeight: '100vh', paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#94a3b8' }}>Searching...</span></div>}>
      <SearchResults />
    </Suspense>
  )
}
