import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/lib/api';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const placeholderImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';

  return (
    <button
      onClick={onClick}
      className="flex gap-3 p-4 w-full text-left hover:bg-surface-secondary transition-colors"
      disabled={!item.is_available}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-text-primary line-clamp-1">
            {item.name_en || item.name}
          </h3>
          {item.is_popular && <Badge variant="primary" size="sm">Popular</Badge>}
        </div>
        {(item.description_en || item.description) && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {item.description_en || item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-text-primary">
            {formatPrice(item.price)}
          </span>
          {!item.is_available && (
            <Badge variant="error" size="sm">Unavailable</Badge>
          )}
        </div>
        {item.allergens?.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {item.allergens.slice(0, 3).map(a => (
              <span key={a} className="text-[10px] text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
      {item.image_url && (
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-tertiary flex-shrink-0">
          <img
            src={item.image_url || placeholderImg}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </button>
  );
}
