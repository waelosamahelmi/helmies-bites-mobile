import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MenuItem } from '@/lib/api';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  promoCode: string;
  discount: number;
  discountAmount: number;
  
  // Computed
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;

  // Actions
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurantName: (name: string) => void;
  applyPromoCode: (code: string, discountPercent: number) => void;
  clearPromoCode: () => void;
}

const DELIVERY_FEE = 3.90;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      promoCode: '',
      discount: 0,
      discountAmount: 0,
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      itemCount: 0,

      addItem: (menuItem, quantity = 1, specialInstructions) => {
        set((state) => {
          // If different restaurant, clear cart first
          if (state.restaurantId && menuItem.tenant_id !== state.restaurantId) {
            const totals = calculateTotals([{ menuItem, quantity, specialInstructions }], 0);
            return {
              items: [{ menuItem, quantity, specialInstructions }],
              restaurantId: menuItem.tenant_id,
              restaurantName: null,
              promoCode: '',
              discount: 0,
              ...totals,
            };
          }

          const existingIndex = state.items.findIndex(
            (item) => item.menuItem.id === menuItem.id
          );

          let newItems: CartItem[];
          if (existingIndex >= 0) {
            newItems = state.items.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + quantity, specialInstructions }
                : item
            );
          } else {
            newItems = [...state.items, { menuItem, quantity, specialInstructions }];
          }

          return {
            items: newItems,
            restaurantId: menuItem.tenant_id,
            ...calculateTotals(newItems, state.discount),
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.menuItem.id !== menuItemId
          );

          if (newItems.length === 0) {
            return {
              items: [],
              restaurantId: null,
              restaurantName: null,
              promoCode: '',
              discount: 0,
              discountAmount: 0,
              subtotal: 0,
              deliveryFee: 0,
              total: 0,
              itemCount: 0,
            };
          }

          return {
            items: newItems,
            ...calculateTotals(newItems, state.discount),
          };
        });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity } : item
          );

          return {
            items: newItems,
            ...calculateTotals(newItems, state.discount),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          restaurantId: null,
          restaurantName: null,
          promoCode: '',
          discount: 0,
          discountAmount: 0,
          subtotal: 0,
          deliveryFee: 0,
          total: 0,
          itemCount: 0,
        });
      },

      setRestaurantName: (name) => {
        set({ restaurantName: name });
      },

      applyPromoCode: (code, discountPercent) => {
        set((state) => {
          const newDiscountAmount = (state.subtotal * discountPercent) / 100;
          return {
            promoCode: code,
            discount: discountPercent,
            discountAmount: Number(newDiscountAmount.toFixed(2)),
            total: state.subtotal - newDiscountAmount + (state.items.length > 0 ? DELIVERY_FEE : 0),
          };
        });
      },

      clearPromoCode: () => {
        set((state) => ({
          promoCode: '',
          discount: 0,
          discountAmount: 0,
          total: state.subtotal + (state.items.length > 0 ? DELIVERY_FEE : 0),
        }));
      },
    }),
    {
      name: 'helmies-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

function calculateTotals(items: CartItem[], discount: number) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + deliveryFee;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    itemCount,
    deliveryFee,
    discountAmount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
