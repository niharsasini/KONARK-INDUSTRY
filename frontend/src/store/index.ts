import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getWishlist, toggleWishlistItem } from "@/lib/api";

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
  toggle: (slug: string) => Promise<void>;
  isInWishlist: (slug: string) => boolean;
  syncFromBackend: () => Promise<void>;
  clear: () => void;
}

function localToggle(items: string[], slug: string) {
  return items.includes(slug)
    ? items.filter((s) => s !== slug)
    : [...items, slug];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: async (slug) => {
        const loggedIn =
          typeof window !== "undefined" && !!localStorage.getItem("konark_token");

        if (!loggedIn) {
          set({ items: localToggle(get().items, slug) });
          return;
        }

        try {
          const data = await toggleWishlistItem(slug);
          set({ items: data.wishlist });
        } catch {
          // Backend unreachable — fall back to a local-only toggle
          set({ items: localToggle(get().items, slug) });
        }
      },

      isInWishlist: (slug) => get().items.includes(slug),

      syncFromBackend: async () => {
        if (typeof window === "undefined" || !localStorage.getItem("konark_token")) return;
        try {
          const data = await getWishlist();
          if (data.wishlist) set({ items: data.wishlist });
        } catch {
          // keep whatever is currently in local storage
        }
      },

      clear: () => set({ items: [] }),
    }),
    { name: "konark-wishlist" }
  )
);
