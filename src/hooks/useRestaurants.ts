import { useState, useEffect, useCallback } from 'react';
import { getActiveTenants, getBranches, type Tenant, type Branch } from '@/lib/api';
import { calculateDistance } from '@/lib/utils';
import { useLocation } from '@/contexts/LocationContext';

export interface Restaurant {
  tenant: Tenant;
  branch: Branch;
  distance: number;
  deliveryTime: number;
  deliveryFee: number;
  rating: number;
  imageUrl?: string;
  cuisineType?: string;
}

export function useRestaurants() {
  const { latitude, longitude } = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(async () => {
    setRefreshKey(k => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchRestaurants() {
      try {
        setLoading(true);
        setError(null);

        const tenants = await getActiveTenants();
        const restaurantList: Restaurant[] = [];

        for (const tenant of tenants) {
          try {
            const branches = await getBranches(tenant.id);
            for (const branch of branches) {
              if (!branch.is_active || !branch.latitude || !branch.longitude) continue;

              const distance = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);
              const deliveryTime = Math.max(20, Math.round(distance / 500) + 15);
              const deliveryFee = distance < 2000 ? 2.90 : distance < 5000 ? 3.90 : 4.90;

              restaurantList.push({
                tenant,
                branch,
                distance,
                deliveryTime,
                deliveryFee,
                rating: 4.0 + Math.random() * 1,
                imageUrl: (tenant.metadata as any)?.cover_image_url,
                cuisineType: (tenant.metadata as any)?.cuisine_type,
              });
            }
          } catch {
            // Skip tenants with no branches
          }
        }

        if (!cancelled) {
          restaurantList.sort((a, b) => a.distance - b.distance);
          setRestaurants(restaurantList);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRestaurants();
    return () => { cancelled = true; };
  }, [latitude, longitude, refreshKey]);

  return { restaurants, loading, error, refetch };
}
