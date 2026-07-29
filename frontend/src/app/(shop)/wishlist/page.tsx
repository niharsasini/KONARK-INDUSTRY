'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlistStore, useCartStore } from '@/store'
import { getProduct } from '@/lib/api'
import toast from 'react-hot-toast'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function WishlistPage() {
  const wishlistSlugs = useWishlistStore((s) => s.items)
  const toggle = useWishlistStore((s) => s.toggle)
  const { addItem } = useCartStore()

  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistSlugs.length === 0) {
      setWishlistProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all(wishlistSlugs.map((slug: string) => getProduct(slug).catch(() => null)))
      .then((results) => setWishlistProducts(results.filter(Boolean)))
      .finally(() => setLoading(false))
  }, [wishlistSlugs])

  useEffect(() => {
    const run = async () => {
      const { animateIn } = await import('@/lib/gsapUtils')
      await animateIn('.wishlist-header', {
        y: 32, opacity: 0, duration: 0.6,
      })
      await animateIn('.wishlist-item', {
        y: 48, opacity: 0, blur: 4,
        stagger: 0.08, duration: 0.6,
      })
    }
    run()
  }, [wishlistProducts])

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((p: any) => {
      if (p.price && p.type !== 'service') {
        addItem({ id: p.id || p.slug, slug: p.slug, name: p.name, price: p.price, image: p.images?.[0] || p.image || '', category: p.category || '', type: p.type || 'product' })
      }
    })
    toast.success('All items added to cart!')
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingTop: "calc(64px + var(--banner-h, 0px))" }}>
      {/* Hero */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Wishlist' }]} />
          <div className="wishlist-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 8px' }}>
                My Wishlist
              </h1>
              <span style={{ display: 'inline-block', background: 'var(--red-bg)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            {wishlistProducts.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                style={{ padding: '10px 20px', background: 'var(--grad-navy)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-navy)' }}
              >
                Add All to Cart 🛒
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 14 }} />
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.3 }}>❤️</div>
            <h2 style={{ color: 'var(--text-heading)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Save products you love and come back to them later.
            </p>
            <Link
              href="/products"
              style={{ background: 'var(--grad-navy)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15, boxShadow: 'var(--shadow-navy)' }}
            >
              Start Browsing Products →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {wishlistProducts.map((product: any) => (
              <div
                key={product.slug}
                className="wishlist-item"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}
              >
                <button
                  onClick={() => { toggle(product.slug); toast('Removed from wishlist') }}
                  style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 28, height: 28, borderRadius: '50%', background: 'var(--red-bg)', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Remove from wishlist"
                >
                  ✕
                </button>
                <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--bg-section)', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {(() => {
                      const src = product.images?.[0] || product.image
                      const isLocal = src?.startsWith('/productimg/') || src?.startsWith('/konark/')
                      return isLocal ? (
                        <img src={src} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 16, boxSizing: 'border-box' }} />
                      ) : (
                        <Image src={src} alt={product.name} fill style={{ objectFit: 'contain', padding: 16 }} />
                      )
                    })()}
                  </div>
                  <div style={{ padding: 14 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 4px' }}>{product.category}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)', margin: '0 0 8px', lineHeight: 1.4 }}>{product.name}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: product.price ? 'var(--navy)' : 'var(--text-subtle)', margin: 0 }}>
                      {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request'}
                    </p>
                  </div>
                </Link>
                {product.price && product.type !== 'service' && (
                  <button
                    onClick={() => {
                      addItem({ id: product.id || product.slug, slug: product.slug, name: product.name, price: product.price, image: product.images?.[0] || product.image || '', category: product.category || '', type: product.type || 'product' })
                      toast.success(`${product.name} added to cart!`)
                    }}
                    style={{ margin: '0 14px 14px', padding: '8px', background: 'var(--grad-navy)', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer' }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
