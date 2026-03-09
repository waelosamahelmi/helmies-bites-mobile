import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Heart, Award, MapPin, Settings, HelpCircle, LogOut, ChevronRight, LogIn,
  Bell, Share2, ShoppingBag, LucideIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHaptics } from '@/hooks/useHaptics';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { getInitials } from '@/lib/utils';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
  iconColor: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const haptics = useHaptics();

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background safe-top">
          <div className="px-6 pt-20 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full glass-card flex items-center justify-center mx-auto mb-6"
            >
              <User className="w-12 h-12 text-white/30" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl font-extrabold text-white">
                Welcome to <span className="gradient-text">Helmies Bites</span>
              </h1>
              <p className="text-base text-white/50 mt-3 max-w-xs mx-auto">
                Sign in to access your orders, favorites, and rewards
              </p>
            </motion.div>
            <motion.div 
              className="mt-8 space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                onClick={() => navigate('/login')} 
                className="w-full btn-primary rounded-xl py-4 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-bold">Sign in</span>
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="w-full glass-card rounded-xl py-4 text-white font-semibold"
              >
                Create account
              </button>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const name = user.user_metadata?.full_name || user.email || 'User';

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', path: '/profile', color: 'from-primary/30 to-primary/10', iconColor: 'text-primary', badge: undefined },
        { icon: ShoppingBag, label: 'Orders', path: '/orders', color: 'from-blue-500/30 to-blue-500/10', iconColor: 'text-blue-400', badge: undefined },
        { icon: Heart, label: 'Favorites', path: '/favorites', color: 'from-red-500/30 to-red-500/10', iconColor: 'text-red-400', badge: undefined },
        { icon: MapPin, label: 'Addresses', path: '/addresses', color: 'from-green-500/30 to-green-500/10', iconColor: 'text-green-400', badge: undefined },
      ],
    },
    {
      title: 'Rewards',
      items: [
        { icon: Award, label: 'Loyalty Rewards', path: '/loyalty', color: 'from-amber-500/30 to-amber-500/10', iconColor: 'text-amber-400', badge: '120 pts' },
        { icon: Share2, label: 'Invite Friends', path: '/referral', color: 'from-purple-500/30 to-purple-500/10', iconColor: 'text-purple-400', badge: 'Earn €10' },
      ],
    },
    {
      title: 'More',
      items: [
        { icon: Bell, label: 'Notifications', path: '/notifications', color: 'from-white/10 to-white/5', iconColor: 'text-white/60', badge: undefined },
        { icon: Settings, label: 'Settings', path: '/settings', color: 'from-white/10 to-white/5', iconColor: 'text-white/60', badge: undefined },
        { icon: HelpCircle, label: 'Help & Support', path: '/support', color: 'from-white/10 to-white/5', iconColor: 'text-white/60', badge: undefined },
      ],
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Profile header */}
        <FadeIn>
          <div className="relative overflow-hidden safe-top">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-amber-500/80 to-primary" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative px-4 pt-8 pb-10">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-18 h-18 rounded-2xl bg-dark/30 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20"
                  style={{ width: 72, height: 72 }}
                >
                  <span className="text-white font-black text-2xl">{getInitials(name)}</span>
                </motion.div>
                <div>
                  <h1 className="text-xl font-extrabold text-white">{name}</h1>
                  <p className="text-sm text-white/70">{user.email}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-4 mt-6">
                <div className="flex-1 glass-card-light rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-white">12</p>
                  <p className="text-xs text-white/60">Orders</p>
                </div>
                <div className="flex-1 glass-card-light rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-white">120</p>
                  <p className="text-xs text-white/60">Points</p>
                </div>
                <div className="flex-1 glass-card-light rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-white">5</p>
                  <p className="text-xs text-white/60">Favorites</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Menu sections */}
        <div className="px-4 -mt-2">
          {menuSections.map((section, si) => (
            <FadeIn key={section.title} delay={0.1 + si * 0.05}>
              <div className="mt-6">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 pl-1">
                  {section.title}
                </p>
                <div className="glass-card rounded-2xl overflow-hidden">
                  {section.items.map(({ icon: Icon, label, path, color, iconColor, badge }, i) => (
                    <motion.button
                      key={path}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { navigate(path); haptics.impactLight(); }}
                      className={`w-full flex items-center gap-3 px-4 py-4 ${
                        i !== section.items.length - 1 ? 'border-b border-white/5' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <span className="flex-1 text-sm font-semibold text-white text-left">{label}</span>
                      {badge && (
                        <span className="text-xs font-bold text-primary bg-primary/20 px-2.5 py-1 rounded-full">
                          {badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Sign out */}
          <FadeIn delay={0.3}>
            <div className="mt-6 mb-8">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={async () => { await signOut(); navigate('/'); }}
                className="w-full glass-card rounded-2xl flex items-center gap-3 px-4 py-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/30 to-red-500/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-sm font-semibold text-red-400 text-left">Sign out</span>
              </motion.button>
            </div>
          </FadeIn>
        </div>

        <div className="h-24" />
      </div>
    </PageTransition>
  );
}
