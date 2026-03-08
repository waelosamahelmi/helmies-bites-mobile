import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-12 rounded-xl bg-surface-secondary text-text-primary px-4 text-sm',
              'placeholder:text-text-tertiary',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white',
              'border border-transparent focus:border-primary',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-error focus:ring-error/30',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-error text-xs mt-1 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
