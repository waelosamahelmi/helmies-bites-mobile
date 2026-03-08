import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, type Order } from '@/lib/api';
import { formatPrice, getOrderStatusColor, getOrderStatusText } from '@/lib/utils';
import { format } from 'date-fns';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function loadOrders() {
      try {
        const data = await getOrders('');
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <EmptyState
          icon={<ClipboardList className="w-10 h-10" />}
          title="Sign in to see orders"
          description="Track your past and active orders"
          action={<Button onClick={() => navigate('/login')}>Sign in</Button>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="bg-white px-4 py-4 safe-top">
        <h1 className="text-xl font-black text-text-primary">Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-2 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-10 h-10" />}
          title="No orders yet"
          description="Your order history will appear here"
          action={<Button onClick={() => navigate('/')}>Start ordering</Button>}
        />
      ) : (
        <div className="space-y-2 mt-2 pb-20">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="w-full bg-white p-4 text-left flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'cancelled' ? 'error' : 'primary'
                    }
                  >
                    {getOrderStatusText(order.status)}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {order.items?.length || 0} items  {formatPrice(order.total_amount)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-text-tertiary">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {format(new Date(order.created_at), 'MMM d, yyyy  HH:mm')}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}