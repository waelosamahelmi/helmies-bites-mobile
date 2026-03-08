import { Moon, Sun, Bell, Globe, Shield, Smartphone, Info, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { FadeIn } from '@/components/ui/page-transition';

interface SettingItem {
  icon: typeof Moon;
  label: string;
  value?: string;
  toggle?: boolean;
  isOn?: boolean;
  onToggle?: () => void;
  action?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsPage() {
  const { toggleTheme, isDark } = useTheme();
  const toast = useToast();

  const sections: SettingSection[] = [
    {
      title: 'Appearance',
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: 'Dark Mode',
          value: isDark ? 'On' : 'Off',
          toggle: true,
          isOn: isDark,
          onToggle: () => { toggleTheme(); toast.info(`${isDark ? 'Light' : 'Dark'} mode enabled`); },
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Push Notifications', toggle: true, isOn: true, onToggle: () => toast.info('Notification settings updated') },
        { icon: Bell, label: 'Order Updates', toggle: true, isOn: true, onToggle: () => toast.info('Notification settings updated') },
        { icon: Bell, label: 'Promotions', toggle: true, isOn: true, onToggle: () => toast.info('Notification settings updated') },
      ],
    },
    {
      title: 'General',
      items: [
        { icon: Globe, label: 'Language', value: 'English', action: true },
        { icon: Shield, label: 'Privacy Policy', action: true },
        { icon: Info, label: 'Terms of Service', action: true },
        { icon: Smartphone, label: 'App Version', value: '1.0.0' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
      <BackHeader title="Settings" />

      {sections.map((section, si) => (
        <FadeIn key={section.title} delay={si * 0.1}>
          <div className="mt-2">
            <p className="px-4 py-2 text-xs font-bold text-text-tertiary dark:text-gray-500 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="bg-white dark:bg-gray-900">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.toggle ? item.onToggle : undefined}
                    className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border dark:border-gray-800 last:border-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-secondary dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-text-secondary dark:text-gray-400" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-text-primary dark:text-white text-left">
                      {item.label}
                    </span>
                    {item.toggle ? (
                      <div className={`w-12 h-7 rounded-full transition-colors relative ${
                        item.isOn ? 'bg-primary' : 'bg-border-strong dark:bg-gray-700'
                      }`}>
                        <motion.div
                          animate={{ x: item.isOn ? 20 : 2 }}
                          transition={{ type: 'spring', damping: 20 }}
                          className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm"
                        />
                      </div>
                    ) : item.action ? (
                      <div className="flex items-center gap-1">
                        {item.value && <span className="text-xs text-text-tertiary dark:text-gray-500">{item.value}</span>}
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                      </div>
                    ) : (
                      <span className="text-xs text-text-tertiary dark:text-gray-500">{item.value}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>
      ))}

      <div className="h-20" />
    </div>
  );
}
