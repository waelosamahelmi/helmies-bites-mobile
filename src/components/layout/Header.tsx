import { MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation as useGeoLocation } from '@/contexts/LocationContext';

export function Header() {
  const { address, city } = useGeoLocation();
  const navigate = useNavigate();
  const displayLocation = address || city || 'Set location';

  return (
    <header className="sticky top-0 z-30 bg-white safe-top">
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
              <span className="text-sm font-bold text-text-primary truncate max-w-[180px]">
                {displayLocation}
              </span>
              <ChevronDown className="w-4 h-4 text-text-secondary flex-shrink-0" />
            </div>
          </div>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-black text-sm">H</span>
          </div>
        </div>
      </div>
    </header>
  );
}
