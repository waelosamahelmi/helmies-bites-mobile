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
          'glass-card rounded-2xl overflow-hidden cursor-pointer card-hover',
          'w-44 flex-shrink-0',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-32 bg-dark-card">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-card to-dark">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 glass-button rounded-full"
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isInWishlist
                  ? 'fill-primary text-primary'
                  : 'fill-transparent text-white/70'
              )}
            />
          </button>
          {/* Popular badge */}
          {item.is_popular && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary to-amber-500 rounded-full">
              <Flame className="w-3 h-3 text-dark" />
              <span className="text-[10px] font-bold text-dark">Popular</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-sm text-white line-clamp-1 mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-white/50 line-clamp-2 mb-2 h-8">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-extrabold gradient-text">
              €{item.price.toFixed(2)}
            </span>
            {showAddToCart && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-glow"
              >
                <Plus className="w-4 h-4 text-dark" strokeWidth={3} />
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
          'glass-card flex items-center gap-3 p-3 rounded-xl cursor-pointer card-hover',
          className
        )}
      >
        <div className="w-16 h-16 rounded-lg bg-dark-card flex-shrink-0 overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-card to-dark">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-white truncate">
            {item.name}
          </h3>
          <p className="text-xs text-white/50 truncate">
            {item.description}
          </p>
          <span className="font-extrabold text-sm gradient-text">
            €{item.price.toFixed(2)}
          </span>
        </div>
        {showAddToCart && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary" strokeWidth={2.5} />
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
        'glass-card flex gap-4 p-4 rounded-2xl cursor-pointer card-hover',
        className
      )}
    >
      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white line-clamp-1">
                {item.name}
              </h3>
              {item.is_popular && (
                <Flame className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <button onClick={handleToggleWishlist} className="p-1 -mt-0.5">
              <Heart
                className={cn(
                  'w-5 h-5',
                  isInWishlist
                    ? 'fill-primary text-primary'
                    : 'fill-transparent text-white/40'
                )}
              />
            </button>
          </div>
          <p className="text-sm text-white/50 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="font-extrabold text-lg gradient-text">
            €{item.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-3">
            {item.preparation_time_minutes && (
              <div className="flex items-center gap-1 text-white/40">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">{item.preparation_time_minutes} min</span>
              </div>
            )}
            {showAddToCart && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="h-9 px-4 rounded-xl bg-primary text-dark text-sm font-bold shadow-glow"
              >
                Add
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-28 h-28 rounded-xl bg-dark-card flex-shrink-0 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-card to-dark">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        {/* Add button overlay */}
        <div className="absolute bottom-2 right-2">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-glow">
            <Plus className="w-5 h-5 text-dark" strokeWidth={3} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
