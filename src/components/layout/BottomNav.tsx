import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/cart', icon: ShoppingBag, label: 'Cart' },
  { path: '/wishlist', icon: Heart, label: 'Wishlist' },
  { path: '/account', icon: User, label: 'Account' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const haptics = useHaptics();
  const { itemCount } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  // Hide on certain paths
  const hiddenPaths = ['/checkout', '/login', '/register', '/onboarding'];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  const handleTabPress = (path: string) => {
    haptics.selectionChanged();
    navigate(path);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-surface-dark rounded-t-[35px]',
        'pb-safe-bottom max-w-lg mx-auto'
      )}
    >
      <div className="flex items-center justify-around h-tabbar">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive =
            path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);

          // Badge count
          let badgeCount = 0;
          if (path === '/cart') badgeCount = itemCount;
          if (path === '/wishlist') badgeCount = wishlistItems.length;

          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleTabPress(path)}
              className="flex flex-col items-center justify-center w-16 h-full gap-0.5 relative"
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary' : 'text-text-secondary'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive && path === '/wishlist' ? 'currentColor' : 'none'}
                />
                {badgeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1',
                      'bg-error text-white text-[10px] font-bold rounded-full',
                      'flex items-center justify-center'
                    )}
                  >
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </motion.span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px]',
                  isActive
                    ? 'font-bold text-primary'
                    : 'font-medium text-text-secondary'
                )}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
