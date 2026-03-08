import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PromoCodeInputProps {
  onApply: (code: string) => boolean;
  onRemove: () => void;
  appliedCode: { code: string; description: string } | null;
  error: string;
}

export function PromoCodeInput({ onApply, onRemove, appliedCode, error }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim());
    }
  };

  if (appliedCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 bg-success/10 rounded-xl"
      >
        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
          <Check className="w-4 h-4 text-success" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-success">{appliedCode.code}</p>
          <p className="text-xs text-text-secondary dark:text-gray-400">{appliedCode.description}</p>
        </div>
        <button onClick={onRemove} className="p-1">
          <X className="w-4 h-4 text-text-tertiary" />
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <Tag className="w-4 h-4" />
        Add promo code
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 h-11 rounded-xl bg-surface-secondary dark:bg-gray-800 px-4 text-sm text-text-primary dark:text-white placeholder:text-text-tertiary uppercase focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleApply}
                disabled={!code.trim()}
                className={cn(
                  'px-5 h-11 rounded-xl text-sm font-bold transition-colors',
                  code.trim() ? 'bg-primary text-white' : 'bg-surface-tertiary text-text-tertiary'
                )}
              >
                Apply
              </button>
            </div>
            {error && (
              <p className="text-xs text-error mt-1.5 font-medium">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
