import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Restaurant } from '@/hooks/useRestaurants';

interface StoriesCarouselProps {
  restaurants: Restaurant[];
}

interface Story {
  restaurant: Restaurant;
  viewed: boolean;
}

export function StoriesCarousel({ restaurants }: StoriesCarouselProps) {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  const stories: Story[] = restaurants.slice(0, 10).map(r => ({
    restaurant: r,
    viewed: viewedStories.has(r.tenant.id),
  }));

  const openStory = (index: number) => {
    setActiveStory(index);
    const id = stories[index].restaurant.tenant.id;
    setViewedStories(prev => new Set(prev).add(id));
  };

  const nextStory = () => {
    if (activeStory !== null && activeStory < stories.length - 1) {
      const nextIdx = activeStory + 1;
      setActiveStory(nextIdx);
      const id = stories[nextIdx].restaurant.tenant.id;
      setViewedStories(prev => new Set(prev).add(id));
    } else {
      setActiveStory(null);
    }
  };

  const prevStory = () => {
    if (activeStory !== null && activeStory > 0) {
      setActiveStory(activeStory - 1);
    }
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
  ];

  return (
    <>
      {/* Stories strip */}
      <div className="overflow-x-auto hide-scrollbar py-3 px-4">
        <div className="flex gap-3">
          {stories.map((story, i) => (
            <button
              key={story.restaurant.tenant.id}
              onClick={() => openStory(i)}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className={`w-16 h-16 rounded-full p-[2.5px] ${
                story.viewed
                  ? 'bg-border'
                  : 'bg-gradient-to-tr from-primary via-primary-400 to-warning'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900">
                  <img
                    src={story.restaurant.imageUrl || placeholderImages[i % placeholderImages.length]}
                    alt={story.restaurant.tenant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[10px] font-medium text-text-secondary dark:text-gray-400 max-w-[64px] truncate">
                {story.restaurant.tenant.name_en || story.restaurant.tenant.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Full-screen story viewer */}
      <AnimatePresence>
        {activeStory !== null && stories[activeStory] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black"
          >
            {/* Progress bars */}
            <div className="absolute top-safe left-0 right-0 z-10 flex gap-1 px-3 pt-2">
              {stories.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: i < activeStory ? '100%' : '0%' }}
                    animate={{
                      width: i < activeStory ? '100%' : i === activeStory ? '100%' : '0%',
                    }}
                    transition={i === activeStory ? { duration: 5, ease: 'linear' } : { duration: 0 }}
                    onAnimationComplete={() => {
                      if (i === activeStory) nextStory();
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story image */}
            <img
              src={stories[activeStory].restaurant.imageUrl || placeholderImages[activeStory % placeholderImages.length]}
              alt=""
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            {/* Restaurant info */}
            <div className="absolute bottom-20 left-0 right-0 px-6">
              <h2 className="text-2xl font-black text-white">
                {stories[activeStory].restaurant.tenant.name_en || stories[activeStory].restaurant.tenant.name}
              </h2>
              <p className="text-sm text-white/70 mt-1">
                {stories[activeStory].restaurant.cuisineType || 'Tap to view menu'}
              </p>
            </div>

            {/* Navigation areas */}
            <button onClick={prevStory} className="absolute left-0 top-20 bottom-20 w-1/3" />
            <button onClick={nextStory} className="absolute right-0 top-20 bottom-20 w-1/3" />

            {/* Close */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-safe right-3 mt-6 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
