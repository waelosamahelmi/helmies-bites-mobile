import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryScroller } from '@/components/home/CategoryScroller';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { PromoBanner } from '@/components/home/PromoBanner';
import { SectionHeader } from '@/components/home/SectionHeader';
import { RestaurantCardSkeleton } from '@/components/ui/skeleton';
import { useRestaurants } from '@/hooks/useRestaurants';
import { MapPin } from 'lucide-react';

export default function DiscoveryPage() {
  const { restaurants, loading } = useRestaurants();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredRestaurants = useMemo(() => {
    if (activeCategory === 'all') return restaurants;
    return restaurants.filter(r =>
      r.cuisineType?.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }, [restaurants, activeCategory]);

  const popularRestaurants = useMemo(() =>
    [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [restaurants]
  );

  const nearbyRestaurants = useMemo(() =>
    [...restaurants].sort((a, b) => a.distance - b.distance).slice(0, 10),
    [restaurants]
  );

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Header />

      {/* Category filter */}
      <div className="bg-white">
        <CategoryScroller activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {/* Promo banner */}
      <div className="pt-4">
        <PromoBanner />
      </div>

      {/* Popular nearby */}
      {!loading && popularRestaurants.length > 0 && (
        <>
          <SectionHeader title="Popular near you" subtitle="Most ordered restaurants" />
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-3 px-4 pb-2">
              {popularRestaurants.map((r) => (
                <div key={r.tenant.id + r.branch.id} className="w-64 flex-shrink-0">
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* All restaurants */}
      <SectionHeader
        title={activeCategory === 'all' ? 'All restaurants' : `${activeCategory} restaurants`}
        subtitle={`${filteredRestaurants.length} restaurants near you`}
      />

      <div className="px-4 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r.tenant.id + r.branch.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-text-tertiary" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">No restaurants found</h3>
            <p className="text-sm text-text-secondary">Try selecting a different category or changing your location</p>
          </div>
        )}
      </div>
    </div>
  );
}
