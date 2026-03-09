import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

interface TipSelectorProps {
  subtotal: number;
  onTipChange: (tip: number) => void;
}

export function TipSelector({ subtotal, onTipChange }: TipSelectorProps) {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState('');

  const tipOptions = [
    { label: 'No tip', value: 0 },
    { label: '10%', value: Math.round(subtotal * 0.1 * 100) / 100 },
    { label: '15%', value: Math.round(subtotal * 0.15 * 100) / 100 },
    { label: '20%', value: Math.round(subtotal * 0.2 * 100) / 100 },
  ];

  const selectTip = (value: number) => {
    setSelectedTip(value);
    setCustomTip('');
    onTipChange(value);
  };

  const handleCustomTip = (val: string) => {
    setCustomTip(val);
    setSelectedTip(null);
    const num = parseFloat(val);
    onTipChange(isNaN(num) ? 0 : num);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-white">Add a tip for your driver</h3>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {tipOptions.map((opt) => (
          <motion.button
            key={opt.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectTip(opt.value)}
            className={cn(
              'py-2.5 rounded-xl text-center transition-all',
              selectedTip === opt.value
                ? 'bg-primary text-white shadow-float'
                : 'bg-background text-white/60'
            )}
          >
            <p className="text-xs font-bold">{opt.label}</p>
            {opt.value > 0 && (
              <p className="text-[10px] mt-0.5 opacity-70">{formatPrice(opt.value)}</p>
            )}
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">EUR</span>
        <input
          type="number"
          value={customTip}
          onChange={(e) => handleCustomTip(e.target.value)}
          placeholder="Custom amount"
          min="0"
          step="0.50"
          className="w-full h-11 rounded-xl bg-background pl-12 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
