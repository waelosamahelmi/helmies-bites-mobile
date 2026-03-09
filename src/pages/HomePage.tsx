import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Bell, Sparkles, Clock, Star, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { SectionHeader } from '@/components/menu/SectionHeader';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useMenu } from '@/hooks/useMenu';
import { useLocation } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const { city } = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { restaurants, loading: restaurantsLoading, refetch } = useRestaurants();
  const { menuItems, categories, loading: menuLoading } = useMenu();

  const filteredItems = useMemo(() => {
    if (!activeCategory) return menuItems;
    return menuItems.filter((item) => item.category_id === activeCategory);
  }, [menuItems, activeCategory]);

  const popularItems = useMemo(
    () => menuItems.filter((item) => item.is_popular).slice(0, 8),
    [menuItems]
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loading = restaurantsLoading || menuLoading;

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary">
        {/* Custom header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white max-w-lg mx-auto">
          {/* Location bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <button
              onClick={() => navigate('/address')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-secondary">Deliver to</p>
                <p className="text-sm font-semibold text-text-primary flex items-center gap-1">
                  {city || 'Select location'}
                  <ChevronRight className="w-4 h-4" />
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/search')}
                className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-text-secondary" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/notifications')}
                className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center relative"
              >
                <Bell className="w-5 h-5 text-text-secondary" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
              </motion.button>
            </div>
          </div>

          {/* Brand title */}
          <div className="px-4 py-2 bg-white">
            <h1 className="text-xl font-bold text-text-primary tracking-tight uppercase">
              Helmies Bites
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="pt-28">
          <PullToRefresh onRefresh={handleRefresh}>
            {/* Category tabs */}
            <div className="bg-white sticky top-28 z-40">
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>

            {/* Promo banner */}
            <FadeIn delay={0.1}>
              <div className="px-4 py-4">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-600 p-5"
                >
                  <div className="relative z-10">
                    <p className="text-white/80 text-sm mb-1">Today's Special</p>
                    <h2 className="text-white text-xl font-bold mb-2">
                      Get 20% OFF
                    </h2>
                    <p className="text-white/80 text-sm mb-3">
                      Use code <span className="font-bold text-white">HELMIES20</span>
                    </p>
                    <button className="px-4 py-2 bg-white rounded-lg text-primary font-semibold text-sm">
                      Order Now
                    </button>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                  <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full" />
                </motion.div>
              </div>
            </FadeIn>

            {/* Popular items */}
            {popularItems.length > 0 && (
              <FadeIn delay={0.2}>
                <SectionHeader
                  title="Popular Dishes"
                  subtitle="Most ordered this week"
                  linkTo="/shop/popular"
                />
                <div className="overflow-x-auto hide-scrollbar">
                  <div className="flex gap-3 px-4 pb-4">
                    {popularItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        variant="vertical"
                      />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Recommended / All items */}
            <FadeIn delay={0.3}>
              <SectionHeader
                title={activeCategory ? 'Category Items' : 'Recommended for You'}
                subtitle={`${filteredItems.length} dishes available`}
              />
              <div className="px-4 pb-8 space-y-3">
                {loading ? (
                  // Skeleton loaders
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-white rounded-xl animate-pulse"
                    >
                      <div className="w-24 h-24 rounded-lg bg-surface-tertiary" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-surface-tertiary rounded" />
                        <div className="h-3 w-full bg-surface-tertiary rounded" />
                        <div className="h-3 w-1/2 bg-surface-tertiary rounded" />
                      </div>
                    </div>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} variant="horizontal" />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-text-secondary">No dishes available</p>
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
