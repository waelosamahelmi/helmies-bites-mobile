import { create } from 'zustand';

interface UIState {
  // Modal states
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartSheetOpen: boolean;
  isItemDetailOpen: boolean;
  
  // Selected item for detail view
  selectedItemId: string | null;

  // Loading states
  isGlobalLoading: boolean;

  // Toast queue
  toasts: Toast[];

  // Actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  openSearch: () => void;
  closeSearch: () => void;

  openCartSheet: () => void;
  closeCartSheet: () => void;

  openItemDetail: (itemId: string) => void;
  closeItemDetail: () => void;

  setGlobalLoading: (loading: boolean) => void;

  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isSearchOpen: false,
  isCartSheetOpen: false,
  isItemDetailOpen: false,
  selectedItemId: null,
  isGlobalLoading: false,
  toasts: [],

  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openCartSheet: () => set({ isCartSheetOpen: true }),
  closeCartSheet: () => set({ isCartSheetOpen: false }),

  openItemDetail: (itemId) =>
    set({ isItemDetailOpen: true, selectedItemId: itemId }),
  closeItemDetail: () =>
    set({ isItemDetailOpen: false, selectedItemId: null }),

  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${++toastId}` },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
