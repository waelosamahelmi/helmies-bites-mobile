import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

const COLORS = ['#FF7A00', '#FFB347', '#FF6B6B', '#4CAF50', '#2196F3', '#E91E63', '#FFD700'];

export function ConfettiEffect({ active, duration = 3000 }: { active: boolean; duration?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }));

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [active, duration]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
              animate={{
                y: '110vh',
                x: `${p.x + (Math.random() - 0.5) * 30}vw`,
                rotate: p.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size * (Math.random() > 0.5 ? 1 : 0.6),
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
