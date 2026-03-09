import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/lib/api';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

export function MenuItemCard({ item, onClick, variant = 'horizontal' }: MenuItemCardProps) {
  const placeholderImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';

  if (variant === 'vertical') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={!item.is_available}
        className="glass-card rounded-2xl overflow-hidden w-[160px] flex-shrink-0 text-left card-hover"
      >
        <div className="relative h-[120px] overflow-hidden">
          <img
            src={item.image_url || placeholderImg}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {item.is_popular && (
            <div className="absolute top-2 left-2">
              <span className="badge-primary text-[10px]">🔥 Popular</span>
            </div>
          )}
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white/80 text-sm font-semibold">Sold Out</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-bold text-white line-clamp-1">
            {item.name_en || item.name}
          </h3>
          {(item.description_en || item.description) && (
            <p className="text-xs text-white/50 mt-1 line-clamp-2">
              {item.description_en || item.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-extrabold gradient-text">
              {formatPrice(item.price)}
            </span>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <Plus className="w-4 h-4 text-dark" strokeWidth={3} />
            </div>
          </div>
        </div>
      </motion.button>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={!item.is_available}
        className="glass-card rounded-xl p-3 flex items-center gap-3 w-full text-left card-hover"
      >
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image_url || placeholderImg}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white line-clamp-1">
            {item.name_en || item.name}
          </h3>
          <span className="text-sm font-bold gradient-text">
            {formatPrice(item.price)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary" strokeWidth={2.5} />
        </div>
      </motion.button>
    );
  }

  // Default horizontal variant
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={!item.is_available}
      className="glass-card rounded-2xl p-4 flex gap-4 w-full text-left card-hover"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white line-clamp-1">
            {item.name_en || item.name}
          </h3>
          {item.is_popular && (
            <span className="badge-primary text-[10px]">🔥</span>
          )}
        </div>
        {(item.description_en || item.description) && (
          <p className="text-sm text-white/50 mt-1.5 line-clamp-2">
            {item.description_en || item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-extrabold gradient-text">
            {formatPrice(item.price)}
          </span>
          {!item.is_available && (
            <span className="text-xs text-red-400 font-medium">Unavailable</span>
          )}
        </div>
        {item.allergens?.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {item.allergens.slice(0, 3).map(a => (
              <span 
                key={a} 
                className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={item.image_url || placeholderImg}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/60" />
        )}
        <div className="absolute bottom-2 right-2">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-glow">
            <Plus className="w-5 h-5 text-dark" strokeWidth={3} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
