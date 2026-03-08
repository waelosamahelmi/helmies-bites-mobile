import { RatingStars } from '@/components/ui/rating-stars';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">{getInitials(review.userName)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-text-primary dark:text-white">{review.userName}</h4>
            <span className="text-xs text-text-tertiary dark:text-gray-500">
              {format(new Date(review.date), 'MMM d, yyyy')}
            </span>
          </div>
          <RatingStars rating={review.rating} size="sm" />
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">{review.comment}</p>

          {review.reply && (
            <div className="mt-3 pl-3 border-l-2 border-primary/30">
              <p className="text-xs font-semibold text-primary mb-0.5">Restaurant reply</p>
              <p className="text-xs text-text-secondary dark:text-gray-400">{review.reply}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
