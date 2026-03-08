import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, MapPin, CreditCard, Clock, CheckCircle2, Truck, ChefHat, CircleDot } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrder, type Order } from '@/lib/api';
import { formatPrice, getOrderStatusText } from '@/lib/utils';
import { format } from 'date-fns';

const statusSteps = [
  { key: 'pending', label: 'Order placed', icon: CircleDot },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Package },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadOrder() {
      try {
        const data = await getOrder(id!);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Order details" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Order details" />
        <p className="text-center text-text-secondary mt-8">Order not found</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader title="Order details" />

      {/* Status */}
      <div className="bg-white p-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-text-primary">{getOrderStatusText(order.status)}</h2>
          <Badge variant={isCancelled ? 'error' : 'primary'}>{order.status}</Badge>
        </div>

        {!isCancelled && (
          <div className="flex items-center justify-between px-2">
            {statusSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center gap-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-primary text-white' : 'bg-surface-secondary text-text-tertiary'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-tertiary'}`}>
                    {step.label}
                  </span>
                  {i < statusSteps.length - 1 && (
                    <div className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 ${
                      i < currentStepIndex ? 'bg-primary' : 'bg-surface-tertiary'
                    }`} style={{ width: '60px' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white mt-2 p-4">
        <h3 className="text-sm font-bold text-text-primary mb-3">Order items</h3>
        <div className="space-y-2">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-text-secondary">{item.quantity}x {item.name}</span>
              <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      {order.delivery_address && (
        <div className="bg-white mt-2 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-text-primary">Delivery address</h3>
          </div>
          <p className="text-sm text-text-secondary">{order.delivery_address.street}</p>
          {order.delivery_instructions && (
            <p className="text-xs text-text-tertiary mt-1">Note: {order.delivery_instructions}</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-white mt-2 p-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-semibold">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Delivery fee</span>
            <span className="font-semibold">{formatPrice(order.delivery_fee)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-black text-primary">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Payment & time */}
      <div className="bg-white mt-2 p-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <CreditCard className="w-4 h-4" />
          <span>{order.payment_method === 'stripe' ? 'Card payment' : 'Cash'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
          <Clock className="w-4 h-4" />
          <span>{format(new Date(order.created_at), 'MMMM d, yyyy  HH:mm')}</span>
        </div>
      </div>
    </div>
  );
}