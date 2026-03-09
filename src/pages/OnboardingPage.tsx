import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Utensils, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingPageProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Utensils,
    title: 'Discover Restaurants',
    description: 'Browse hundreds of restaurants near you. From local favorites to popular chains.',
    gradient: 'from-primary to-primary-600',
    bgEmoji: '🍔🍕🍣🥙🍜',
  },
  {
    icon: MapPin,
    title: 'Delivery to Your Door',
    description: 'Fast and reliable delivery. Track your order in real-time from kitchen to doorstep.',
    gradient: 'from-info to-blue-600',
    bgEmoji: '📍🏠🚲📦⏱️',
  },
  {
    icon: Gift,
    title: 'Earn Rewards',
    description: 'Collect points with every order. Redeem them for free meals, discounts, and exclusive perks.',
    gradient: 'from-success to-emerald-600',
    bgEmoji: '🎁⭐💰🏆🎉',
  },
];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(c => c + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4 safe-top">
        <button onClick={onComplete} className="text-sm font-semibold text-white/60">
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center"
          >
            {/* Floating emojis background */}
            <div className="relative w-48 h-48 mb-8">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${slide.gradient} opacity-10`} />
              <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${slide.gradient} opacity-20`} />
              <motion.div
                initial={{ scale: 0.5, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className={`absolute inset-8 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-float`}
              >
                <slide.icon className="w-16 h-16 text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Floating emojis */}
              {slide.bgEmoji.split('').filter(c => c.trim()).map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0.8],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)],
                    y: [0, -(20 + i * 12)],
                  }}
                  transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute text-2xl"
                  style={{ top: '50%', left: '50%' }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            <h1 className="text-2xl font-black text-white">{slide.title}</h1>
            <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-12 safe-bottom">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? '#FF7A00' : '#E0E0E0',
              }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <Button onClick={next} className="w-full h-14 text-base" size="lg">
          {current < slides.length - 1 ? (
            <>Continue <ArrowRight className="w-5 h-5 ml-2" /></>
          ) : (
            'Get Started'
          )}
        </Button>
      </div>
    </div>
  );
}
