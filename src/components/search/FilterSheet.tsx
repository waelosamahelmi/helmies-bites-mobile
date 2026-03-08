import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Leaf, Wheat, Star, Clock, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SearchFilters {
  dietary: string[];
  priceRange: [number, number] | null;
  maxDeliveryTime: number | null;
  minRating: number | null;
  freeDelivery: boolean;
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}

const dietaryOptions = [
  { id: 'vegan', label: 'Vegan', icon: Leaf },
  { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { id: 'gluten-free', label: 'Gluten Free', icon: Wheat },
  { id: 'halal', label: 'Halal', icon: Check },
  { id: 'dairy-free', label: 'Dairy Free', icon: Check },
  { id: 'nut-free', label: 'Nut Free', icon: Check },
];

const deliveryTimeOptions = [
  { value: 15, label: '< 15 min' },
  { value: 30, label: '< 30 min' },
  { value: 45, label: '< 45 min' },
  { value: 60, label: '< 60 min' },
];

const ratingOptions = [
  { value: 4.5, label: '4.5+' },
  { value: 4.0, label: '4.0+' },
  { value: 3.5, label: '3.5+' },
  { value: 3.0, label: '3.0+' },
];

export function FilterSheet({ open, onClose, filters, onApply }: FilterSheetProps) {
  const [local, setLocal] = useState<SearchFilters>(filters);

  const toggleDietary = (id: string) => {
    setLocal(prev => ({
      ...prev,
      dietary: prev.dietary.includes(id)
        ? prev.dietary.filter(d => d !== id)
        : [...prev.dietary, id],
    }));
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    setLocal({ dietary: [], priceRange: null, maxDeliveryTime: null, minRating: null, freeDelivery: false });
  };

  const activeCount = local.dietary.length +
    (local.maxDeliveryTime ? 1 : 0) +
    (local.minRating ? 1 : 0) +
    (local.freeDelivery ? 1 : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 sheet-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border dark:border-gray-800">
              <h2 className="text-lg font-black text-text-primary dark:text-white">Filters</h2>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button onClick={handleClear} className="text-sm font-semibold text-primary">
                    Clear all
                  </button>
                )}
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 space-y-6">
              {/* Dietary */}
              <div>
                <h3 className="text-sm font-bold text-text-primary dark:text-white mb-3">Dietary</h3>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map(opt => {
                    const active = local.dietary.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleDietary(opt.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                          active
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border dark:border-gray-700 text-text-secondary dark:text-gray-400'
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery time */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-text-secondary" />
                  <h3 className="text-sm font-bold text-text-primary dark:text-white">Max delivery time</h3>
                </div>
                <div className="flex gap-2">
                  {deliveryTimeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setLocal(p => ({ ...p, maxDeliveryTime: p.maxDeliveryTime === opt.value ? null : opt.value }))}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        local.maxDeliveryTime === opt.value
                          ? 'bg-primary text-white'
                          : 'bg-surface-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-text-secondary" />
                  <h3 className="text-sm font-bold text-text-primary dark:text-white">Min rating</h3>
                </div>
                <div className="flex gap-2">
                  {ratingOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setLocal(p => ({ ...p, minRating: p.minRating === opt.value ? null : opt.value }))}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        local.minRating === opt.value
                          ? 'bg-primary text-white'
                          : 'bg-surface-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free delivery */}
              <button
                onClick={() => setLocal(p => ({ ...p, freeDelivery: !p.freeDelivery }))}
                className="flex items-center gap-3 w-full"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Bike className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-bold text-text-primary dark:text-white">Free delivery only</span>
                </div>
                <div className={`w-12 h-7 rounded-full transition-colors relative ${
                  local.freeDelivery ? 'bg-primary' : 'bg-border-strong dark:bg-gray-700'
                }`}>
                  <motion.div
                    animate={{ x: local.freeDelivery ? 20 : 2 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm"
                  />
                </div>
              </button>
            </div>

            {/* Apply button */}
            <div className="px-4 py-4 pb-safe border-t border-border dark:border-gray-800">
              <Button onClick={handleApply} className="w-full h-12">
                Show results {activeCount > 0 && `(${activeCount} filters)`}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
