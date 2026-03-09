import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryTimePickerProps {
  onTimeChange: (time: string | null) => void;
  estimatedTime?: number;
}

export function DeliveryTimePicker({ onTimeChange, estimatedTime = 35 }: DeliveryTimePickerProps) {
  const [mode, setMode] = useState<'asap' | 'scheduled'>('asap');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Generate time slots for today
  const now = new Date();
  const slots: string[] = [];
  const startHour = now.getHours() + 1;
  for (let h = Math.max(startHour, 10); h <= 22; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 22) slots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  const handleModeChange = (m: 'asap' | 'scheduled') => {
    setMode(m);
    if (m === 'asap') {
      setSelectedSlot(null);
      onTimeChange(null);
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    onTimeChange(slot);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-white">Delivery time</h3>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeChange('asap')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all',
            mode === 'asap'
              ? 'border-primary bg-primary/15'
              : 'border-white/10'
          )}
        >
          <Zap className={cn('w-4 h-4', mode === 'asap' ? 'text-primary' : 'text-white/40')} />
          <div className="text-left">
            <p className={cn('text-sm font-semibold', mode === 'asap' ? 'text-primary' : 'text-white')}>
              ASAP
            </p>
            <p className="text-[10px] text-white/40">{estimatedTime}-{estimatedTime + 10} min</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeChange('scheduled')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all',
            mode === 'scheduled'
              ? 'border-primary bg-primary/15'
              : 'border-white/10'
          )}
        >
          <Clock className={cn('w-4 h-4', mode === 'scheduled' ? 'text-primary' : 'text-white/40')} />
          <div className="text-left">
            <p className={cn('text-sm font-semibold', mode === 'scheduled' ? 'text-primary' : 'text-white')}>
              Schedule
            </p>
            <p className="text-[10px] text-white/40">Pick a time</p>
          </div>
        </motion.button>
      </div>

      {/* Time slots */}
      {mode === 'scheduled' && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="text-xs font-semibold text-white/60 mb-2">Today</p>
          <div className="grid grid-cols-4 gap-1.5">
            {slots.map(slot => (
              <button
                key={slot}
                onClick={() => handleSlotSelect(slot)}
                className={cn(
                  'py-2 rounded-lg text-xs font-semibold transition-all',
                  selectedSlot === slot
                    ? 'bg-primary text-white'
                    : 'bg-background text-white/60 hover:bg-muted'
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
