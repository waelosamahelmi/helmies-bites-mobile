import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { FloatingCartButton } from '@/components/cart/FloatingCartButton';
import { ToastContainer } from '@/components/ui/toast';

export function AppLayout() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative">
      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-glow opacity-40" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-radial from-primary/5 to-transparent" />
      </div>

      {/* Main content */}
      <main className="pb-tabbar relative z-10">
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
