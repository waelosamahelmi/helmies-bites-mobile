import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
  onLinkPress?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  linkText = 'See all',
  linkTo,
  onLinkPress,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3',
        className
      )}
    >
      <div>
        <h2 className="font-bold text-lg text-text-primary">{title}</h2>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>

      {(linkTo || onLinkPress) && (
        <>
          {linkTo ? (
            <Link
              to={linkTo}
              className="flex items-center gap-0.5 text-primary font-medium text-sm"
            >
              {linkText}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={onLinkPress}
              className="flex items-center gap-0.5 text-primary font-medium text-sm"
            >
              {linkText}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
