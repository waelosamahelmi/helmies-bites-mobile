import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { useOnboarding } from '@/hooks/useOnboarding';

// Pages
import OnboardingPage from '@/pages/OnboardingPage';
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
import NotificationsPage from '@/pages/NotificationsPage';
import ReferralPage from '@/pages/ReferralPage';
import SettingsPage from '@/pages/SettingsPage';
import SupportPage from '@/pages/SupportPage';
import WriteReviewPage from '@/pages/WriteReviewPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppContent() {
  const { completed, complete } = useOnboarding();

  if (!completed) {
    return <OnboardingPage onComplete={complete} />;
  }

  return (
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
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/review/:orderId" element={<WriteReviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <LocationProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </LocationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
