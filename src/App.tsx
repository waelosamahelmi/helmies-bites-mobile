import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider } from '@/contexts/CartContext';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
import DiscoveryPage from '@/pages/DiscoveryPage';
import SearchPage from '@/pages/SearchPage';
import RestaurantPage from '@/pages/RestaurantPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import AccountPage from '@/pages/AccountPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ProfilePage from '@/pages/ProfilePage';
import AddressesPage from '@/pages/AddressesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth pages (no bottom nav) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Main app with bottom nav */}
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DiscoveryPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/restaurant/:slug" element={<RestaurantPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/loyalty" element={<LoyaltyPage />} />
                  <Route path="/addresses" element={<AddressesPage />} />
                  <Route path="/address" element={<AddressesPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
