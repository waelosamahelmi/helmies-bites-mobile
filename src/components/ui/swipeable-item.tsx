import { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeableItemProps {
  children: ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
}

export function SwipeableItem({ children, onDelete, deleteLabel = 'Delete' }: SwipeableItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const deleteScale = useTransform(x, [-100, -50, 0], [1, 0.8, 0.5]);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      setIsOpen(true);
    } else if (info.offset.x > 30) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative overflow-hidden" ref={constraintsRef}>
      {/* Delete action behind */}
      <motion.div
        style={{ opacity: deleteOpacity, scale: deleteScale }}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-error"
      >
        <button
          onClick={() => {
            onDelete();
            setIsOpen(false);
          }}
          className="flex flex-col items-center gap-1 text-white"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{deleteLabel}</span>
        </button>
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isOpen ? -80 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{ x }}
        className="relative z-10 glass-card"
      >
        {children}
      </motion.div>
    </div>
  );
}
