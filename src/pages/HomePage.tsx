import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Bell, Sparkles, Clock, Star, ChevronRight, Flame, Store, TrendingUp } from 'lucide-react';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useLocation } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const { city } = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const { restaurants, loading, refetch } = useRestaurants();

  // Filter options
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'nearest', label: 'Nearest' },
    { id: 'fastest', label: 'Fastest' },
    { id: 'rating', label: 'Top Rated' },
  ];

  // Apply filters
  const filteredRestaurants = useMemo(() => {
    let sorted = [...restaurants];
    
    switch (activeFilter) {
      case 'nearest':
        sorted.sort((a, b) => a.distance - b.distance);
        break;
      case 'fastest':
        sorted.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default: nearest first
        sorted.sort((a, b) => a.distance - b.distance);
    }
    
    return sorted;
  }, [restaurants, activeFilter]);

  // Featured restaurants (top rated)
  const featuredRestaurants = useMemo(() => {
    return [...restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [restaurants]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Custom header */}
        <header className="fixed top-0 left-0 right-0 z-50 max-w-lg mx-auto bg-background/80 backdrop-blur-xl border-b border-white/5">
          {/* Location bar */}
          <div className="flex items-center justify-between px-4 py-3 pt-safe-top">
            <button
              onClick={() => navigate('/address')}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white/50">Deliver to</p>
                <p className="text-sm font-bold text-white flex items-center gap-1">
                  {city || 'Select location'}
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/search')}
                className="w-10 h-10 glass-button rounded-xl flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-white/70" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/notifications')}
                className="w-10 h-10 glass-button rounded-xl flex items-center justify-center relative"
              >
                <Bell className="w-5 h-5 text-white/70" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full shadow-glow" />
              </motion.button>
            </div>
          </div>

          {/* Brand title */}
          <div className="px-4 pb-3">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="gradient-text">HELMIES</span>
              <span className="text-white"> BITES</span>
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="pt-32">
          <PullToRefresh onRefresh={handleRefresh}>
            {/* Promo banner */}
            <FadeIn delay={0.1}>
              <div className="px-4 pt-4 pb-2">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-amber-500 to-primary p-5"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-dark" />
                      <p className="text-dark/80 text-sm font-semibold">Today's Special</p>
                    </div>
                    <h2 className="text-dark text-2xl font-extrabold mb-2">
                      Get 20% OFF
                    </h2>
                    <p className="text-dark/70 text-sm mb-3">
                      Use code <span className="font-bold text-dark bg-white/30 px-2 py-0.5 rounded-md">HELMIES20</span>
                    </p>
                    <button className="px-5 py-2.5 bg-dark rounded-xl text-primary font-bold text-sm shadow-lg">
                      Order Now
                    </button>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full" />
                  <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/20 rounded-full" />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 text-6xl opacity-30">
                    🍔
                  </div>
                </motion.div>
              </div>
            </FadeIn>

            {/* Filter tabs */}
            <div className="px-4 py-3">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {filters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(filter.id)}
                    className={cn(
                      'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                      activeFilter === filter.id
                        ? 'bg-gradient-to-r from-primary to-amber-500 text-dark shadow-glow'
                        : 'glass-button text-white/70'
                    )}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Featured restaurants */}
            {featuredRestaurants.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="flex items-center justify-between px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white">Featured</h2>
                  </div>
                  <button className="text-sm font-semibold text-primary flex items-center gap-1">
                    See all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto hide-scrollbar">
                  <div className="flex gap-3 px-4 pb-4">
                    {featuredRestaurants.map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.tenant.id}
                        restaurant={restaurant}
                        variant="vertical"
                      />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* All restaurants */}
            <FadeIn delay={0.3}>
              <div className="flex items-center justify-between px-4 mb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-white">
                    Restaurants Near You
                  </h2>
                </div>
                <span className="text-sm text-white/50">{filteredRestaurants.length} places</span>
              </div>
              <div className="px-4 pb-8 space-y-4">
                {loading ? (
                  // Skeleton loaders
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="glass-card rounded-2xl overflow-hidden animate-pulse"
                    >
                      <div className="h-[140px] skeleton" />
                      <div className="p-4 space-y-2">
                        <div className="h-5 w-2/3 skeleton rounded" />
                        <div className="h-4 w-1/2 skeleton rounded" />
                      </div>
                    </div>
                  ))
                ) : filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.tenant.id}
                      restaurant={restaurant}
                      variant="horizontal"
                    />
                  ))
                ) : (
                  <div className="text-center py-12 glass-card rounded-2xl">
                    <Store className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50">No restaurants in your area</p>
                    <p className="text-sm text-white/30 mt-1">Try selecting a different location</p>
                  </div>
                )}
              </div>
            </FadeIn>
          </PullToRefresh>
        </div>
      </div>
    </PageTransition>
  );
}
