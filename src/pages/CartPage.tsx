import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Ticket, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useCartStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/components/ui/toast';
import { useState } from 'react';
import { usePromoCode } from '@/hooks/usePromoCode';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const toast = useToast();

  const {
    items,
    subtotal,
    deliveryFee,
    discount,
    discountAmount,
    promoCode,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    clearPromoCode,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const { validateCode, isValidating } = usePromoCode();

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;

    haptics.selectionChanged();
    const result = await validateCode(promoInput.trim());

    if (result.valid) {
      applyPromoCode(promoInput.trim().toUpperCase(), result.discount);
      toast.success(`Promo code applied! ${result.discount}% off`);
      setPromoInput('');
    } else {
      toast.error(result.message || 'Invalid promo code');
    }
  };

  const handleCheckout = () => {
    haptics.impactMedium();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    haptics.impactLight();
    clearCart();
    toast.success('Cart cleared');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary">
        <Header title="Your Cart" showBack />

        <div className="pt-header pb-40">
          {items.length === 0 ? (
            // Empty state
            <FadeIn>
              <div className="flex flex-col items-center justify-center px-8 py-20">
                <div className="w-24 h-24 rounded-full bg-surface-tertiary flex items-center justify-center mb-6">
                  <ShoppingBag className="w-12 h-12 text-text-tertiary" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  Your cart is empty
                </h2>
                <p className="text-text-secondary text-center mb-6">
                  Add some delicious dishes to get started
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Menu
                </Button>
              </div>
            </FadeIn>
          ) : (
            <>
              {/* Clear cart header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border">
                <span className="text-sm text-text-secondary">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-error hover:bg-error/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              {/* Cart items */}
              <div className="px-4 py-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.menuItem.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 bg-white rounded-xl shadow-card"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg bg-surface-tertiary flex-shrink-0 overflow-hidden">
                        {item.menuItem.image_url ? (
                          <img
                            src={item.menuItem.image_url}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-semibold text-sm text-text-primary line-clamp-1">
                            {item.menuItem.name}
                          </h3>
                          {item.specialInstructions && (
                            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-accent-coral">
                            €{(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                          <QuantitySelector
                            quantity={item.quantity}
                            onIncrement={() =>
                              updateQuantity(item.menuItem.id, item.quantity + 1)
                            }
                            onDecrement={() =>
                              updateQuantity(item.menuItem.id, item.quantity - 1)
                            }
                            onRemove={() => removeItem(item.menuItem.id)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Promo code section */}
              <div className="px-4 py-4">
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-text-primary">
                      Promo Code
                    </span>
                  </div>

                  {promoCode ? (
                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                      <div>
                        <span className="font-bold text-primary">
                          {promoCode}
                        </span>
                        <span className="text-sm text-primary ml-2">
                          ({discount}% off)
                        </span>
                      </div>
                      <button
                        onClick={clearPromoCode}
                        className="text-sm text-error font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        isLoading={isValidating}
                        variant="secondary"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom checkout section */}
        {items.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-4 pb-safe-bottom shadow-sheet max-w-lg mx-auto"
          >
            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">€{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-primary">Discount</span>
                  <span className="text-primary">-€{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Delivery</span>
                <span className="text-text-primary">€{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-bold text-text-primary">Total</span>
                <span className="font-bold text-lg text-text-primary">
                  €{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleCheckout}
              rightIcon={<ChevronRight className="w-5 h-5" />}
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
