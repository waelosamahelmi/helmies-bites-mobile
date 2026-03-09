import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { FloatingCartButton } from '@/components/cart/FloatingCartButton';
import { ToastContainer } from '@/components/ui/toast';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Main content */}
      <main className="pb-tabbar">
        <Outlet />
      </main>

      {/* Floating cart button */}
      <FloatingCartButton />

      {/* Bottom navigation */}
      <BottomNav />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
