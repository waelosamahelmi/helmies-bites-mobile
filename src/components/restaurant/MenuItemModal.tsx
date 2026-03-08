import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/lib/api';

interface MenuItemModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

export function MenuItemModal({ item, open, onClose }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const { addItem } = useCart();

  if (!item) return null;

  const handleAdd = () => {
    addItem(item, quantity, instructions || undefined);
    setQuantity(1);
    setInstructions('');
    onClose();
  };

  const totalPrice = item.price * quantity;
  const placeholderImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';

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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-card flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image */}
            {item.image_url && (
              <div className="h-56 bg-surface-tertiary">
                <img
                  src={item.image_url || placeholderImg}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h2 className="text-xl font-black text-text-primary">
                {item.name_en || item.name}
              </h2>
              <p className="text-base font-bold text-primary mt-1">
                {formatPrice(item.price)}
              </p>
              {(item.description_en || item.description) && (
                <p className="text-sm text-text-secondary mt-2">
                  {item.description_en || item.description}
                </p>
              )}

              {/* Allergens */}
              {item.allergens?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-text-secondary mb-1">Allergens</p>
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map(a => (
                      <span key={a} className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Special instructions */}
              <div className="mt-4">
                <label className="text-sm font-semibold text-text-primary block mb-1.5">
                  Special instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. No onions, extra sauce..."
                  className="w-full h-20 rounded-xl bg-surface-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary"
                />
              </div>

              {/* Quantity & Add to cart */}
              <div className="flex items-center gap-4 mt-6 pb-safe">
                {/* Quantity selector */}
                <div className="flex items-center bg-surface-secondary rounded-xl">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 text-text-primary" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-text-primary" />
                  </button>
                </div>

                {/* Add button */}
                <Button
                  onClick={handleAdd}
                  className="flex-1 h-12"
                  size="lg"
                >
                  Add to cart  {formatPrice(totalPrice)}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
