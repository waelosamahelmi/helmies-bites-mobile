import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BackHeaderProps {
  title?: string;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  onBack?: () => void;
}

export function BackHeader({ title, rightAction, transparent, onBack }: BackHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn(
      'sticky top-0 z-30 safe-top',
      transparent ? 'bg-transparent' : 'bg-white border-b border-border'
    )}>
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={onBack || (() => navigate(-1))}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            transparent ? 'bg-white/90 shadow-card' : 'hover:bg-surface-secondary'
          )}
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        {title && (
          <h1 className="text-base font-bold text-text-primary absolute left-1/2 -translate-x-1/2 truncate max-w-[200px]">
            {title}
          </h1>
        )}
        <div className="w-10">{rightAction}</div>
      </div>
    </header>
  );
}
