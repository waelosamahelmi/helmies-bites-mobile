import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MenuItem } from '@/lib/api';

interface WishlistState {
  items: MenuItem[];

  // Actions
  addToWishlist: (item: MenuItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  toggleWishlist: (item: MenuItem) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) return state;
          return { items: [...state.items, item] };
        });
      },

      removeFromWishlist: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      isInWishlist: (itemId) => {
        return get().items.some((item) => item.id === itemId);
      },

      toggleWishlist: (item) => {
        const isIn = get().isInWishlist(item.id);
        if (isIn) {
          get().removeFromWishlist(item.id);
        } else {
          get().addToWishlist(item);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'helmies-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
