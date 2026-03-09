import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Restaurant } from '@/hooks/useRestaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function RestaurantCard({ 
  restaurant, 
  variant = 'horizontal',
  className 
}: RestaurantCardProps) {
  const navigate = useNavigate();
  
  const { tenant, branch, distance, deliveryTime, deliveryFee, rating, imageUrl, cuisineType } = restaurant;
  const name = tenant.name_en || tenant.name;
  const distanceKm = (distance / 1000).toFixed(1);

  const handlePress = () => {
    navigate(`/restaurant/${tenant.slug}`, { state: { restaurant } });
  };

  if (variant === 'vertical') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handlePress}
        className={cn(
          'glass-card rounded-2xl overflow-hidden w-[200px] flex-shrink-0 text-left card-hover',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-[120px] bg-dark-card">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-dark">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-dark/80 backdrop-blur-sm rounded-lg">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-base text-white line-clamp-1">{name}</h3>
          {cuisineType && (
            <p className="text-xs text-white/50 mt-0.5">{cuisineType}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-white/60">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              <span className="text-xs">€{deliveryFee.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.button>
    );
  }

  // Default horizontal variant
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={handlePress}
      className={cn(
        'glass-card rounded-2xl overflow-hidden w-full text-left card-hover',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-[140px] bg-dark-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-dark">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-dark/80 backdrop-blur-sm rounded-lg">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
        </div>

        {/* Delivery info on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/90 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-dark" />
              <span className="text-xs font-bold text-dark">{deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
              <Bike className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">€{deliveryFee.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">{distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white line-clamp-1">{name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {cuisineType && (
            <span className="text-sm text-white/50">{cuisineType}</span>
          )}
          <span className="text-white/30">•</span>
          <span className="text-sm text-white/50">{branch.city}</span>
        </div>
      </div>
    </motion.button>
  );
}
