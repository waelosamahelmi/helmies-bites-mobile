import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showDeleteOnZero?: boolean;
  className?: string;
}

const sizes = {
  sm: {
    container: 'h-7 gap-2',
    button: 'w-6 h-6',
    icon: 'w-3 h-3',
    text: 'text-sm w-5',
  },
  md: {
    container: 'h-8 gap-3',
    button: 'w-7 h-7',
    icon: 'w-3.5 h-3.5',
    text: 'text-base w-6',
  },
  lg: {
    container: 'h-10 gap-4',
    button: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-lg w-8',
  },
};

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  min = 0,
  max = 99,
  size = 'md',
  showDeleteOnZero = true,
  className,
}: QuantitySelectorProps) {
  const haptics = useHaptics();
  const sizeStyles = sizes[size];

  const handleDecrement = () => {
    haptics.selectionChanged();
    if (quantity <= min && onRemove) {
      onRemove();
    } else {
      onDecrement();
    }
  };

  const handleIncrement = () => {
    haptics.selectionChanged();
    onIncrement();
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-surface-tertiary',
        sizeStyles.container,
        className
      )}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleDecrement}
        disabled={quantity <= min && !onRemove}
        className={cn(
          'flex items-center justify-center rounded-full transition-colors',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          quantity === 1 && showDeleteOnZero && onRemove
            ? 'bg-error/10 text-error hover:bg-error/20'
            : 'bg-white text-text-primary hover:bg-gray-50 shadow-sm',
          sizeStyles.button
        )}
      >
        {quantity === 1 && showDeleteOnZero && onRemove ? (
          <Trash2 className={sizeStyles.icon} />
        ) : (
          <Minus className={sizeStyles.icon} />
        )}
      </motion.button>

      <motion.span
        key={quantity}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className={cn(
          'font-semibold text-text-primary text-center',
          sizeStyles.text
        )}
      >
        {quantity}
      </motion.span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={cn(
          'flex items-center justify-center rounded-full bg-primary text-white shadow-sm',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'hover:bg-primary-600 transition-colors',
          sizeStyles.button
        )}
      >
        <Plus className={sizeStyles.icon} />
      </motion.button>
    </div>
  );
}
