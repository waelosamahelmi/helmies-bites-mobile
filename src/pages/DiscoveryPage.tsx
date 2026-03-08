import { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryScroller } from '@/components/home/CategoryScroller';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { PromoBanner } from '@/components/home/PromoBanner';
import { SectionHeader } from '@/components/home/SectionHeader';
import { StoriesCarousel } from '@/components/home/StoriesCarousel';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { QuickReorder } from '@/components/home/QuickReorder';
import { RestaurantCardSkeleton } from '@/components/ui/skeleton';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { OfflineBanner } from '@/components/ui/offline-banner';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useRestaurants } from '@/hooks/useRestaurants';
import { MapPin, Sparkles } from 'lucide-react';

export default function DiscoveryPage() {
  const { restaurants, loading, refetch } = useRestaurants();
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
    [...restaurants].sort((a, b) => a.distance - b.distance).slice(0, 6),
    [restaurants]
  );

  const fastDelivery = useMemo(() =>
    [...restaurants].filter(r => r.deliveryTime <= 30).sort((a, b) => a.deliveryTime - b.deliveryTime).slice(0, 6),
    [restaurants]
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        <OfflineBanner />
        <Header />

        <PullToRefresh onRefresh={handleRefresh}>
          {/* Stories */}
          {!loading && restaurants.length > 0 && (
            <FadeIn>
              <StoriesCarousel restaurants={restaurants} />
            </FadeIn>
          )}

          {/* Category filter */}
          <div className="bg-white dark:bg-gray-900">
            <CategoryScroller activeCategory={activeCategory} onSelect={setActiveCategory} />
          </div>

          {/* Featured collections */}
          {!loading && restaurants.length > 0 && (
            <FadeIn delay={0.1}>
              <div className="pt-4">
                <div className="flex items-center gap-2 px-4 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary dark:text-white">Explore</h3>
                </div>
                <FeaturedCollections restaurants={restaurants} />
              </div>
            </FadeIn>
          )}

          {/* Quick reorder */}
          <FadeIn delay={0.15}>
            <div className="pt-2">
              <QuickReorder />
            </div>
          </FadeIn>

          {/* Promo banner */}
          <FadeIn delay={0.2}>
            <div className="pt-2">
              <PromoBanner />
            </div>
          </FadeIn>

          {/* Fast delivery */}
          {!loading && fastDelivery.length > 0 && (
            <FadeIn delay={0.25}>
              <SectionHeader title="Lightning fast" subtitle="Under 30 min delivery" />
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-3 px-4 pb-2">
                  {fastDelivery.map((r) => (
                    <div key={r.tenant.id + r.branch.id} className="w-64 flex-shrink-0">
                      <RestaurantCard restaurant={r} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Popular */}
          {!loading && popularRestaurants.length > 0 && (
            <FadeIn delay={0.3}>
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
            </FadeIn>
          )}

          {/* Nearby */}
          {!loading && nearbyRestaurants.length > 0 && (
            <FadeIn delay={0.35}>
              <SectionHeader title="Closest to you" subtitle="Nearby restaurants" />
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-3 px-4 pb-2">
                  {nearbyRestaurants.map((r) => (
                    <div key={r.tenant.id + r.branch.id} className="w-64 flex-shrink-0">
                      <RestaurantCard restaurant={r} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* All restaurants */}
          <FadeIn delay={0.4}>
            <SectionHeader
              title={activeCategory === 'all' ? 'All restaurants' : `${activeCategory} restaurants`}
              subtitle={`${filteredRestaurants.length} restaurants near you`}
            />
            <div className="px-4 pb-8">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
                </div>
              ) : filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredRestaurants.map((r) => (
                    <RestaurantCard key={r.tenant.id + r.branch.id} restaurant={r} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto rounded-full bg-surface-tertiary dark:bg-gray-800 flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-text-tertiary" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary dark:text-white mb-1">No restaurants found</h3>
                  <p className="text-sm text-text-secondary dark:text-gray-400">Try a different category or location</p>
                </div>
              )}
            </div>
          </FadeIn>
        </PullToRefresh>
      </div>
    </PageTransition>
  );
}
