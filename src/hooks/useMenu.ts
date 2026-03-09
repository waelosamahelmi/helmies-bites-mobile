import { useState, useEffect, useCallback } from 'react';
import { getMenuItems, getCategories, type MenuItem, type Category } from '@/lib/api';

// Default tenant ID for demo purposes
const DEFAULT_TENANT_ID = import.meta.env.VITE_DEFAULT_TENANT_ID || '';

export function useMenu(tenantId: string = DEFAULT_TENANT_ID) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(async () => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [items, cats] = await Promise.all([
          getMenuItems(tenantId),
          getCategories(tenantId),
        ]);

        if (!cancelled) {
          // Filter only available items
          const availableItems = items.filter((item) => item.is_available);
          setMenuItems(availableItems);

          // Filter active categories
          const activeCategories = cats.filter((cat) => cat.is_active);
          setCategories(activeCategories);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message);
          // Set demo data if API fails
          setMenuItems(getDemoMenuItems());
          setCategories(getDemoCategories());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [tenantId, refreshKey]);

  return { menuItems, categories, loading, error, refetch };
}

// Demo data fallback
function getDemoCategories(): Category[] {
  return [
    { id: 'cat-1', tenant_id: 'demo', name: 'Burgers', name_en: 'Burgers', sort_order: 1, is_active: true },
    { id: 'cat-2', tenant_id: 'demo', name: 'Pizza', name_en: 'Pizza', sort_order: 2, is_active: true },
    { id: 'cat-3', tenant_id: 'demo', name: 'Salads', name_en: 'Salads', sort_order: 3, is_active: true },
    { id: 'cat-4', tenant_id: 'demo', name: 'Drinks', name_en: 'Drinks', sort_order: 4, is_active: true },
    { id: 'cat-5', tenant_id: 'demo', name: 'Desserts', name_en: 'Desserts', sort_order: 5, is_active: true },
  ];
}

function getDemoMenuItems(): MenuItem[] {
  return [
    {
      id: 'item-1',
      tenant_id: 'demo',
      category_id: 'cat-1',
      name: 'Classic Burger',
      name_en: 'Classic Burger',
      description: 'Juicy beef patty with fresh vegetables, special sauce, and toasted brioche bun',
      price: 12.90,
      currency: 'EUR',
      is_available: true,
      is_popular: true,
      allergens: ['Gluten', 'Dairy'],
      dietary_restrictions: [],
      preparation_time_minutes: 15,
      ingredients: ['Beef', 'Lettuce', 'Tomato', 'Onion', 'Cheese', 'Brioche Bun'],
      tags: ['bestseller'],
    },
    {
      id: 'item-2',
      tenant_id: 'demo',
      category_id: 'cat-1',
      name: 'Chicken Deluxe',
      name_en: 'Chicken Deluxe',
      description: 'Crispy fried chicken with coleslaw and honey mustard sauce',
      price: 11.50,
      currency: 'EUR',
      is_available: true,
      is_popular: true,
      allergens: ['Gluten'],
      dietary_restrictions: [],
      preparation_time_minutes: 12,
      ingredients: ['Chicken', 'Coleslaw', 'Honey Mustard', 'Lettuce'],
      tags: [],
    },
    {
      id: 'item-3',
      tenant_id: 'demo',
      category_id: 'cat-2',
      name: 'Margherita Pizza',
      name_en: 'Margherita Pizza',
      description: 'Traditional Italian pizza with fresh mozzarella, tomatoes, and basil',
      price: 14.90,
      currency: 'EUR',
      is_available: true,
      is_popular: true,
      allergens: ['Gluten', 'Dairy'],
      dietary_restrictions: ['Vegetarian'],
      preparation_time_minutes: 20,
      ingredients: ['Mozzarella', 'Tomato Sauce', 'Basil', 'Olive Oil'],
      tags: ['vegetarian'],
    },
    {
      id: 'item-4',
      tenant_id: 'demo',
      category_id: 'cat-2',
      name: 'Pepperoni Pizza',
      name_en: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella cheese on crispy crust',
      price: 15.90,
      currency: 'EUR',
      is_available: true,
      is_popular: false,
      allergens: ['Gluten', 'Dairy'],
      dietary_restrictions: [],
      preparation_time_minutes: 20,
      ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce'],
      tags: [],
    },
    {
      id: 'item-5',
      tenant_id: 'demo',
      category_id: 'cat-3',
      name: 'Caesar Salad',
      name_en: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing, parmesan, and croutons',
      price: 9.90,
      currency: 'EUR',
      is_available: true,
      is_popular: false,
      allergens: ['Gluten', 'Dairy', 'Egg'],
      dietary_restrictions: ['Vegetarian'],
      preparation_time_minutes: 8,
      ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing'],
      tags: ['healthy'],
    },
    {
      id: 'item-6',
      tenant_id: 'demo',
      category_id: 'cat-4',
      name: 'Fresh Lemonade',
      name_en: 'Fresh Lemonade',
      description: 'Refreshing homemade lemonade with mint',
      price: 4.50,
      currency: 'EUR',
      is_available: true,
      is_popular: true,
      allergens: [],
      dietary_restrictions: ['Vegan'],
      preparation_time_minutes: 3,
      ingredients: ['Lemon', 'Mint', 'Sugar', 'Water'],
      tags: ['refreshing'],
    },
    {
      id: 'item-7',
      tenant_id: 'demo',
      category_id: 'cat-5',
      name: 'Chocolate Brownie',
      name_en: 'Chocolate Brownie',
      description: 'Rich chocolate brownie with vanilla ice cream',
      price: 6.90,
      currency: 'EUR',
      is_available: true,
      is_popular: true,
      allergens: ['Gluten', 'Dairy', 'Egg', 'Nuts'],
      dietary_restrictions: ['Vegetarian'],
      preparation_time_minutes: 5,
      ingredients: ['Chocolate', 'Butter', 'Eggs', 'Sugar', 'Ice Cream'],
      tags: ['sweet'],
    },
    {
      id: 'item-8',
      tenant_id: 'demo',
      category_id: 'cat-1',
      name: 'Veggie Burger',
      name_en: 'Veggie Burger',
      description: 'Plant-based patty with avocado, tomato, and vegan mayo',
      price: 13.50,
      currency: 'EUR',
      is_available: true,
      is_popular: false,
      allergens: ['Gluten'],
      dietary_restrictions: ['Vegan'],
      preparation_time_minutes: 15,
      ingredients: ['Plant Patty', 'Avocado', 'Tomato', 'Lettuce', 'Vegan Mayo'],
      tags: ['vegan', 'healthy'],
    },
  ];
}
