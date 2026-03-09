import { Star, Clock, Bike, MapPin, Info } from 'lucide-react';
import { formatPrice, formatDeliveryTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RestaurantHeaderProps {
  name: string;
  description?: string;
  coverImage?: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  distance: string;
  cuisineType?: string;
  isOpen?: boolean;
}

export function RestaurantHeader({
  name, description, coverImage, rating, deliveryTime, deliveryFee, distance, cuisineType, isOpen = true
}: RestaurantHeaderProps) {
  const placeholderImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop';

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-48 sm:h-56 bg-muted">
        <img
          src={coverImage || placeholderImg}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Restaurant info */}
      <div className="glass-card px-4 pt-4 pb-3 -mt-6 relative rounded-t-3xl">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white">{name}</h1>
            {description && (
              <p className="text-sm text-white/60 mt-1 line-clamp-2">{description}</p>
            )}
          </div>
          {!isOpen && <Badge variant="error">Closed</Badge>}
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-background rounded-lg px-2.5 py-1.5">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 bg-background rounded-lg px-2.5 py-1.5">
            <Clock className="w-3.5 h-3.5 text-white/60" />
            <span className="text-xs font-semibold text-white">{formatDeliveryTime(deliveryTime)}</span>
          </div>
          <div className="flex items-center gap-1 bg-background rounded-lg px-2.5 py-1.5">
            <Bike className="w-3.5 h-3.5 text-white/60" />
            <span className="text-xs font-semibold text-white">{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex items-center gap-1 bg-background rounded-lg px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-white/60" />
            <span className="text-xs font-semibold text-white">{distance}</span>
          </div>
          {cuisineType && (
            <div className="flex items-center gap-1 bg-background rounded-lg px-2.5 py-1.5">
              <Info className="w-3.5 h-3.5 text-white/60" />
              <span className="text-xs font-semibold text-white">{cuisineType}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
