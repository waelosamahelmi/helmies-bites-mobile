import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, MessageSquare } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TipSelector } from '@/components/checkout/TipSelector';
import { DeliveryTimePicker } from '@/components/checkout/DeliveryTimePicker';
import { PromoCodeInput } from '@/components/checkout/PromoCodeInput';
import { ConfettiEffect } from '@/components/ui/confetti';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { usePromoCode } from '@/hooks/usePromoCode';
import { createOrder, createPaymentIntent } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, restaurantId, clearCart } = useCart();
  const { user } = useAuth();
  const { address } = useLocation();
  const toast = useToast();
  const haptics = useHaptics();
  const { appliedCode, error: promoError, applyCode, removeCode, calculateDiscount } = usePromoCode();

  const [deliveryAddress, setDeliveryAddress] = useState(address || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash'>('stripe');
  const [tip, setTip] = useState(0);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <BackHeader title="Checkout" />
        <div className="p-8 text-center">
          <h2 className="text-lg font-bold dark:text-white mb-2">Sign in to continue</h2>
          <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">You need to be signed in to place an order</p>
          <Button onClick={() => navigate('/login')}>Sign in</Button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(subtotal);
  const finalTotal = total - discount + tip;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setFormError('Please enter a delivery address');
      return;
    }

    try {
      setLoading(true);
      setFormError('');

      const orderData = {
        customer_id: user.id,
        items: items.map(({ menuItem, quantity, specialInstructions }) => ({
          menu_item_id: menuItem.id,
          name: menuItem.name,
          quantity,
          price: menuItem.price,
          special_instructions: specialInstructions,
        })),
        subtotal,
        delivery_fee: deliveryFee,
        tax_amount: 0,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        delivery_address: { street: deliveryAddress, city: 'Helsinki', postal_code: '00100' },
        delivery_instructions: deliveryInstructions || undefined,
        scheduled_for: scheduledTime || undefined,
        tip_amount: tip,
        promo_code: appliedCode?.code,
        discount_amount: discount,
      };

      const order = await createOrder(restaurantId!, orderData);

      if (paymentMethod === 'stripe') {
        await createPaymentIntent(restaurantId!, finalTotal, order.id);
      }

      haptics.notification('success');
      setShowConfetti(true);
      toast.success('Order placed successfully!');
      clearCart();

      setTimeout(() => {
        navigate(`/orders/${order.id}`, { replace: true });
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to place order');
      haptics.notification('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        <BackHeader title="Checkout" />
        <ConfettiEffect active={showConfetti} />

        {/* Delivery address */}
        <FadeIn delay={0.05}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary dark:text-white">Delivery address</h3>
            </div>
            <Input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
            />
          </div>
        </FadeIn>

        {/* Delivery time */}
        <FadeIn delay={0.1}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <DeliveryTimePicker onTimeChange={setScheduledTime} />
          </div>
        </FadeIn>

        {/* Delivery instructions */}
        <FadeIn delay={0.15}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary dark:text-white">Delivery instructions</h3>
            </div>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="e.g. Ring doorbell, leave at door..."
              className="w-full h-20 rounded-xl bg-surface-secondary dark:bg-gray-800 px-4 py-3 text-sm text-text-primary dark:text-white placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary"
            />
          </div>
        </FadeIn>

        {/* Payment method */}
        <FadeIn delay={0.2}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary dark:text-white">Payment method</h3>
            </div>
            <div className="space-y-2">
              {[
                { value: 'stripe' as const, label: 'Credit / Debit card', desc: 'Pay securely with Stripe' },
                { value: 'cash' as const, label: 'Cash on delivery', desc: 'Pay when you receive your order' },
              ].map(pm => (
                <button
                  key={pm.value}
                  onClick={() => setPaymentMethod(pm.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === pm.value
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-border dark:border-gray-700 hover:border-border-strong'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === pm.value ? 'border-primary' : 'border-border-strong dark:border-gray-600'
                  }`}>
                    {paymentMethod === pm.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-text-primary dark:text-white">{pm.label}</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">{pm.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Tip */}
        <FadeIn delay={0.25}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <TipSelector subtotal={subtotal} onTipChange={setTip} />
          </div>
        </FadeIn>

        {/* Promo code */}
        <FadeIn delay={0.3}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <PromoCodeInput
              onApply={(code) => applyCode(code, subtotal)}
              onRemove={removeCode}
              appliedCode={appliedCode}
              error={promoError}
            />
          </div>
        </FadeIn>

        {/* Order summary */}
        <FadeIn delay={0.35}>
          <div className="bg-white dark:bg-gray-900 mt-2 p-4">
            <h3 className="text-sm font-bold text-text-primary dark:text-white mb-3">Order summary</h3>
            <div className="space-y-1.5">
              {items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary dark:text-gray-400">{quantity}x {menuItem.name_en || menuItem.name}</span>
                  <span className="font-semibold dark:text-white">{formatPrice(menuItem.price * quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border dark:border-gray-800 pt-2 mt-2 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary dark:text-gray-400">Delivery fee</span>
                  <span className="font-semibold dark:text-white">{formatPrice(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success font-semibold">Discount ({appliedCode?.code})</span>
                    <span className="text-success font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary dark:text-gray-400">Driver tip</span>
                    <span className="font-semibold dark:text-white">{formatPrice(tip)}</span>
                  </div>
                )}
                <div className="border-t border-border dark:border-gray-800 pt-2 flex justify-between">
                  <span className="font-bold dark:text-white">Total</span>
                  <span className="font-black text-primary text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {formError && (
          <div className="mx-4 mt-3 p-3 bg-error/10 rounded-xl">
            <p className="text-xs text-error font-semibold">{formError}</p>
          </div>
        )}

        <div className="p-4 pb-8">
          <Button onClick={handlePlaceOrder} className="w-full h-14 text-base" size="lg" loading={loading}>
            Place order · {formatPrice(finalTotal)}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
