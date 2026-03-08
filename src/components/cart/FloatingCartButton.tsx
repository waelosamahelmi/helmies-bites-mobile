import { ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export function FloatingCartButton() {
  const { itemCount, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on cart/checkout pages
  const hiddenPaths = ['/cart', '/checkout', '/login', '/register'];
  const shouldHide = hiddenPaths.some(p => location.pathname.startsWith(p));

  return (
    <AnimatePresence>
      {itemCount > 0 && !shouldHide && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={() => navigate('/cart')}
          className="fixed bottom-20 left-4 right-4 z-30 bg-primary text-white rounded-2xl py-3.5 px-5 flex items-center justify-between floating-cart max-w-lg mx-auto"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">View cart</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">{itemCount} items</span>
            <span className="bg-white/20 rounded-lg px-3 py-1 text-sm font-bold">
              {formatPrice(total)}
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
