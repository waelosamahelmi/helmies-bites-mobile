import { MenuItemCard } from './MenuItemCard';
import type { MenuItem, Category } from '@/lib/api';

interface MenuSectionProps {
  category: Category;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export function MenuSection({ category, items, onItemClick }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="glass-card mt-2">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-black text-white">
          {category.name_en || category.name}
        </h2>
        {category.description && (
          <p className="text-xs text-white/60 mt-0.5">{category.description}</p>
        )}
      </div>
      <div className="divide-y divide-white/10">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </section>
  );
}
