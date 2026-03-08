import { useState, useEffect } from 'react';
import { Minus, Plus, X, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/lib/api';

interface MenuItemModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

function getCustomizations(_item: MenuItem): CustomizationGroup[] {
  return [
    {
      id: 'size',
      name: 'Choose size',
      type: 'single',
      required: true,
      options: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'large', name: 'Large', price: 2.50 },
        { id: 'xl', name: 'Extra Large', price: 4.00 },
      ],
    },
    {
      id: 'extras',
      name: 'Add extras',
      type: 'multiple',
      required: false,
      options: [
        { id: 'cheese', name: 'Extra cheese', price: 1.50 },
        { id: 'sauce', name: 'Extra sauce', price: 0.50 },
        { id: 'avocado', name: 'Avocado', price: 2.00 },
        { id: 'bacon', name: 'Bacon', price: 2.50 },
        { id: 'jalapeno', name: 'Jalapenos', price: 1.00 },
      ],
    },
  ];
}

export function MenuItemModal({ item, open, onClose }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const { addItem } = useCart();
  const haptics = useHaptics();
  const toast = useToast();

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setInstructions('');
      setSelectedOptions({ size: ['regular'] });
    }
  }, [item]);

  if (!item) return null;

  const customizations = getCustomizations(item);

  const toggleOption = (groupId: string, optionId: string, type: 'single' | 'multiple') => {
    haptics.selectionChanged();
    setSelectedOptions(prev => {
      if (type === 'single') {
        return { ...prev, [groupId]: [optionId] };
      }
      const current = prev[groupId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter(id => id !== optionId) };
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const extrasCost = customizations.reduce((total, group) => {
    const selected = selectedOptions[group.id] || [];
    return total + group.options
      .filter(opt => selected.includes(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
  }, 0);

  const unitPrice = item.price + extrasCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    haptics.notification('success');
    const extrasText = Object.entries(selectedOptions)
      .flatMap(([groupId, optIds]) => {
        const group = customizations.find(g => g.id === groupId);
        return optIds
          .filter(id => id !== 'regular')
          .map(id => group?.options.find(o => o.id === id)?.name)
          .filter(Boolean);
      })
      .join(', ');

    const fullInstructions = [extrasText, instructions].filter(Boolean).join('. ');
    addItem(item, quantity, fullInstructions || undefined);
    toast.success(`Added ${quantity}x ${item.name_en || item.name} to cart`);
    setQuantity(1);
    setInstructions('');
    onClose();
  };

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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800 shadow-card flex items-center justify-center"
            >
              <X className="w-4 h-4 dark:text-white" />
            </button>

            {item.image_url && (
              <div className="h-56 bg-surface-tertiary dark:bg-gray-800 relative">
                <img src={item.image_url || placeholderImg} alt={item.name} className="w-full h-full object-cover" />
                {item.is_popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full"
                  >
                    Popular
                  </motion.div>
                )}
              </div>
            )}

            <div className="p-4">
              <h2 className="text-xl font-black text-text-primary dark:text-white">{item.name_en || item.name}</h2>
              <p className="text-base font-bold text-primary mt-1">{formatPrice(item.price)}</p>
              {(item.description_en || item.description) && (
                <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">{item.description_en || item.description}</p>
              )}

              {item.allergens?.length > 0 && (
                <div className="mt-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map(a => (
                      <span key={a} className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {item.dietary_restrictions?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.dietary_restrictions.map(d => (
                    <span key={d} className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">{d}</span>
                  ))}
                </div>
              )}

              {customizations.map(group => (
                <div key={group.id} className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-text-primary dark:text-white">{group.name}</h3>
                    {group.required && (
                      <span className="text-[10px] font-semibold text-error bg-error/10 px-2 py-0.5 rounded-full">Required</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {group.options.map(opt => {
                      const isSelected = (selectedOptions[group.id] || []).includes(opt.id);
                      return (
                        <motion.button
                          key={opt.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleOption(group.id, opt.id, group.type)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all',
                            isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border dark:border-gray-700'
                          )}
                        >
                          <div className={cn(
                            'w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                            group.type === 'multiple' ? 'rounded-md' : 'rounded-full',
                            isSelected ? 'border-primary bg-primary' : 'border-border-strong dark:border-gray-600'
                          )}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="flex-1 text-sm text-text-primary dark:text-white text-left font-medium">{opt.name}</span>
                          {opt.price > 0 && <span className="text-xs font-semibold text-primary">+{formatPrice(opt.price)}</span>}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mt-5">
                <label className="text-sm font-bold text-text-primary dark:text-white block mb-1.5">Special instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. No onions, extra sauce..."
                  className="w-full h-20 rounded-xl bg-surface-secondary dark:bg-gray-800 px-3 py-2.5 text-sm text-text-primary dark:text-white placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-4 mt-6 pb-safe">
                <div className="flex items-center bg-surface-secondary dark:bg-gray-800 rounded-xl">
                  <button onClick={() => { setQuantity(q => Math.max(1, q - 1)); haptics.impact('light'); }} className="w-10 h-10 flex items-center justify-center">
                    <Minus className="w-4 h-4 text-text-primary dark:text-white" />
                  </button>
                  <motion.span key={quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-8 text-center text-sm font-bold text-text-primary dark:text-white">
                    {quantity}
                  </motion.span>
                  <button onClick={() => { setQuantity(q => q + 1); haptics.impact('light'); }} className="w-10 h-10 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-text-primary dark:text-white" />
                  </button>
                </div>
                <Button onClick={handleAdd} className="flex-1 h-12" size="lg">
                  Add to cart · {formatPrice(totalPrice)}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
