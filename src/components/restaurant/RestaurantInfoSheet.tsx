import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, Globe, Star, Info } from 'lucide-react';
import type { Restaurant } from '@/hooks/useRestaurants';
import { formatDistance } from '@/lib/utils';
import { RatingStars } from '@/components/ui/rating-stars';

interface RestaurantInfoSheetProps {
  restaurant: Restaurant | null;
  open: boolean;
  onClose: () => void;
}

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function RestaurantInfoSheet({ restaurant, open, onClose }: RestaurantInfoSheetProps) {
  if (!restaurant) return null;

  const { tenant, branch, distance, rating } = restaurant;

  // Mock opening hours
  const openingHours = branch.opening_hours || {
    mon: '10:00-22:00',
    tue: '10:00-22:00',
    wed: '10:00-22:00',
    thu: '10:00-22:00',
    fri: '10:00-23:00',
    sat: '11:00-23:00',
    sun: '11:00-21:00',
  };

  const todayIndex = new Date().getDay();
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 sheet-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl max-h-[80vh] overflow-y-auto"
          >
            <div className="px-4 py-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {tenant.name_en || tenant.name}
                  </h2>
                  <p className="text-sm text-white/60 mt-0.5">
                    {restaurant.cuisineType || 'Restaurant'}
                  </p>
                </div>
                <button onClick={onClose} className="p-1">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={rating} size="sm" />
                  <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-white/40">(120+ ratings)</span>
              </div>

              {/* Info rows */}
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Address</p>
                    <p className="text-sm text-white/60">
                      {branch.address}, {branch.postal_code} {branch.city}
                    </p>
                    <p className="text-xs text-primary mt-0.5">{formatDistance(distance)} away</p>
                  </div>
                </div>

                {/* Phone */}
                {branch.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Phone</p>
                      <a href={`tel:${branch.phone}`} className="text-sm text-primary">{branch.phone}</a>
                    </div>
                  </div>
                )}

                {/* Opening hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-2">Opening hours</p>
                    <div className="space-y-1.5">
                      {dayNames.map((day, i) => {
                        const key = dayKeys[(i + 1) % 7];
                        const hours = (openingHours as Record<string, string>)[key] || 'Closed';
                        const isToday = (i + 1) % 7 === todayIndex;
                        return (
                          <div key={day} className={`flex justify-between text-sm ${
                            isToday ? 'font-bold text-primary' : 'text-white/60'
                          }`}>
                            <span>{day}</span>
                            <span>{hours}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {(tenant.description_en || tenant.description) && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">About</p>
                      <p className="text-sm text-white/60">
                        {tenant.description_en || tenant.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-safe mt-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
