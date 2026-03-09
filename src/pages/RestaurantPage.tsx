import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { BackHeader } from '@/components/layout/BackHeader';
import { RestaurantHeader } from '@/components/restaurant/RestaurantHeader';
import { MenuSection } from '@/components/restaurant/MenuSection';
import { MenuItemModal } from '@/components/restaurant/MenuItemModal';
import { RestaurantInfoSheet } from '@/components/restaurant/RestaurantInfoSheet';
import { PhotoGallery } from '@/components/restaurant/PhotoGallery';
import { ReviewCard, type Review } from '@/components/restaurant/ReviewCard';
import { MenuItemSkeleton } from '@/components/ui/skeleton';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { Heart, Info, Camera, Star } from 'lucide-react';
import { cn, formatDistance } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useHaptics } from '@/hooks/useHaptics';
import { getCategories, getMenuItems, type MenuItem, type Category } from '@/lib/api';

// Demo reviews
const demoReviews: Review[] = [
  { id: '1', userName: 'John D.', rating: 5, comment: 'Amazing food and super fast delivery! The pizza was still hot when it arrived.', date: '2026-03-01', reply: 'Thank you John! We appreciate your feedback.' },
  { id: '2', userName: 'Maria K.', rating: 4, comment: 'Really good food. The burger was delicious. Would order again!', date: '2026-02-28' },
  { id: '3', userName: 'Ahmed S.', rating: 5, comment: 'Best kebab in Helsinki. Highly recommend the chicken shawarma.', date: '2026-02-25' },
];

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const { restaurants } = useRestaurants();
  const { isFavorite, toggleFavorite } = useFavorites();
  const haptics = useHaptics();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/60">Restaurant not found</p>
      </div>
    );
  }

  const fav = restaurant ? isFavorite(restaurant.tenant.id) : false;

  // Demo gallery images
  const galleryPhotos = [
    restaurant?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <BackHeader
          transparent
          rightAction={
            restaurant && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInfo(true)}
                  className="w-10 h-10 rounded-full bg-white/90 shadow-glass flex items-center justify-center"
                >
                  <Info className="w-5 h-5 text-white/60" />
                </button>
                <button
                  onClick={() => setShowGallery(true)}
                  className="w-10 h-10 rounded-full bg-white/90 shadow-glass flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 text-white/60" />
                </button>
                <button
                  onClick={() => { toggleFavorite(restaurant.tenant.id); haptics.impact('medium'); }}
                  className="w-10 h-10 rounded-full bg-white/90 shadow-glass flex items-center justify-center"
                >
                  <Heart className={cn('w-5 h-5', fav ? 'fill-error text-red-400' : 'text-white/60')} />
                </button>
              </div>
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
          <div ref={tabsRef} className="sticky top-0 z-20 glass-card border-b border-white/10">
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
                        : 'border-transparent text-white/60 hover:text-white'
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
          <div className="glass-card mt-2">
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

        {/* Reviews section */}
        {!loading && (
          <FadeIn delay={0.2}>
            <div className="px-4 mt-6 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <h3 className="text-sm font-bold text-white">Reviews</h3>
                <span className="text-xs text-white/40">({demoReviews.length})</span>
              </div>
              <div className="space-y-3">
                {demoReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        <div className="h-32" />

        {/* Modals */}
        <MenuItemModal item={selectedItem} open={!!selectedItem} onClose={() => setSelectedItem(null)} />
        <RestaurantInfoSheet restaurant={restaurant || null} open={showInfo} onClose={() => setShowInfo(false)} />
        <PhotoGallery photos={galleryPhotos} open={showGallery} onClose={() => setShowGallery(false)} />
      </div>
    </PageTransition>
  );
}
