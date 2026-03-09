import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/components/ui/toast';
import type { MenuItem } from '@/lib/api';

interface MenuItemCardProps {
  item: MenuItem;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showAddToCart?: boolean;
  className?: string;
}

export function MenuItemCard({
  item,
  variant = 'horizontal',
  showAddToCart = true,
  className,
}: MenuItemCardProps) {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const toast = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlist, toggleWishlist } = useWishlistStore();

  const isInWishlist = wishlist.some((w) => w.id === item.id);

  const handleCardPress = () => {
    haptics.selectionChanged();
    navigate(`/dish/${item.id}`, { state: { item } });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.impactMedium();
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.impactLight();
    toggleWishlist(item);
    toast.success(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  if (variant === 'vertical') {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleCardPress}
        className={cn(
          'bg-white rounded-xl shadow-card overflow-hidden cursor-pointer',
          'w-44 flex-shrink-0',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-32 bg-surface-tertiary">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm"
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isInWishlist
                  ? 'fill-error text-error'
                  : 'fill-transparent text-text-secondary'
              )}
            />
          </button>
          {/* Popular badge */}
          {item.is_popular && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-accent-orange rounded-full">
              <Flame className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white">Popular</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-text-primary line-clamp-1 mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 mb-2 h-8">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-accent-coral">
              €{item.price.toFixed(2)}
            </span>
            {showAddToCart && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleCardPress}
        className={cn(
          'flex items-center gap-3 p-3 bg-white rounded-xl shadow-card cursor-pointer',
          className
        )}
      >
        <div className="w-16 h-16 rounded-lg bg-surface-tertiary flex-shrink-0 overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-primary truncate">
            {item.name}
          </h3>
          <p className="text-xs text-text-secondary truncate">
            {item.description}
          </p>
          <span className="font-bold text-sm text-accent-coral">
            €{item.price.toFixed(2)}
          </span>
        </div>
        {showAddToCart && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-primary" />
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Default horizontal variant
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleCardPress}
      className={cn(
        'flex gap-4 p-4 bg-white rounded-xl shadow-card cursor-pointer',
        className
      )}
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-lg bg-surface-tertiary flex-shrink-0 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        {item.is_popular && (
          <div className="absolute top-1 left-1">
            <Flame className="w-4 h-4 text-accent-orange" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base text-text-primary line-clamp-1">
              {item.name}
            </h3>
            <button onClick={handleToggleWishlist} className="p-1 -mt-0.5">
              <Heart
                className={cn(
                  'w-5 h-5',
                  isInWishlist
                    ? 'fill-error text-error'
                    : 'fill-transparent text-text-secondary'
                )}
              />
            </button>
          </div>
          <p className="text-sm text-text-secondary line-clamp-2 mt-0.5">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg text-accent-coral">
            €{item.price.toFixed(2)}
          </span>
          {item.preparation_time_minutes && (
            <div className="flex items-center gap-1 text-text-secondary">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{item.preparation_time_minutes} min</span>
            </div>
          )}
          {showAddToCart && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="h-8 px-4 rounded-md bg-primary-50 text-primary text-sm font-semibold"
            >
              Add to Cart
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
