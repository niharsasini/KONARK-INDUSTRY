import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === product.slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === product.slug
                  ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),

      updateQuantity: (slug, qty) =>
        set((state) => {
          if (qty <= 0) return { items: state.items.filter((i) => i.slug !== slug) };
          return {
            items: state.items.map((i) =>
              i.slug === slug ? { ...i, quantity: Math.min(qty, 10) } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "konark-cart" }
  )
);

// ─── Wishlist ─────────────────────────────────────────────────────────────────

interface WishlistState {
  items: string[]; // array of slugs
  toggle: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (slug) =>
        set((state) =>
          state.items.includes(slug)
            ? { items: state.items.filter((s) => s !== slug) }
            : { items: [...state.items, slug] }
        ),

      isInWishlist: (slug) => get().items.includes(slug),
    }),
    { name: "konark-wishlist" }
  )
);
