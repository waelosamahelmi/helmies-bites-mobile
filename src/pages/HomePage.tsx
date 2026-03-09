import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Bell, Sparkles, Clock, Star, ChevronRight, Flame } from 'lucide-react';
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
            {/* Promo banner - comes first, before sticky tabs */}
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

            {/* Category tabs - sticky after promo */}
            <div className="bg-background sticky top-[88px] z-40 border-b border-white/5">
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>

            {/* Popular items */}
            {popularItems.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="flex items-center justify-between px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white">Popular Dishes</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/shop/popular')}
                    className="text-sm font-semibold text-primary flex items-center gap-1"
                  >
                    See all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
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
              <div className="flex items-center justify-between px-4 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {activeCategory ? 'Category Items' : 'Recommended for You'}
                  </h2>
                  <p className="text-sm text-white/50">{filteredItems.length} dishes available</p>
                </div>
              </div>
              <div className="px-4 pb-8 space-y-3">
                {loading ? (
                  // Skeleton loaders
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="glass-card rounded-2xl p-4 flex gap-4 animate-pulse"
                    >
                      <div className="w-28 h-28 rounded-xl skeleton" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 w-3/4 skeleton rounded" />
                        <div className="h-3 w-full skeleton rounded" />
                        <div className="h-3 w-1/2 skeleton rounded" />
                        <div className="h-5 w-20 skeleton rounded" />
                      </div>
                    </div>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      variant="horizontal"
                    />
                  ))
                ) : (
                  <div className="text-center py-12 glass-card rounded-2xl">
                    <p className="text-white/50">No dishes available</p>
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
