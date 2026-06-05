import { products as ProductData } from '@/components/product/ProductData'

const KEY = 'konark_recently_viewed'

export function useRecentlyViewed() {
  const addProduct = (slug: string) => {
    if (typeof window === 'undefined') return
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]') as string[]
    const updated = [slug, ...existing.filter((s) => s !== slug)].slice(0, 5)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  const getProducts = () => {
    if (typeof window === 'undefined') return []
    const slugs = JSON.parse(localStorage.getItem(KEY) || '[]') as string[]
    return slugs
      .map((slug) => (ProductData as any[]).find((p) => p.slug === slug))
      .filter(Boolean)
  }

  return { addProduct, getProducts }
}
