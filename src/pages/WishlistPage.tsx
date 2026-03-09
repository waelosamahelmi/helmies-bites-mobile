import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { Button } from '@/components/ui/button';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useWishlistStore, useCartStore } from '@/stores';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/components/ui/toast';

export default function WishlistPage() {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const toast = useToast();

  const { items, clearWishlist, removeFromWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddAllToCart = () => {
    haptics.impactMedium();
    items.forEach((item) => addItem(item));
    toast.success(`${items.length} items added to cart`);
  };

  const handleClearWishlist = () => {
    haptics.impactLight();
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header title="Wishlist" showBack showCart />

        <div className="pt-header">
          {items.length === 0 ? (
            // Empty state
            <FadeIn>
              <div className="flex flex-col items-center justify-center px-8 py-20">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Heart className="w-12 h-12 text-white/40" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-white/60 text-center mb-6">
                  Save your favorite dishes here for quick access later
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Menu
                </Button>
              </div>
            </FadeIn>
          ) : (
            <>
              {/* Actions header */}
              <div className="flex items-center justify-between px-4 py-3 glass-card border-b border-white/10">
                <span className="text-sm text-white/60">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearWishlist}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:bg-error/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    onClick={handleAddAllToCart}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/20 rounded-lg font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add All
                  </button>
                </div>
              </div>

              {/* Items list */}
              <div className="px-4 py-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MenuItemCard item={item} variant="horizontal" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
