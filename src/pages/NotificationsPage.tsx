import { useState } from 'react';
import { Bell, Package, Gift, Megaphone, Tag, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'reward' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const icons: Record<string, typeof Bell> = {
  order: Package,
  promo: Tag,
  reward: Gift,
  general: Megaphone,
};

const iconColors: Record<string, string> = {
  order: 'bg-info/10 text-info',
  promo: 'bg-primary/10 text-primary',
  reward: 'bg-success/10 text-success',
  general: 'bg-warning/10 text-warning',
};

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: '1', type: 'promo', title: 'Flash Sale!',
    message: 'Use code HELMIES20 for 20% off your next order. Valid until midnight!',
    timestamp: new Date().toISOString(), read: false,
  },
  {
    id: '2', type: 'reward', title: 'Points Earned',
    message: 'You earned 150 loyalty points from your last order. Keep collecting!',
    timestamp: new Date(Date.now() - 3600000).toISOString(), read: false,
  },
  {
    id: '3', type: 'order', title: 'Order Delivered',
    message: 'Your order has been delivered. Enjoy your meal! Rate your experience.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), read: true,
  },
  {
    id: '4', type: 'general', title: 'New Restaurant',
    message: 'A new sushi restaurant has opened near you! Check out their menu.',
    timestamp: new Date(Date.now() - 172800000).toISOString(), read: true,
  },
  {
    id: '5', type: 'promo', title: 'Free Delivery Weekend',
    message: 'Free delivery on all orders this weekend. No minimum order required!',
    timestamp: new Date(Date.now() - 259200000).toISOString(), read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
      <BackHeader
        title="Notifications"
        rightAction={
          unreadCount > 0 ? (
            <button onClick={markAllRead} className="text-xs font-semibold text-primary flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-10 h-10" />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="pb-20">
          <AnimatePresence>
            {notifications.map((notif, i) => {
              const Icon = icons[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => markRead(notif.id)}
                    className={`w-full text-left flex gap-3 p-4 border-b border-border dark:border-gray-800 transition-colors ${
                      notif.read ? 'bg-white dark:bg-gray-900' : 'bg-primary/5 dark:bg-primary/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[notif.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-text-primary dark:text-white">{notif.title}</h3>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-text-tertiary dark:text-gray-600 mt-1">
                        {format(new Date(notif.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                      className="p-1 flex-shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
