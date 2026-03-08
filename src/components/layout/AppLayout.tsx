import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { FloatingCartButton } from '@/components/cart/FloatingCartButton';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <main className="pb-16">
        <Outlet />
      </main>
      <FloatingCartButton />
      <BottomNav />
    </div>
  );
}
