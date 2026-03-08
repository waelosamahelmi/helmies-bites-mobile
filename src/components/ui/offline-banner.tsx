import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-text-primary dark:bg-gray-700 overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 py-2 px-4">
            <WifiOff className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">No internet connection</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
