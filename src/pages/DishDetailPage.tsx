import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Star,
  Clock,
  Minus,
  Plus,
  ChevronLeft,
  Share2,
  AlertTriangle,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/ui/rating-stars';
import { Textarea } from '@/components/ui/input';
import { PageTransition } from '@/components/ui/page-transition';
import type { MenuItem } from '@/lib/api';

export default function DishDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const haptics = useHaptics();
  const toast = useToast();

  // Get item from navigation state or fetch
  const item = (location.state as { item?: MenuItem })?.item;

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlist, toggleWishlist } = useWishlistStore();
  const isInWishlist = item ? wishlist.some((w) => w.id === item.id) : false;

  const cartItems = useCartStore((state) => state.items);
  const existingCartItem = item
    ? cartItems.find((ci) => ci.menuItem.id === item.id)
    : null;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    haptics.impactMedium();
    addItem(item, quantity, specialInstructions || undefined);
    toast.success(`${quantity}x ${item.name} added to cart`);
    navigate(-1);
  };

  const handleToggleWishlist = () => {
    haptics.impactLight();
    toggleWishlist(item);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const totalPrice = item.price * quantity;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero image */}
        <div className="relative h-72 bg-muted">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Header buttons */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-safe-top">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: item.name,
                      text: item.description,
                    });
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
              >
                <Heart
                  className={cn(
                    'w-5 h-5',
                    isInWishlist
                      ? 'fill-error text-red-400'
                      : 'fill-transparent text-white'
                  )}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6 -mt-6 glass-card rounded-t-3xl relative">
          {/* Name and price row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {item.name}
              </h1>
              {item.category && (
                <span className="text-sm text-white/60">
                  {item.category.name_en || item.category.name}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent-coral">
                €{item.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Rating and time */}
          <div className="flex items-center gap-4 mb-4">
            <RatingStars rating={4.5} reviewCount={128} size="sm" />
            {item.preparation_time_minutes && (
              <div className="flex items-center gap-1 text-white/60">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{item.preparation_time_minutes} min</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-white/60 leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Dietary info */}
          {(item.allergens?.length > 0 || item.dietary_restrictions?.length > 0) && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-2">
                Dietary Information
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens?.map((allergen) => (
                  <span
                    key={allergen}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-accent-orange/10 text-accent-orange rounded-full"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {allergen}
                  </span>
                ))}
                {item.dietary_restrictions?.map((diet) => (
                  <span
                    key={diet}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full"
                  >
                    <Leaf className="w-3 h-3" />
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-2">
                Ingredients
              </h3>
              <p className="text-sm text-white/60">
                {item.ingredients.join(', ')}
              </p>
            </div>
          )}

          {/* Special instructions */}
          <div className="mb-6">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-semibold text-white">
                Special Instructions
              </span>
              <motion.span
                animate={{ rotate: showInstructions ? 180 : 0 }}
                className="text-white/60"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="E.g., no onions, extra sauce, allergies..."
                    className="mt-2"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-semibold text-white">Quantity</span>
            <div className="flex items-center gap-4 bg-muted rounded-full px-4 py-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full glass-card shadow-sm flex items-center justify-center disabled:opacity-40"
              >
                <Minus className="w-4 h-4 text-white" />
              </motion.button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="w-8 text-center font-bold text-lg text-white"
              >
                {quantity}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-primary shadow-sm flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Existing cart item notice */}
          {existingCartItem && (
            <div className="mb-4 p-3 bg-primary/20 rounded-lg">
              <p className="text-sm text-primary">
                ✓ You already have {existingCartItem.quantity}x in your cart
              </p>
            </div>
          )}

          {/* Add to cart button */}
          <Button
            fullWidth
            size="lg"
            onClick={handleAddToCart}
            className="shadow-glow"
          >
            Add to Cart – €{totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
