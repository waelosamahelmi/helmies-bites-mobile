import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Heart, Award, MapPin, Settings, HelpCircle, LogOut, ChevronRight, LogIn,
  Bell, Share2, Moon, Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';
import { Button } from '@/components/ui/button';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { getInitials } from '@/lib/utils';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const haptics = useHaptics();

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white dark:bg-gray-950 safe-top">
          <div className="px-6 pt-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-full bg-surface-secondary dark:bg-gray-800 flex items-center justify-center mx-auto mb-4"
            >
              <User className="w-10 h-10 text-text-tertiary" />
            </motion.div>
            <h1 className="text-xl font-black text-text-primary dark:text-white">Welcome to Helmies Bites</h1>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">Sign in to access your account, orders, and rewards</p>
            <div className="mt-6 space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full h-12">
                <LogIn className="w-4 h-4 mr-2" /> Sign in
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')} className="w-full h-12">
                Create account
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const name = user.user_metadata?.full_name || user.email || 'User';

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', path: '/profile', color: 'bg-primary/10 text-primary' },
        { icon: Heart, label: 'Favorites', path: '/favorites', color: 'bg-error/10 text-error' },
        { icon: Award, label: 'Loyalty Rewards', path: '/loyalty', color: 'bg-warning/10 text-warning' },
        { icon: MapPin, label: 'Addresses', path: '/addresses', color: 'bg-info/10 text-info' },
      ],
    },
    {
      title: 'Features',
      items: [
        { icon: Bell, label: 'Notifications', path: '/notifications', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' },
        { icon: Share2, label: 'Invite Friends', path: '/referral', color: 'bg-success/10 text-success', badge: 'Earn 10 EUR' },
      ],
    },
    {
      title: 'More',
      items: [
        { icon: Settings, label: 'Settings', path: '/settings', color: 'bg-surface-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400' },
        { icon: HelpCircle, label: 'Help & Support', path: '/support', color: 'bg-surface-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400' },
      ],
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        {/* Profile header */}
        <FadeIn>
          <div className="bg-gradient-to-br from-primary to-primary-600 safe-top px-4 pt-6 pb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30"
              >
                <span className="text-white font-black text-xl">{getInitials(name)}</span>
              </motion.div>
              <div>
                <h1 className="text-lg font-black text-white">{name}</h1>
                <p className="text-sm text-white/70">{user.email}</p>
              </div>
            </div>

            {/* Quick theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={() => { toggleTheme(); haptics.impact('light'); }}
              className="absolute top-safe right-4 mt-4 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
            >
              {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            </motion.button>
          </div>
        </FadeIn>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <FadeIn key={section.title} delay={0.1 + si * 0.05}>
            <div className="mt-2">
              <p className="px-4 py-2 text-[10px] font-bold text-text-tertiary dark:text-gray-600 uppercase tracking-wider">
                {section.title}
              </p>
              <div className="bg-white dark:bg-gray-900">
                {section.items.map(({ icon: Icon, label, path, color, badge }) => (
                  <motion.button
                    key={path}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { navigate(path); haptics.impact('light'); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border dark:border-gray-800 last:border-none"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-text-primary dark:text-white text-left">{label}</span>
                    {badge && (
                      <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-text-tertiary dark:text-gray-600" />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}

        {/* Sign out */}
        <FadeIn delay={0.3}>
          <div className="bg-white dark:bg-gray-900 mt-2">
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-4 py-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center">
                <LogOut className="w-[18px] h-[18px] text-error" />
              </div>
              <span className="text-sm font-semibold text-error text-left">Sign out</span>
            </button>
          </div>
        </FadeIn>

        <div className="h-24" />
      </div>
    </PageTransition>
  );
}
