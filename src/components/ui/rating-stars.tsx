import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

export function RatingStars({ rating, maxRating = 5, size = 'md', interactive = false, onChange }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              'transition-transform',
              interactive && 'hover:scale-125 active:scale-95 cursor-pointer',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                filled ? 'fill-warning text-warning' :
                halfFilled ? 'fill-warning/50 text-warning' :
                'fill-none text-border-strong'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
