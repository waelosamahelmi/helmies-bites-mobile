import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';

export function FloatingCartButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHaptics();
  const { itemCount, total } = useCartStore();

  // Hide on certain pages
  const hiddenPaths = ['/cart', '/checkout', '/login', '/register', '/onboarding'];
  const shouldHide = hiddenPaths.some((p) => location.pathname.startsWith(p));

  const handlePress = () => {
    haptics.impactMedium();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {!shouldHide && itemCount > 0 && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePress}
          className={cn(
            'fixed bottom-20 left-4 right-4 z-30',
            'flex items-center justify-between',
            'h-14 px-5 rounded-2xl',
            'bg-primary text-white shadow-glow',
            'max-w-lg mx-auto'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <motion.span
                key={itemCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-primary text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            </div>
            <span className="font-semibold">View Cart</span>
          </div>

          <div className="flex items-center gap-1">
            <motion.span
              key={total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-bold"
            >
              €{total.toFixed(2)}
            </motion.span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
