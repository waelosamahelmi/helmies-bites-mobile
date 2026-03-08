import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ClipboardList, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useHaptics } from '@/hooks/useHaptics';

const tabs = [
  { path: '/', icon: Home, label: 'Discovery' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/account', icon: User, label: 'Account' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const haptics = useHaptics();

  const hiddenPaths = ['/checkout', '/login', '/register', '/onboarding'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-border dark:border-gray-800 shadow-bottom-nav safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.85 }}
              onClick={() => { navigate(path); haptics.selectionChanged(); }}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-full gap-0.5 transition-colors relative',
                isActive ? 'text-primary' : 'text-text-tertiary dark:text-gray-500'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {label === 'Orders' && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <span className={cn('text-[10px]', isActive ? 'font-bold' : 'font-medium')}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px left-3 right-3 h-0.5 bg-primary rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
