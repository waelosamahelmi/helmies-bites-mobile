import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { BackHeader } from '@/components/layout/BackHeader';
import { RestaurantHeader } from '@/components/restaurant/RestaurantHeader';
import { MenuSection } from '@/components/restaurant/MenuSection';
import { MenuItemModal } from '@/components/restaurant/MenuItemModal';
import { MenuItemSkeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';
import { cn, formatDistance } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useRestaurants } from '@/hooks/useRestaurants';
import { getCategories, getMenuItems, type MenuItem, type Category } from '@/lib/api';

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const { restaurants } = useRestaurants();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const tabsRef = useRef<HTMLDivElement>(null);

  const restaurant = useMemo(() =>
    restaurants.find(r => r.tenant.slug === slug),
    [restaurants, slug]
  );

  useEffect(() => {
    if (!restaurant) return;

    async function loadMenu() {
      try {
        setLoading(true);
        const [cats, items] = await Promise.all([
          getCategories(restaurant!.tenant.id),
          getMenuItems(restaurant!.tenant.id),
        ]);
        setCategories(cats.filter(c => c.is_active));
        setMenuItems(items.filter(i => i.is_available));
        if (cats.length > 0) setActiveSection(cats[0].id);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [restaurant]);

  const menuByCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const cat of categories) {
      map.set(cat.id, menuItems.filter(item => item.category_id === cat.id));
    }
    return map;
  }, [categories, menuItems]);

  const scrollToSection = (catId: string) => {
    setActiveSection(catId);
    const el = document.getElementById(`section-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!restaurant && !loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <p className="text-text-secondary">Restaurant not found</p>
      </div>
    );
  }

  const fav = restaurant ? isFavorite(restaurant.tenant.id) : false;

  return (
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader
        transparent
        rightAction={
          restaurant && (
            <button
              onClick={() => toggleFavorite(restaurant.tenant.id)}
              className="w-10 h-10 rounded-full bg-white/90 shadow-card flex items-center justify-center"
            >
              <Heart className={cn('w-5 h-5', fav ? 'fill-error text-error' : 'text-text-secondary')} />
            </button>
          )
        }
      />

      {restaurant && (
        <RestaurantHeader
          name={restaurant.tenant.name_en || restaurant.tenant.name}
          description={restaurant.tenant.description_en || restaurant.tenant.description}
          coverImage={restaurant.imageUrl}
          rating={restaurant.rating}
          deliveryTime={restaurant.deliveryTime}
          deliveryFee={restaurant.deliveryFee}
          distance={formatDistance(restaurant.distance)}
          cuisineType={restaurant.cuisineType}
        />
      )}

      {/* Category tabs - sticky */}
      {categories.length > 0 && (
        <div ref={tabsRef} className="sticky top-0 z-20 bg-white border-b border-border">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex px-4 gap-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className={cn(
                    'px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors',
                    activeSection === cat.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  )}
                >
                  {cat.name_en || cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu sections */}
      {loading ? (
        <div className="bg-white mt-2">
          {Array.from({ length: 5 }).map((_, i) => <MenuItemSkeleton key={i} />)}
        </div>
      ) : (
        categories.map(cat => (
          <div key={cat.id} id={`section-${cat.id}`}>
            <MenuSection
              category={cat}
              items={menuByCategory.get(cat.id) || []}
              onItemClick={setSelectedItem}
            />
          </div>
        ))
      )}

      <div className="h-32" />

      {/* Item detail modal */}
      <MenuItemModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
