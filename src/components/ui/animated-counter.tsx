import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ value, className = '', prefix = '', suffix = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    setDirection(value > displayValue ? 'up' : 'down');
    setDisplayValue(value);
  }, [value]);

  return (
    <span className={`inline-flex items-center overflow-hidden ${className}`}>
      {prefix}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ y: direction === 'up' ? 20 : -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === 'up' ? -20 : 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
      {suffix}
    </span>
  );
}
