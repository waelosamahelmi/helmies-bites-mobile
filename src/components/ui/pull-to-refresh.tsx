import { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const y = useMotionValue(0);
  const haptics = useHaptics();

  const progress = useTransform(y, [0, threshold], [0, 1]);
  const rotation = useTransform(y, [0, threshold], [0, 180]);
  const opacity = useTransform(y, [0, threshold / 2, threshold], [0, 0.5, 1]);
  const scale = useTransform(y, [0, threshold], [0.5, 1]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop !== 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - startY.current);

    // Apply resistance
    const resistance = 0.5;
    const pullDistance = diff * resistance;

    y.set(Math.min(pullDistance, threshold * 1.5));

    // Haptic feedback when threshold is reached
    const prevY = y.getPrevious();
    if (pullDistance >= threshold && prevY !== undefined && prevY < threshold) {
      haptics.impactLight();
    }
  };

  const handleTouchEnd = async () => {
    const currentY = y.get();

    if (currentY >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      haptics.impactMedium();

      // Keep pulled while refreshing
      animate(y, threshold, { duration: 0.2 });

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        animate(y, 0, {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        });
      }
    } else {
      animate(y, 0, {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      });
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Pull indicator */}
      <motion.div
        style={{ y, opacity }}
        className="absolute left-0 right-0 top-0 flex items-center justify-center h-20 -mt-20 z-10"
      >
        <motion.div
          style={{ scale, rotate: rotation }}
          className={cn(
            'w-10 h-10 rounded-full bg-primary flex items-center justify-center',
            isRefreshing && 'animate-spin'
          )}
        >
          <Loader2 className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={containerRef}
        style={{ y }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="overflow-y-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}
