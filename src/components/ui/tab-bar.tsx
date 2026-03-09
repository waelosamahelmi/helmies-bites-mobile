import { cn } from '@/lib/utils';

interface TabBarProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabBar({ tabs, activeTab, onChange, className }: TabBarProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto hide-scrollbar px-4', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all',
            activeTab === tab.id
              ? 'bg-text-primary text-white'
              : 'bg-background text-white/60 hover:bg-muted'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
