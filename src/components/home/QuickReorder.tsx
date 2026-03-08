import { useState, useEffect } from 'react';
import { RotateCcw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { getOrders, type Order } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import { format } from 'date-fns';

export function QuickReorder() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    getOrders('').then(orders => {
      setRecentOrders(orders.filter(o => o.status === 'delivered').slice(0, 3));
    }).catch(() => {});
  }, [user]);

  if (!user || recentOrders.length === 0) return null;

  const handleReorder = (order: Order) => {
    order.items?.forEach(item => {
      addItem({
        id: item.menu_item_id,
        tenant_id: order.tenant_id,
        category_id: '',
        name: item.name,
        price: item.price,
        currency: 'EUR',
        is_available: true,
        is_popular: false,
        allergens: [],
        dietary_restrictions: [],
        ingredients: [],
        tags: [],
      }, item.quantity, item.special_instructions);
    });
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2 mb-2">
        <RotateCcw className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-text-primary dark:text-white">Order again</h3>
      </div>
      <div className="space-y-2">
        {recentOrders.map((order, i) => (
          <motion.button
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleReorder(order)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-text-primary dark:text-white line-clamp-1">
                {order.items?.map(i => i.name).join(', ')}
              </p>
              <p className="text-xs text-text-tertiary dark:text-gray-500">
                {format(new Date(order.created_at), 'MMM d')} · {formatPrice(order.total_amount)}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
