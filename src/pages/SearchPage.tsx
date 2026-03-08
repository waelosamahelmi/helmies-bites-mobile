import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCardSkeleton } from '@/components/ui/skeleton';
import { FilterSheet, type SearchFilters } from '@/components/search/FilterSheet';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';

export default function SearchPage() {
  const { restaurants, loading } = useRestaurants();
  const { searches, addSearch, removeSearch, clearAll } = useRecentSearches();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'delivery'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dietary: [], priceRange: null, maxDeliveryTime: null, minRating: null, freeDelivery: false,
  });

  const activeFilterCount = filters.dietary.length +
    (filters.maxDeliveryTime ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.freeDelivery ? 1 : 0);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) addSearch(q.trim());
  };

  const filtered = useMemo(() => {
    let list = restaurants;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        (r.tenant.name_en || r.tenant.name).toLowerCase().includes(q) ||
        r.cuisineType?.toLowerCase().includes(q) ||
        r.tenant.description?.toLowerCase().includes(q)
      );
    }
    if (filters.maxDeliveryTime) list = list.filter(r => r.deliveryTime <= filters.maxDeliveryTime!);
    if (filters.minRating) list = list.filter(r => r.rating >= filters.minRating!);
    if (filters.freeDelivery) list = list.filter(r => r.deliveryFee === 0);

    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTime - b.deliveryTime;
      return a.distance - b.distance;
    });
  }, [restaurants, query, sortBy, filters]);

  const suggestions = ['Pizza', 'Sushi', 'Burger', 'Kebab', 'Healthy', 'Thai', 'Indian', 'Mexican'];

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 safe-top px-4 pb-3 pt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search restaurants or cuisines..."
                className="w-full h-12 rounded-xl bg-surface-secondary dark:bg-gray-800 pl-10 pr-10 text-sm text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className="relative w-12 h-12 rounded-xl bg-surface-secondary dark:bg-gray-800 flex items-center justify-center"
            >
              <SlidersHorizontal className="w-5 h-5 text-text-secondary dark:text-gray-400" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>
          <div className="flex gap-2 mt-3">
            {([
              { value: 'distance' as const, label: 'Nearby' },
              { value: 'rating' as const, label: 'Top rated' },
              { value: 'delivery' as const, label: 'Fastest' },
            ]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  sortBy === opt.value
                    ? 'bg-text-primary dark:bg-white text-white dark:text-gray-900'
                    : 'bg-surface-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 pb-20">
          {!query && !loading && (
            <>
              {searches.length > 0 && (
                <FadeIn>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-text-tertiary" />
                        <span className="text-xs font-bold text-text-secondary dark:text-gray-400">Recent</span>
                      </div>
                      <button onClick={clearAll} className="text-xs text-primary font-semibold">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searches.map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 text-xs font-medium text-text-primary dark:text-white shadow-sm"
                        >
                          <Clock className="w-3 h-3 text-text-tertiary" />
                          {s}
                          <span onClick={(e) => { e.stopPropagation(); removeSearch(s); }} className="ml-0.5">
                            <X className="w-3 h-3 text-text-tertiary" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
              <FadeIn delay={0.1}>
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-text-secondary dark:text-gray-400">Popular searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                      <button key={s} onClick={() => setQuery(s)}
                        className="px-3 py-1.5 rounded-full bg-primary/5 dark:bg-primary/10 text-xs font-semibold text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
            </div>
          ) : query && filtered.length > 0 ? (
            <>
              <p className="text-xs text-text-secondary dark:text-gray-400 mb-3">{filtered.length} restaurants found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((r) => <RestaurantCard key={r.tenant.id + r.branch.id} restaurant={r} />)}
              </div>
            </>
          ) : query ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-base font-bold text-text-primary dark:text-white mb-1">No results</h3>
              <p className="text-sm text-text-secondary dark:text-gray-400">Try a different search term or adjust filters</p>
            </div>
          ) : null}
        </div>

        <FilterSheet open={showFilters} onClose={() => setShowFilters(false)} filters={filters} onApply={setFilters} />
      </div>
    </PageTransition>
  );
}
