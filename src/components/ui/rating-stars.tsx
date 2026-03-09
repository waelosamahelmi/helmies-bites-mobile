import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  reviewCount,
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = !filled && index < rating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(index + 1)}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizes[size],
                  'transition-colors',
                  filled
                    ? 'fill-accent-orange text-accent-orange'
                    : 'fill-transparent text-gray-300'
                )}
              />
              {partial && (
                <Star
                  className={cn(
                    sizes[size],
                    'absolute inset-0 fill-accent-orange text-accent-orange',
                    'clip-path-[inset(0_50%_0_0)]'
                  )}
                  style={{
                    clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className={cn('font-medium text-white', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn('text-white/60', textSizes[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
