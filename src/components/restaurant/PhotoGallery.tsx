import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function PhotoGallery({ photos, open, initialIndex = 0, onClose }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(initialIndex);

  if (photos.length === 0) return null;

  const next = () => setCurrent(c => (c + 1) % photos.length);
  const prev = () => setCurrent(c => (c - 1 + photos.length) % photos.length);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 safe-top">
            <span className="text-sm font-semibold text-white/70">
              {current + 1} / {photos.length}
            </span>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={photos[current]}
                alt={`Photo ${current + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain"
              />
            </AnimatePresence>

            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="overflow-x-auto hide-scrollbar px-4 py-3 safe-bottom">
              <div className="flex gap-2 justify-center">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === current ? 'border-primary' : 'border-transparent opacity-50'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
