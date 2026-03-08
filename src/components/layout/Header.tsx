import { MapPin, ChevronDown, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation as useGeoLocation } from '@/contexts/LocationContext';

export function Header() {
  const { address, city } = useGeoLocation();
  const navigate = useNavigate();
  const displayLocation = address || city || 'Set location';

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 safe-top border-b border-border/50 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Location selector */}
        <button
          onClick={() => navigate('/address')}
          className="flex items-center gap-1.5 min-w-0"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-0.5">
              <span className="text-sm font-bold text-text-primary dark:text-white truncate max-w-[180px]">
                {displayLocation}
              </span>
              <ChevronDown className="w-4 h-4 text-text-secondary dark:text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 rounded-full bg-surface-secondary dark:bg-gray-800 flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-text-secondary dark:text-gray-400" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          </motion.button>

          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-black text-sm">H</span>
          </div>
        </div>
      </div>
    </header>
  );
}
