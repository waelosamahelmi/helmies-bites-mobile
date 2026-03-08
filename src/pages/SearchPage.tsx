import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCardSkeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const { restaurants, loading } = useRestaurants();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'delivery'>('distance');

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
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTime - b.deliveryTime;
      return a.distance - b.distance;
    });
  }, [restaurants, query, sortBy]);

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Search header */}
      <div className="bg-white safe-top px-4 pb-3 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants or cuisines..."
            className="w-full h-12 rounded-xl bg-surface-secondary pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-text-tertiary" />
            </button>
          )}
        </div>

        {/* Sort options */}
        <div className="flex gap-2 mt-3">
          {[
            { value: 'distance' as const, label: 'Nearby' },
            { value: 'rating' as const, label: 'Top rated' },
            { value: 'delivery' as const, label: 'Fastest' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === opt.value
                  ? 'bg-text-primary text-white'
                  : 'bg-surface-secondary text-text-secondary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-xs text-text-secondary mb-3">{filtered.length} restaurants found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((r) => (
                <RestaurantCard key={r.tenant.id + r.branch.id} restaurant={r} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-base font-bold text-text-primary mb-1">No results</h3>
            <p className="text-sm text-text-secondary">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}