import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  fullHeight?: boolean;
}

export function Sheet({ open, onClose, children, title, className, fullHeight }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 sheet-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl shadow-sheet',
              fullHeight ? 'top-4' : 'max-h-[90vh]',
              className
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="w-10 h-1 bg-border-strong rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
              {title && <h2 className="text-lg font-bold text-white mt-2">{title}</h2>}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-background flex items-center justify-center mt-2 ml-auto"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
