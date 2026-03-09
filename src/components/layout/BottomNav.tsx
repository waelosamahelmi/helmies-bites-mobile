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
        'glass-nav rounded-t-[28px]',
        'pb-safe-bottom max-w-lg mx-auto',
        'shadow-[0_-4px_30px_rgba(0,0,0,0.5)]'
      )}
    >
      <div className="flex items-center justify-around h-[70px]">
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
              className="flex flex-col items-center justify-center w-16 h-full gap-1 relative"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    'w-6 h-6 transition-all duration-200 relative z-10',
                    isActive 
                      ? 'text-primary drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]' 
                      : 'text-white/50'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive && path === '/wishlist' ? 'currentColor' : 'none'}
                />
                {badgeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1',
                      'bg-gradient-to-br from-primary to-amber-500',
                      'text-dark text-[10px] font-extrabold rounded-full',
                      'flex items-center justify-center',
                      'shadow-[0_0_10px_rgba(255,122,0,0.5)]'
                    )}
                  >
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </motion.span>
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] transition-all duration-200',
                  isActive
                    ? 'font-bold text-primary'
                    : 'font-medium text-white/50'
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
