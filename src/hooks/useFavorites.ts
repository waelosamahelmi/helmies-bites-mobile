import { useState, useCallback, useEffect } from 'react';

const FAVORITES_KEY = 'helmies_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((restaurantId: string) => {
    setFavorites(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  }, []);

  const isFavorite = useCallback((restaurantId: string) => {
    return favorites.includes(restaurantId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
