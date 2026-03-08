import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { MenuItem } from '@/lib/api';
import { DELIVERY_FEE } from '@/lib/constants';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const addItem = useCallback((menuItem: MenuItem, quantity = 1, specialInstructions?: string) => {
    setItems(prev => {
      // If different restaurant, clear cart first
      if (restaurantId && menuItem.tenant_id !== restaurantId) {
        setRestaurantId(menuItem.tenant_id);
        setRestaurantName(null);
        return [{ menuItem, quantity, specialInstructions }];
      }

      if (!restaurantId) {
        setRestaurantId(menuItem.tenant_id);
      }

      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity, specialInstructions }
            : item
        );
      }
      return [...prev, { menuItem, quantity, specialInstructions }];
    });
  }, [restaurantId]);

  const removeItem = useCallback((menuItemId: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.menuItem.id !== menuItemId);
      if (next.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, restaurantId, restaurantName, addItem, removeItem,
      updateQuantity, clearCart, subtotal, deliveryFee, total, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
