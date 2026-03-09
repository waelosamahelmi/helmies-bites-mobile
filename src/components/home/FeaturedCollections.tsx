import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Restaurant } from '@/hooks/useRestaurants';

interface FeaturedCollectionsProps {
  restaurants: Restaurant[];
}

const collections = [
  {
    id: 'new',
    title: 'New on Helmies',
    subtitle: 'Recently added restaurants',
    gradient: 'from-violet-500 to-purple-600',
    emoji: '🆕',
    filter: () => true, // All recent
  },
  {
    id: 'fast',
    title: 'Under 30 min',
    subtitle: 'Quick delivery options',
    gradient: 'from-primary to-primary-600',
    emoji: '⚡',
    filter: (r: Restaurant) => r.deliveryTime <= 30,
  },
  {
    id: 'popular',
    title: 'Top Rated',
    subtitle: 'Highest rated near you',
    gradient: 'from-emerald-500 to-green-600',
    emoji: '⭐',
    filter: (r: Restaurant) => r.rating >= 4.0,
  },
  {
    id: 'budget',
    title: 'Budget Friendly',
    subtitle: 'Great food, great prices',
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '💰',
    filter: (r: Restaurant) => r.deliveryFee <= 2,
  },
];

export function FeaturedCollections({ restaurants }: FeaturedCollectionsProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto hide-scrollbar px-4 pb-2">
      <div className="flex gap-3">
        {collections.map((col, i) => {
          const count = restaurants.filter(col.filter).length;
          return (
            <motion.button
              key={col.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/search?collection=${col.id}`)}
              className={`flex-shrink-0 w-36 h-24 rounded-2xl bg-gradient-to-br ${col.gradient} p-3 flex flex-col justify-between text-left shadow-glass`}
            >
              <span className="text-2xl">{col.emoji}</span>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{col.title}</p>
                <p className="text-[10px] text-white/70">{count} places</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
