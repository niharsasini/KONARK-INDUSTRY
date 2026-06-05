'use client'

import Link from 'next/link'
import { useWishlistStore, useCartStore } from '@/store'
import { products as ProductData } from '@/components/product/ProductData'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const wishlistSlugs = useWishlistStore((s) => s.items)
  const toggle = useWishlistStore((s) => s.toggle)
  const { addItem } = useCartStore()

  const wishlistProducts = ProductData.filter((p: any) => wishlistSlugs.includes(p.slug))

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((p: any) => {
      if (p.price && p.type !== 'service') {
        addItem({ id: p.id || p.slug, slug: p.slug, name: p.name, price: p.price, image: p.image || '', category: p.category || '', type: p.type || 'product' })
      }
    })
    toast.success('All items added to cart!')
  }

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e2d40', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 12, color: '#94a3b8' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#00d4ff' }}>Wishlist</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }}>
                My Wishlist
              </h1>
              <span style={{ display: 'inline-block', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            {wishlistProducts.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                style={{ padding: '10px 20px', background: '#00d4ff', color: '#0a0f1e', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer' }}
              >
                Add All to Cart 🛒
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        {wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.3 }}>❤️</div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>
              Save products you love and come back to them later.
            </p>
            <Link
              href="/products"
              style={{ background: '#00d4ff', color: '#0a0f1e', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}
            >
              Start Browsing Products →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {wishlistProducts.map((product: any) => (
              <div
                key={product.slug}
                style={{ background: '#0f172a', border: '1px solid #1e2d40', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <button
                  onClick={() => { toggle(product.slug); toast('Removed from wishlist') }}
                  style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 28, height: 28, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Remove from wishlist"
                >
                  ✕
                </button>
                <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#111827', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={product.image} alt={product.name} loading="lazy" style={{ maxHeight: 160, maxWidth: '90%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: 14 }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px' }}>{product.category}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: '0 0 8px', lineHeight: 1.4 }}>{product.name}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: product.price ? '#00d4ff' : '#94a3b8', margin: 0 }}>
                      {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request'}
                    </p>
                  </div>
                </Link>
                {product.price && product.type !== 'service' && (
                  <button
                    onClick={() => {
                      addItem({ id: product.id || product.slug, slug: product.slug, name: product.name, price: product.price, image: product.image || '', category: product.category || '', type: product.type || 'product' })
                      toast.success(`${product.name} added to cart!`)
                    }}
                    style={{ margin: '0 14px 14px', padding: '8px', background: '#00d4ff', color: '#0a0f1e', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer' }}
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
