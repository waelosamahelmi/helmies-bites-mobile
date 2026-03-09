import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  ChevronRight,
  ChevronDown,
  Check,
  AlertCircle,
  Phone,
  User,
  Mail,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useCartStore } from '@/stores';
import { useLocation } from '@/contexts/LocationContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

type PaymentMethod = 'card' | 'cash' | 'apple_pay' | 'google_pay';
type DeliveryTime = 'asap' | 'scheduled';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const toast = useToast();
  const { address, city } = useLocation();

  const {
    items,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    clearCart,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>('asap');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [instructions, setInstructions] = useState('');

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(address || '');

  const handleSubmitOrder = async () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    haptics.impactMedium();

    try {
      // Simulate order submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and navigate to success
      clearCart();
      navigate('/orders', {
        state: { orderSuccess: true, orderId: 'ORD-' + Date.now() },
      });
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary pb-40">
        <Header title="Checkout" showBack />

        <div className="pt-header">
          {/* Customer Details */}
          <FadeIn>
            <div className="bg-white p-4 mb-2">
              <h2 className="font-semibold text-text-primary mb-4">
                Contact Details
              </h2>
              <div className="space-y-3">
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  leftIcon={<User className="w-5 h-5" />}
                />
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone number"
                  type="tel"
                  leftIcon={<Phone className="w-5 h-5" />}
                />
                <Input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email (optional)"
                  type="email"
                  leftIcon={<Mail className="w-5 h-5" />}
                />
              </div>
            </div>
          </FadeIn>

          {/* Delivery Address */}
          <FadeIn delay={0.1}>
            <div className="bg-white p-4 mb-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary">
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-primary text-sm font-medium"
                >
                  {showAddressForm ? 'Cancel' : 'Change'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {showAddressForm ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary">
                        {city || 'Delivery Address'}
                      </p>
                      <p className="text-sm text-text-secondary truncate">
                        {deliveryAddress || 'Please add your address'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>

          {/* Delivery Time */}
          <FadeIn delay={0.15}>
            <div className="bg-white p-4 mb-2">
              <h2 className="font-semibold text-text-primary mb-4">
                Delivery Time
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryTime('asap')}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    deliveryTime === 'asap'
                      ? 'border-primary bg-primary-50'
                      : 'border-border'
                  )}
                >
                  <Clock
                    className={cn(
                      'w-5 h-5',
                      deliveryTime === 'asap'
                        ? 'text-primary'
                        : 'text-text-secondary'
                    )}
                  />
                  <div className="text-left">
                    <p
                      className={cn(
                        'font-medium text-sm',
                        deliveryTime === 'asap'
                          ? 'text-primary'
                          : 'text-text-primary'
                      )}
                    >
                      ASAP
                    </p>
                    <p className="text-xs text-text-secondary">25-35 min</p>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryTime('scheduled')}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    deliveryTime === 'scheduled'
                      ? 'border-primary bg-primary-50'
                      : 'border-border'
                  )}
                >
                  <Clock
                    className={cn(
                      'w-5 h-5',
                      deliveryTime === 'scheduled'
                        ? 'text-primary'
                        : 'text-text-secondary'
                    )}
                  />
                  <div className="text-left">
                    <p
                      className={cn(
                        'font-medium text-sm',
                        deliveryTime === 'scheduled'
                          ? 'text-primary'
                          : 'text-text-primary'
                      )}
                    >
                      Schedule
                    </p>
                    <p className="text-xs text-text-secondary">Pick time</p>
                  </div>
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Payment Method */}
          <FadeIn delay={0.2}>
            <div className="bg-white p-4 mb-2">
              <h2 className="font-semibold text-text-primary mb-4">
                Payment Method
              </h2>
              <div className="space-y-2">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'cash', label: 'Cash on Delivery', icon: Wallet },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={cn(
                      'flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all',
                      paymentMethod === method.id
                        ? 'border-primary bg-primary-50'
                        : 'border-border'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon
                        className={cn(
                          'w-5 h-5',
                          paymentMethod === method.id
                            ? 'text-primary'
                            : 'text-text-secondary'
                        )}
                      />
                      <span
                        className={cn(
                          'font-medium',
                          paymentMethod === method.id
                            ? 'text-primary'
                            : 'text-text-primary'
                        )}
                      >
                        {method.label}
                      </span>
                    </div>
                    {paymentMethod === method.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Delivery Instructions */}
          <FadeIn delay={0.25}>
            <div className="bg-white p-4 mb-2">
              <h2 className="font-semibold text-text-primary mb-3">
                Delivery Instructions (Optional)
              </h2>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g., Ring the doorbell, leave at door..."
              />
            </div>
          </FadeIn>

          {/* Order Summary */}
          <FadeIn delay={0.3}>
            <div className="bg-white p-4">
              <h2 className="font-semibold text-text-primary mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-text-secondary">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="text-text-primary">
                      €{(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary">
                    €{subtotal.toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-primary">Discount</span>
                    <span className="text-primary">
                      -€{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Delivery Fee</span>
                  <span className="text-text-primary">
                    €{deliveryFee.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-4 pb-safe-bottom shadow-sheet max-w-lg mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary">Total</span>
            <span className="text-2xl font-bold text-text-primary">
              €{total.toFixed(2)}
            </span>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleSubmitOrder}
            isLoading={isSubmitting}
            disabled={!customerName || !customerPhone || !deliveryAddress}
          >
            {paymentMethod === 'cash' ? 'Place Order' : 'Pay & Order'}
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
