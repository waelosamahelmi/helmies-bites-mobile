import { useNavigate } from 'react-router-dom';
import {
  User, Heart, Award, MapPin, Settings, HelpCircle, LogOut, ChevronRight, LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white safe-top">
        <div className="px-6 pt-16 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-text-tertiary" />
          </div>
          <h1 className="text-xl font-black text-text-primary">Welcome to Helmies Bites</h1>
          <p className="text-sm text-text-secondary mt-2">Sign in to access your account, orders, and rewards</p>
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
    );
  }

  const name = user.user_metadata?.full_name || user.email || 'User';

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: Award, label: 'Loyalty rewards', path: '/loyalty' },
    { icon: MapPin, label: 'Addresses', path: '/addresses' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/support' },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Profile header */}
      <div className="bg-white safe-top px-4 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-black text-lg">{getInitials(name)}</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-text-primary">{name}</h1>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white mt-2">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-none hover:bg-surface-secondary transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-secondary flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-text-secondary" />
            </div>
            <span className="flex-1 text-sm font-semibold text-text-primary text-left">{label}</span>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <div className="bg-white mt-2">
        <button
          onClick={async () => { await signOut(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-secondary transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center">
            <LogOut className="w-4.5 h-4.5 text-error" />
          </div>
          <span className="text-sm font-semibold text-error text-left">Sign out</span>
        </button>
      </div>

      <div className="h-20" />
    </div>
  );
}