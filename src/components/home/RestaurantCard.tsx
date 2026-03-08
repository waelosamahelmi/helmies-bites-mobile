import { Heart, Star, Clock, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, formatPrice, formatDistance, formatDeliveryTime } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import type { Restaurant } from '@/hooks/useRestaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'default' | 'wide';
}

export function RestaurantCard({ restaurant, variant = 'default' }: RestaurantCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { tenant, branch, distance, deliveryTime, deliveryFee, rating, imageUrl } = restaurant;
  const fav = isFavorite(tenant.id);

  const placeholderImg = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop`;

  return (
    <button
      onClick={() => navigate(`/restaurant/${tenant.slug}`)}
      className={cn(
        'bg-white rounded-2xl overflow-hidden text-left transition-shadow hover:shadow-card-hover',
        variant === 'wide' ? 'flex' : 'block w-full'
      )}
    >
      {/* Image */}
      <div className={cn(
        'relative overflow-hidden bg-surface-tertiary',
        variant === 'wide' ? 'w-28 h-28 flex-shrink-0' : 'w-full h-40'
      )}>
        <img
          src={imageUrl || placeholderImg}
          alt={tenant.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(tenant.id); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart
            className={cn('w-4 h-4', fav ? 'fill-error text-error' : 'text-text-secondary')}
          />
        </button>
        {/* Delivery time badge */}
        <div className="absolute bottom-2 left-2 bg-white/95 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-text-secondary" />
          <span className="text-xs font-bold text-text-primary">
            {formatDeliveryTime(deliveryTime)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className={cn('p-3', variant === 'wide' && 'flex-1 py-2')}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-text-primary text-sm leading-tight line-clamp-1">
            {tenant.name_en || tenant.name}
          </h3>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-xs font-bold text-text-primary">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
          {restaurant.cuisineType || tenant.description_en || tenant.description || 'Restaurant'}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1 text-text-secondary">
            <Bike className="w-3 h-3" />
            <span className="text-xs">{formatPrice(deliveryFee)}</span>
          </div>
          <span className="text-text-tertiary text-xs">|</span>
          <span className="text-xs text-text-secondary">{formatDistance(distance)}</span>
        </div>
      </div>
    </button>
  );
}
