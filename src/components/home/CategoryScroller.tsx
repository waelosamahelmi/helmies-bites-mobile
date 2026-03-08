import { cn } from '@/lib/utils';
import { FOOD_CATEGORIES } from '@/lib/constants';

interface CategoryScrollerProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryScroller({ activeCategory, onSelect }: CategoryScrollerProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 px-4 py-3">
        {FOOD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0',
              activeCategory === cat.id
                ? 'bg-text-primary text-white shadow-sm'
                : 'bg-white text-text-primary border border-border hover:border-border-strong'
            )}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
