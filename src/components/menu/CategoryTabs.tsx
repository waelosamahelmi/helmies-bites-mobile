import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/api';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (categoryId: string | null) => void;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
  className,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active category into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (
        elementRect.left < containerRect.left ||
        elementRect.right > containerRect.right
      ) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeCategory]);

  const allCategories = [
    { id: null, name: 'All', name_en: 'All' },
    ...categories,
  ];

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3',
        className
      )}
    >
      {allCategories.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <motion.button
            key={category.id ?? 'all'}
            ref={isActive ? activeRef : null}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category.id)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium',
              'border transition-all duration-200',
              isActive
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-text-secondary border-border hover:border-primary hover:text-primary'
            )}
          >
            {category.name_en || category.name}
          </motion.button>
        );
      })}
    </div>
  );
}
