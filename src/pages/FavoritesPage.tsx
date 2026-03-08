import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { restaurants } = useRestaurants();

  const favRestaurants = useMemo(() =>
    restaurants.filter(r => favorites.includes(r.tenant.id)),
    [restaurants, favorites]
  );

  return (
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader title="Favorites" />

      {favRestaurants.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-10 h-10" />}
          title="No favorites yet"
          description="Tap the heart on a restaurant to save it here"
          action={<Button onClick={() => navigate('/')}>Browse restaurants</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pb-20">
          {favRestaurants.map((r) => (
            <RestaurantCard key={r.tenant.id + r.branch.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}