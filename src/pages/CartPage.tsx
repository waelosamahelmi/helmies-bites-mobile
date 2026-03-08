import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SwipeableItem } from '@/components/ui/swipeable-item';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useCart } from '@/contexts/CartContext';
import { useHaptics } from '@/hooks/useHaptics';
import { formatPrice } from '@/lib/utils';
import { MIN_ORDER_AMOUNT } from '@/lib/constants';

export default function CartPage() {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <BackHeader title="Cart" />
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="Your cart is empty"
          description="Add items from a restaurant to get started"
          action={<Button onClick={() => navigate('/')}>Browse restaurants</Button>}
        />
      </div>
    );
  }

  const belowMinimum = subtotal < MIN_ORDER_AMOUNT;

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        <BackHeader
          title="Cart"
          rightAction={
            <button onClick={() => { clearCart(); haptics.impact('medium'); }} className="text-xs text-error font-semibold">
              Clear
            </button>
          }
        />

        {/* Cart items with swipe-to-delete */}
        <div className="bg-white dark:bg-gray-900 mt-2">
          {items.map(({ menuItem, quantity, specialInstructions }, i) => (
            <FadeIn key={menuItem.id} delay={i * 0.05}>
              <SwipeableItem onDelete={() => { removeItem(menuItem.id); haptics.notification('warning'); }}>
                <div className="flex items-center gap-3 p-4 border-b border-border dark:border-gray-800">
                  {menuItem.image_url && (
                    <img
                      src={menuItem.image_url}
                      alt={menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-text-primary dark:text-white line-clamp-1">
                      {menuItem.name_en || menuItem.name}
                    </h3>
                    {specialInstructions && (
                      <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{specialInstructions}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-1">
                      {formatPrice(menuItem.price * quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => {
                        haptics.impact('light');
                        quantity === 1 ? removeItem(menuItem.id) : updateQuantity(menuItem.id, quantity - 1);
                      }}
                      className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-gray-800 flex items-center justify-center"
                    >
                      {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-error" /> : <Minus className="w-3.5 h-3.5 dark:text-white" />}
                    </motion.button>
                    <motion.span
                      key={quantity}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="w-6 text-center text-sm font-bold dark:text-white"
                    >
                      {quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => { haptics.impact('light'); updateQuantity(menuItem.id, quantity + 1); }}
                      className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-gray-800 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5 dark:text-white" />
                    </motion.button>
                  </div>
                </div>
              </SwipeableItem>
            </FadeIn>
          ))}
        </div>

        {/* Order summary */}
        <FadeIn delay={0.2}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <h3 className="text-sm font-bold text-text-primary dark:text-white mb-3">Order summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-gray-400">Subtotal</span>
                <span className="font-semibold dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-gray-400">Delivery fee</span>
                <span className="font-semibold dark:text-white">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-border dark:border-gray-800 pt-2 flex justify-between">
                <span className="font-bold text-text-primary dark:text-white">Total</span>
                <span className="font-black text-primary text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {belowMinimum && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-3 p-3 bg-warning/10 rounded-xl"
          >
            <p className="text-xs text-warning font-semibold">
              Minimum order is {formatPrice(MIN_ORDER_AMOUNT)}. Add {formatPrice(MIN_ORDER_AMOUNT - subtotal)} more.
            </p>
          </motion.div>
        )}

        <div className="p-4 pb-8">
          <Button
            onClick={() => navigate('/checkout')}
            className="w-full h-14 text-base"
            size="lg"
            disabled={belowMinimum}
          >
            Go to checkout · {formatPrice(total)}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
