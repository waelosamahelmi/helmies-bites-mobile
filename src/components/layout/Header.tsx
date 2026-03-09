import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, ShoppingBag, Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores';
import { useUIStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  transparent?: boolean;
  className?: string;
  centerTitle?: boolean;
  titleClassName?: string;
  rightContent?: React.ReactNode;
  onBackPress?: () => void;
}

export function Header({
  title,
  showBack = false,
  showSearch = false,
  showCart = false,
  showMenu = false,
  showNotifications = false,
  transparent = false,
  className,
  centerTitle = true,
  titleClassName,
  rightContent,
  onBackPress,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHaptics();
  const { total, itemCount } = useCartStore();
  const { openSearch, toggleMenu } = useUIStore();

  const handleBack = () => {
    haptics.selectionChanged();
    if (onBackPress) {
      onBackPress();
    } else {
      navigate(-1);
    }
  };

  const handleCartPress = () => {
    haptics.selectionChanged();
    navigate('/cart');
  };

  const handleSearchPress = () => {
    haptics.selectionChanged();
    if (location.pathname !== '/search') {
      navigate('/search');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-[56px] pt-safe-top max-w-lg mx-auto',
        'flex items-center justify-between px-4',
        transparent 
          ? 'bg-transparent' 
          : 'bg-background/80 backdrop-blur-xl border-b border-white/5',
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center min-w-[60px]">
        {showMenu && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="p-2 -ml-2 glass-button rounded-xl"
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.button>
        )}
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="p-2 -ml-2 glass-button rounded-xl"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </div>

      {/* Center title */}
      {title && (
        <div
          className={cn(
            centerTitle && 'absolute left-1/2 -translate-x-1/2',
            !centerTitle && 'flex-1'
          )}
        >
          <h1
            className={cn(
              'font-bold text-lg text-white truncate',
              titleClassName
            )}
          >
            {title}
          </h1>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-2 min-w-[60px] justify-end">
        {rightContent}

        {showSearch && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSearchPress}
            className="p-2.5 glass-button rounded-xl"
          >
            <Search className="w-5 h-5 text-white/80" />
          </motion.button>
        )}

        {showNotifications && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
            className="p-2.5 glass-button rounded-xl relative"
          >
            <Bell className="w-5 h-5 text-white/80" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full shadow-glow" />
          </motion.button>
        )}

        {showCart && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCartPress}
            className="p-2.5 glass-button rounded-xl relative"
          >
            <ShoppingBag className="w-5 h-5 text-white/80" />
            {itemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 
                           bg-gradient-to-br from-primary to-amber-500 
                           rounded-full flex items-center justify-center
                           shadow-[0_0_12px_rgba(255,122,0,0.5)]"
              >
                <span className="text-[10px] font-extrabold text-dark">
                  €{total.toFixed(0)}
                </span>
              </motion.div>
            )}
          </motion.button>
        )}
      </div>
    </header>
  );
}
