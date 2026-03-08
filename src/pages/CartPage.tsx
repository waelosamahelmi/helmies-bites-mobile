import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { MIN_ORDER_AMOUNT } from '@/lib/constants';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader
        title="Cart"
        rightAction={
          <button onClick={clearCart} className="text-xs text-error font-semibold">
            Clear
          </button>
        }
      />

      {/* Cart items */}
      <div className="bg-white mt-2">
        {items.map(({ menuItem, quantity, specialInstructions }) => (
          <div key={menuItem.id} className="flex items-center gap-3 p-4 border-b border-border">
            {menuItem.image_url && (
              <img
                src={menuItem.image_url}
                alt={menuItem.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-text-primary line-clamp-1">
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
              <button
                onClick={() => quantity === 1 ? removeItem(menuItem.id) : updateQuantity(menuItem.id, quantity - 1)}
                className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center"
              >
                {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-error" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
              <span className="w-6 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-white mt-2 p-4">
        <h3 className="text-sm font-bold text-text-primary mb-3">Order summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Delivery fee</span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-text-primary">Total</span>
            <span className="font-black text-primary text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {belowMinimum && (
        <div className="mx-4 mt-3 p-3 bg-warning/10 rounded-xl">
          <p className="text-xs text-warning font-semibold">
            Minimum order amount is {formatPrice(MIN_ORDER_AMOUNT)}. Add {formatPrice(MIN_ORDER_AMOUNT - subtotal)} more.
          </p>
        </div>
      )}

      {/* Checkout button */}
      <div className="p-4 pb-8">
        <Button
          onClick={() => navigate('/checkout')}
          className="w-full h-14 text-base"
          size="lg"
          disabled={belowMinimum}
        >
          Go to checkout  {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
}
