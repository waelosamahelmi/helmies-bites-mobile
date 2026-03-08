import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Clock, MessageSquare } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { createOrder, createPaymentIntent } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, restaurantId, clearCart } = useCart();
  const { user } = useAuth();
  const { address } = useLocation();

  const [deliveryAddress, setDeliveryAddress] = useState(address || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash'>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Checkout" />
        <div className="p-8 text-center">
          <h2 className="text-lg font-bold mb-2">Sign in to continue</h2>
          <p className="text-sm text-text-secondary mb-4">You need to be signed in to place an order</p>
          <Button onClick={() => navigate('/login')}>Sign in</Button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    try {
      setLoading(true);
      setError('');

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
        total_amount: total,
        payment_method: paymentMethod,
        delivery_address: {
          street: deliveryAddress,
          city: 'Helsinki',
          postal_code: '00100',
        },
        delivery_instructions: deliveryInstructions || undefined,
      };

      const order = await createOrder(restaurantId!, orderData);

      if (paymentMethod === 'stripe') {
        await createPaymentIntent(restaurantId!, total, order.id);
      }

      clearCart();
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader title="Checkout" />

      {/* Delivery address */}
      <div className="bg-white mt-2 p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-text-primary">Delivery address</h3>
        </div>
        <Input
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Enter your delivery address"
        />
      </div>

      {/* Delivery instructions */}
      <div className="bg-white mt-2 p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-text-primary">Delivery instructions</h3>
        </div>
        <textarea
          value={deliveryInstructions}
          onChange={(e) => setDeliveryInstructions(e.target.value)}
          placeholder="e.g. Ring doorbell, leave at door..."
          className="w-full h-20 rounded-xl bg-surface-secondary px-4 py-3 text-sm placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary"
        />
      </div>

      {/* Payment method */}
      <div className="bg-white mt-2 p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-text-primary">Payment method</h3>
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
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border-strong'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === pm.value ? 'border-primary' : 'border-border-strong'
              }`}>
                {paymentMethod === pm.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary">{pm.label}</p>
                <p className="text-xs text-text-secondary">{pm.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white mt-2 p-4">
        <h3 className="text-sm font-bold text-text-primary mb-3">Order summary</h3>
        <div className="space-y-1.5">
          {items.map(({ menuItem, quantity }) => (
            <div key={menuItem.id} className="flex justify-between text-sm">
              <span className="text-text-secondary">{quantity}x {menuItem.name_en || menuItem.name}</span>
              <span className="font-semibold">{formatPrice(menuItem.price * quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Delivery fee</span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-black text-primary text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 p-3 bg-error/10 rounded-xl">
          <p className="text-xs text-error font-semibold">{error}</p>
        </div>
      )}

      {/* Place order button */}
      <div className="p-4 pb-8">
        <Button
          onClick={handlePlaceOrder}
          className="w-full h-14 text-base"
          size="lg"
          loading={loading}
        >
          Place order  {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
}
