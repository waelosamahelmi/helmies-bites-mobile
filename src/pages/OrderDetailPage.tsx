import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, Clock, CheckCircle2, Truck, ChefHat, CircleDot, RotateCcw, Star, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/contexts/ToastContext';
import { getOrder, type Order } from '@/lib/api';
import { formatPrice, getOrderStatusText } from '@/lib/utils';
import { format } from 'date-fns';

const statusSteps = [
  { key: 'pending', label: 'Placed', icon: CircleDot },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Package },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState<number | null>(null);
  const { lastMessage } = useWebSocket(id);

  useEffect(() => {
    if (!id) return;
    async function loadOrder() {
      try {
        const data = await getOrder(id!);
        setOrder(data);
        // Estimate ETA based on status
        const statusIndex = statusSteps.findIndex(s => s.key === data.status);
        if (statusIndex >= 0 && statusIndex < 4) {
          setEta((4 - statusIndex) * 10);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!lastMessage || !order) return;
    if (lastMessage.type === 'order_update' && lastMessage.data?.status) {
      setOrder(prev => prev ? { ...prev, status: lastMessage.data.status } : prev);
      toast.info(`Order status: ${getOrderStatusText(lastMessage.data.status)}`);
    }
  }, [lastMessage]);

  // Countdown timer
  useEffect(() => {
    if (eta === null || eta <= 0) return;
    const interval = setInterval(() => {
      setEta(prev => (prev && prev > 0) ? prev - 1 : 0);
    }, 60000);
    return () => clearInterval(interval);
  }, [eta]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
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
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <BackHeader title="Order details" />
        <p className="text-center text-text-secondary dark:text-gray-400 mt-8">Order not found</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isActive = !isCancelled && !isDelivered;

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        <BackHeader title="Order details" />

        {/* ETA countdown for active orders */}
        {isActive && eta && eta > 0 && (
          <FadeIn>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-primary to-primary-600 mx-4 mt-4 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Timer className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Estimated arrival</p>
                <p className="text-2xl font-black text-white">{eta} min</p>
              </div>
            </motion.div>
          </FadeIn>
        )}

        {/* Status */}
        <FadeIn delay={0.1}>
          <div className="bg-white dark:bg-gray-900 p-4 mt-2 mx-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-text-primary dark:text-white">{getOrderStatusText(order.status)}</h2>
              <Badge variant={isCancelled ? 'error' : isDelivered ? 'success' : 'primary'}>{order.status}</Badge>
            </div>

            {!isCancelled && (
              <div className="flex items-center justify-between px-1">
                {statusSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i <= currentStepIndex;
                  const isCurrentStep = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1 relative">
                      <motion.div
                        animate={isCurrentStep ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? 'bg-primary text-white' : 'bg-surface-secondary dark:bg-gray-800 text-text-tertiary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      <span className={`text-[9px] font-medium ${isActive ? 'text-primary' : 'text-text-tertiary dark:text-gray-600'}`}>
                        {step.label}
                      </span>
                      {i < statusSteps.length - 1 && (
                        <div className={`absolute top-4 left-[calc(50%+18px)] h-0.5 ${
                          i < currentStepIndex ? 'bg-primary' : 'bg-surface-tertiary dark:bg-gray-700'
                        }`} style={{ width: '40px' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Items */}
        <FadeIn delay={0.15}>
          <div className="bg-white dark:bg-gray-900 mt-3 mx-4 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-text-primary dark:text-white mb-3">Order items</h3>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary dark:text-gray-400">{item.quantity}x {item.name}</span>
                  <span className="font-semibold dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Delivery */}
        {order.delivery_address && (
          <FadeIn delay={0.2}>
            <div className="bg-white dark:bg-gray-900 mt-3 mx-4 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-text-primary dark:text-white">Delivery address</h3>
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-400">{order.delivery_address.street}</p>
              {order.delivery_instructions && (
                <p className="text-xs text-text-tertiary dark:text-gray-500 mt-1">Note: {order.delivery_instructions}</p>
              )}
            </div>
          </FadeIn>
        )}

        {/* Summary */}
        <FadeIn delay={0.25}>
          <div className="bg-white dark:bg-gray-900 mt-3 mx-4 rounded-2xl p-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-gray-400">Subtotal</span>
                <span className="font-semibold dark:text-white">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-gray-400">Delivery fee</span>
                <span className="font-semibold dark:text-white">{formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="border-t border-border dark:border-gray-800 pt-2 flex justify-between">
                <span className="font-bold dark:text-white">Total</span>
                <span className="font-black text-primary">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Payment & time */}
        <FadeIn delay={0.3}>
          <div className="bg-white dark:bg-gray-900 mt-3 mx-4 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
              <CreditCard className="w-4 h-4" />
              <span>{order.payment_method === 'stripe' ? 'Card payment' : 'Cash'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 mt-2">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(order.created_at), 'MMMM d, yyyy · HH:mm')}</span>
            </div>
          </div>
        </FadeIn>

        {/* Actions */}
        <FadeIn delay={0.35}>
          <div className="px-4 mt-4 mb-8 flex gap-3">
            {isDelivered && (
              <>
                <Button
                  onClick={() => navigate(`/review/${order.id}`)}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  <Star className="w-4 h-4 mr-2" /> Rate order
                </Button>
                <Button
                  onClick={() => navigate('/cart')}
                  className="flex-1 h-12"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reorder
                </Button>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
